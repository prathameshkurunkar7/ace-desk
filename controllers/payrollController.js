const mongoose = require('mongoose');
const HttpError = require('../utils/http-error');
const {validationResult} = require('express-validator');
const Payroll = mongoose.model('Payroll');
const Employee = mongoose.model('Employee');
const UserAuth = mongoose.model('UserAuth');
const {MetroCities} =require('../utils/helperData');
const Payslip = require('../utils/pdfGenerator');
const Email = require('../utils/mailService');

const getPayrolls = async(req,res,next) =>{
    
    let payrolls,numPayrolls;
    try {

        //filtering
        const queryObj = {...req.query};
        const fieldsExclude = ['page','sort','limit','fields'];
        fieldsExclude.forEach(elem => delete queryObj[elem]);

        let query = Employee.find(queryObj);

        //sorting
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        }else{
            query = query.sort('-id');
        }

        // field limiting
        if(req.query.fields){
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        }else{
            query = query.select('-__v'); 
        }
        
        // pagination
        const limit = req.query.limit*1 || 10;
        const page = req.query.page*1 || 1;
        const offset = (page-1)*limit;
        
        query = query.skip(offset).limit(limit);
        
        if(req.query.page){
            numPayrolls = await Employee.countDocuments();
            if(offset >= numPayrolls){
                return next(new HttpError('This Page does not exist',404));
            }
        }
        //Execute query
        payrolls = await query.populate([{path:'payroll',select:'salaryPerAnnum'},{path:'department',select:'deptName'}]);
    } catch (err) {
        const error = new HttpError('Failed to get schedule details',500);
        return next(error);
    }
    
    res.status(200).json({payrolls,totalCount:numPayrolls?numPayrolls:0});
}

const createPaySlip = async(req,res,next) =>{
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new HttpError(`${errors.array()[0].msg} given at ${errors.array()[0].param.toLowerCase()} ,please enter valid input.`
            , 422)
        return next(err);
    }
    
    const {empId} = req.body;

    let payroll,employee;
    try {
        payroll=await Payroll.findOne({empId:empId});
        employee = await Employee.findById(empId);
    } catch (err) {
        const error = new HttpError('Something went wrong!',500);
        return next(error);
    }
    if(!payroll){
        return next(new HttpError('Payroll does not exist for this employee',500));
    }

    let emploan=0;
    let empbonus=0;
    if(payroll.loan['status'] ==='Accepted'){
        emploan = payroll.loan['amount']
    }
    if(payroll.bonus['status'] ==='Accepted'){
        empbonus = payroll.bonus['amount']
    }

    const employeeCity = employee.addresses['Residential.city'];
    
    const basicSalary = payroll.salaryPerAnnum/2;
    // HRA 40% for non-metro residents and 50% for Metro residents
    const HRA = MetroCities.includes(employeeCity)?basicSalary*(50/100):basicSalary*(40/100);
    const DA = (345-126.33)/126.33*100;
    
    const otherAllowances = basicSalary-(HRA+DA);
    const grossSalary = basicSalary+HRA+DA+otherAllowances+empbonus;
    
    const avgTdsRate=tdsCalc(payroll.salaryPerAnnum)
    const totalTds = (avgTdsRate/100)*grossSalary;
    
    // calculations based on fiscal year 2020-2021 rates
    const EPF = ((12/100)*(basicSalary+DA))<15000 ?(12/100)*(basicSalary+DA):15000;
    const ESI = ((0.75/100)*grossSalary)<21000?(0.75/100)*grossSalary:21000;
    const professionalTax = payroll.deductions['professional'];
    
    const totalDeductions = EPF+ESI+professionalTax+(emploan/12);
    const netSalary = (grossSalary -(totalDeductions+totalTds));

    const allowances = {
        dearness:DA,
        houseRent:HRA,
        otherAllowanceTotal: otherAllowances
    }
    
    const deductions = {
        tds:totalTds,
        epf:EPF,
        esi:ESI,
        totalDeductions:totalDeductions+totalTds
    }

    let empPayroll;
    try {
        empPayroll = await Payroll.findByIdAndUpdate(payroll.id,{
            basicSalary,
            netSalary,
            grossSalary,
            allowances,
            deductions,
        },{new:true}).populate('empId','firstName lastName designation employeeSerialId')
    } catch (err) {
        const error = new HttpError('Could Not Create Payment',500);
        return next(error);
    }

    const allowanceLimit = empPayroll.allowances['otherAllowanceTotal']/12;
    const newPayroll = {
        "allowances": {
            "dearness": empPayroll.allowances['dearness'],
            "houseRent": empPayroll.allowances['houseRent']/12
        },
        "deductions": {
            "professional": empPayroll.deductions['professional']/12,
            "tds": empPayroll.deductions['tds']/12,
            "epf": empPayroll.deductions['epf']/12,
            "esi": empPayroll.deductions['esi']/12
        },
        "_id": empPayroll.id,
        "empId": empPayroll.empId,
        "salaryPerMonth": empPayroll.salaryPerAnnum/12,
        "basicSalary": empPayroll.basicSalary/12,
        "grossSalary": empPayroll.grossSalary/12,
        "netSalary": empPayroll.netSalary/12,
        "allowanceLimit":allowanceLimit,
        "totalDeductions":totalDeductions+totalTds,
        "loan":emploan/12,
        "bonus":empbonus
    }

    res.status(201).json({payroll:newPayroll});

}


const addAllowances = async(req,res,next) =>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new HttpError(`${errors.array()[0].msg} given at ${errors.array()[0].param.toLowerCase()} ,please enter valid input.`
            , 422)
        return next(err);
    }

    const{phone,conveyance,medical,performance} = req.body;
    const payrollId = req.params.payrollId;
    let payroll;
    try {
        payroll = await Payroll.findById(payrollId);
    } catch (err) {
        const error = new HttpError('Something went wrong!',500);
        return next(error);
    }

    if((Number(phone)+Number(conveyance)+Number(medical))>(payroll.allowances['otherAllowanceTotal']/12)){
        return next(new HttpError('Exceeds allowance limit',400));
    }
    if(performance>2000){
        return next(new HttpError('Exceeds performance allowance limit of 2000',400));
    }

    payroll.netSalary = Number(payroll.netSalary)+Number(performance);
    payroll.allowances['phone'] = phone;
    payroll.allowances['conveyance'] = conveyance;
    payroll.allowances['medical'] = medical;
    payroll.allowances['performance'] = performance;
    
    payroll.loan['amount'] = payroll.loan['amount']-(payroll.loan['amount']/12);
    payroll.bonus['amount'] = payroll.bonus['amount']-payroll.bonus['amount'];

    let newPayroll;
    try {
        newPayroll = await Payroll.findByIdAndUpdate(payroll.id,payroll,{new:true});
    } catch (err) {
        const error = new HttpError('Some error occured',500);
        return next(error);    
    }

    res.status(200).json(newPayroll);
}

const generatePdf = async(req,res,next) =>{
    
    let payroll;
    try {
        payroll = await Payroll.findById(req.params.payrollId).populate('empId','firstName lastName designation dateOfJoining employeeSerialId addresses');
    } catch (err) {
        const error = new HttpError('Something went wrong!',500);
        return next(error);
    }

    payroll.allowances['houseRent'] = payroll.allowances['houseRent']/12;
    payroll.deductions['professional']= payroll.deductions['professional']/12;
    payroll.deductions['tds']=payroll.deductions['tds']/12;
    payroll.deductions['epf']=payroll.deductions['epf']/12;
    payroll.deductions['esi']=payroll.deductions['esi']/12;
    payroll.salaryPerAnnum=payroll.salaryPerAnnum/12;
    payroll.basicSalary=payroll.basicSalary/12;
    payroll.grossSalary=payroll.grossSalary/12;
    payroll.netSalary=payroll.netSalary/12;
    payroll.deductions['totalDeductions']=payroll.deductions['totalDeductions']/12;
    payroll.loan['amount']=payroll.loan['amount']/12;

    try {
        await new Payslip().pdf(payroll.toJSON());
    } catch (err) {
        return next(new HttpError('Pdf not generated',500));
    }
    
    res.status(200).json("Pdf has been generated");
}

const sendPaySlip = async(req,res,next) =>{
    let payroll;
    try {
        payroll = await Payroll.findById(req.params.payrollId).populate('empId','firstName employeeSerialId userAuth');
        userAuth = await UserAuth.findById(payroll.empId['userAuth']);
    } catch (err) {
        const error = new HttpError('Something went wrong!',500);
        return next(error);
    }
    
    try {
        await new Email(userAuth,payroll.empId['firstName']).sendEmployeePaySlip(payroll.toJSON());
    } catch (err) {
        return next(new HttpError('Email not sent',500));   
    }
    
    res.status(200).json("Email sent with payslip to employee successfully");
}

const sanctionLoanBonus = async(req,res,next) =>{
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new HttpError(`${errors.array()[0].msg}`, 422)
        return next(err);
    }

    const empId = req.params.employeeId;
    const {paymentRequest,amount,description,status} = req.body;

    let employee;
    try {
        employee = await Employee.findById(empId);
    } catch (err) {
        const error = new HttpError('Something went wrong!',500);
        return next(error);
    }
    if(!employee){
        return next(new HttpError('No employee found',400));
    }

    if(paymentRequest==='Loan'){
        try {
            await Payroll.findOneAndUpdate({empId},{'loan':{amount,description,status}},{new:true});
        } catch (err) {
            const error = new HttpError('Could not update loan',500);
            return next(error);
        }
    } else if(paymentRequest==='Bonus'){
        try {
            await Payroll.findOneAndUpdate({empId},{'bonus':{amount,description,status}},{new:true});
        } catch (err) {
            const error = new HttpError('Could not update bonus',500);
            return next(error);
        }
    }

    res.status(200).json({'status':`Your request for ${paymentRequest} has been ${status}`});
}

const applyLoanBonus = async(req,res,next) =>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new HttpError(`${errors.array()[0].msg}`, 422)
        return next(err);
    }
    
    const userId = req.user.userId;
    const {paymentRequest,amount,description} = req.body;
    
    let employee;
    try {
        employee = await Employee.findOne({userAuth:userId});
    } catch (err) {
        const error = new HttpError('Something went wrong!',500);
        return next(error);
    }

    if(!employee){
        return next(new HttpError('No employee found',400));
    }

    let payroll;
    try {
        payroll = await Payroll.findOne({empId:employee.id});
    } catch (err) {
        const error = new HttpError('Something went wrong!',500);
        return next(error);
    }

    let newPayroll
    if(paymentRequest === 'Loan'){
        if(payroll.loan['status'] === 'Accepted' && payroll.loan['amount']!==0){
            return next(new HttpError('Ongoing Loan must be completed before applying for another',400));
        }else if(payroll.loan['status']==='Rejected' || payroll.loan['amount']===0){
            try {
                newPayroll = await Payroll.findByIdAndUpdate(payroll.id,{loan:{amount,description,status:'Pending'}},{new:true});
            } catch (err) {
                const error = new HttpError('Could not update loan',500);
                return next(error);
            }
        }else if(payroll.loan['status']==='Pending'){
            return next(new HttpError('Previous Request for loan is still waiting for Approval',400));
        }
    }else if(paymentRequest === 'Bonus'){

        const lastDate = new Date(payroll.bonus['lastDate']);
        const nextMonthDate = new Date();
        const thisDate = new Date();
        nextMonthDate.setMonth(lastDate.getMonth() + 1, 1);

        if(payroll.bonus['status'] === 'Accepted' && thisDate<=nextMonthDate){
            return next(new HttpError('Bonus already given for the month',400));
        }else if(payroll.bonus['status']==='Rejected' || thisDate>nextMonthDate){
            try {
                newPayroll = await Payroll.findByIdAndUpdate(payroll.id,{bonus:{amount,description,status:'Pending',lastDate:thisDate}},{new:true});
            } catch (err) {
                const error = new HttpError('Could not update bonus',500);
                return next(error);
            }
        }else if(payroll.bonus['status']==='Pending'){
            return next(new HttpError('Previous Request for bonus is still waiting for Approval',400));
        }else{
            try {
                newPayroll = await Payroll.findByIdAndUpdate(payroll.id,{bonus:{amount,description,status:'Pending',lastDate:thisDate}},{new:true});
            } catch (err) {
                const error = new HttpError('Could not update bonus',500);
                return next(error);
            }
        }
    }

    res.status(200).json(newPayroll);

}

const getLoanAndBonus = async(req,res,next) =>{
    
    let payrolls,numPayrolls;
    try {

        //filtering
        const queryObj = {...req.query};
        const fieldsExclude = ['page','sort','limit','fields'];
        fieldsExclude.forEach(elem => delete queryObj[elem]);

        let query = Payroll.find(queryObj);

        //sorting
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        }else{
            query = query.sort('-id');
        }

        // field limiting
        if(req.query.fields){
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        }else{
            query = query.select('-__v'); 
        }
        
        // pagination
        const limit = req.query.limit*1 || 10;
        const page = req.query.page*1 || 1;
        const offset = (page-1)*limit;
        
        query = query.skip(offset).limit(limit);
        
        if(req.query.page){
            numPayrolls = await Payroll.countDocuments();
            if(offset >= numPayrolls){
                return next(new HttpError('This Page does not exist',404));
            }
        }
        //Execute query
        payrolls = await query.populate('empId','firstName lastName');
    } catch (err) {
        const error = new HttpError('Failed to get schedule details',500);
        return next(error);
    }
    
    res.status(200).json({payrolls,totalCount:numPayrolls?numPayrolls:payrolls.length});

}


//get employee loans and bonus --employee side route
const empLoanAndBonus = async(req,res,next) =>{
    const userId = req.user.userId;
    let employee,payroll;
    try {
        employee = await Employee.findOne({userAuth:userId});
        payroll = await Payroll.findById(employee.payroll).select('loan bonus');
    } catch (err) {
        const error = new HttpError('Something went wrong',500);
        return next(error);
    }

    res.status(200).json(payroll);
}

// TDS calculation based on fiscal year 2020-2021
function tdsCalc(salaryPA) {
    let taxableAmount = salaryPA;
    let buffer = 250000;
    const slabs = 7;
    let tds=0;
    let arr=[];
    for (let i = 0; i < slabs; i++) {
        const rate=tdsRateCalc(i);
        if(buffer<=taxableAmount && i!=6){
            buffer = buffer;
        }else{
            buffer = taxableAmount
        }
        tds=buffer*rate;
        arr.push(tds);
        taxableAmount=taxableAmount-buffer;
        if(taxableAmount===0){
            break;
        }
    }
    tds = arr.reduce((prev,curr)=>prev+curr);
    const educationCess = 0.04; //education cess according to fiscal year 2020-2021
    const netTaxable = educationCess*tds+tds;
    const avgRateOfTds = (netTaxable/salaryPA)*100;
    return avgRateOfTds;
}

// income tax slab rates according to Fiscal Year 2020-2021
function tdsRateCalc(slab){
    let rate;
    switch (slab) {
        case 0:rate=0;
            break;
        case 1:rate=0.05;
            break;
        case 2:rate=0.1;
            break;
        case 3:rate=0.15;
            break;
        case 4:rate=0.2;
            break;
        case 5:rate=0.25;
            break;
        case 6:rate=0.3;
            break;
        default:
            break;
    }
    return rate;
}

exports.getPayrolls = getPayrolls;
exports.createPaySlip = createPaySlip;
exports.generatePdf = generatePdf;
exports.addAllowances = addAllowances;
exports.sendPaySlip = sendPaySlip;
exports.sanctionLoanBonus = sanctionLoanBonus;
exports.applyLoanBonus = applyLoanBonus;
exports.empLoanAndBonus = empLoanAndBonus;
exports.getLoanAndBonus = getLoanAndBonus;