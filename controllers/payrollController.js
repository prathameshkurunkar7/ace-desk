const mongoose = require('mongoose');
const HttpError = require('../utils/http-error');
const {validationResult} = require('express-validator');
const Payroll = mongoose.model('Payroll');
const Employee = mongoose.model('Employee');
const UserAuth = mongoose.model('UserAuth');
const {MetroCities} =require('../utils/helperData');
const Payslip = require('../utils/pdfToHtml');
const Email = require('../utils/mailService');

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
        employee = await Employee.findByIdAndUpdate(empId,{payroll:payroll.id},{new:true});
    } catch (err) {
        const error = new HttpError('Something went wrong!',500);
        return next(error);
    }
    if(!payroll){
        return next(new HttpError('Payroll does not exist for this employee',500));
    }

    const employeeCity = employee.addresses['Residential.city'];
    
    const basicSalary = payroll.salaryPerAnnum/2;
    const HRA = MetroCities.includes(employeeCity)?basicSalary*(50/100):basicSalary*(40/100);
    const otherAllowances = basicSalary-HRA;
    const grossSalary = basicSalary+HRA+otherAllowances;
    
    // const grossSalaryPerMonth =grossSalary/12;
    const avgTdsRate=tdsCalc(payroll.salaryPerAnnum)
    const totalTds = (avgTdsRate/100)*grossSalary;
    
    const DA = (345-126.33)/126.33*100;
    const EPF = ((12/100)*(basicSalary+DA))<15000 ?(12/100)*(basicSalary+DA):15000;
    const ESI = ((0.75/100)*grossSalary)<21000?(0.75/100)*grossSalary:21000;
    const professionalTax = payroll.deductions['professional'];
    
    const totalDeductions = EPF+ESI+professionalTax;
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
            deductions
        },{new:true}).populate('empId','firstName lastName')
    } catch (err) {
        console.log(err);
        const error = new HttpError('Could Not Create Payment',500);
        return next(error);
    }

    const allowanceLimit = (empPayroll.basicSalary-(empPayroll.allowances['houseRent']+empPayroll.allowances['dearness']))/12;
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
        "totalDeductions":totalDeductions+totalTds
    }

    res.status(201).json(newPayroll);

}


const addAllowances = async(req,res,next) =>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new HttpError(`${errors.array()[0].msg} given at ${errors.array()[0].param.toLowerCase()} ,please enter valid input.`
            , 422,true)
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

    if((phone+conveyance+medical)>payroll.allowances['otherAllowanceTotal']/12){
        return next(new HttpError('Exceeds allowance limit',400));
    }
    if(performance>2000){
        return next(new HttpError('Exceeds performance allowance limit',400));
    }

    payroll.netSalary = payroll.netSalary+performance;
    payroll.allowances['phone'] = phone;
    payroll.allowances['conveyance'] = conveyance;
    payroll.allowances['medical'] = medical;
    payroll.allowances['performance'] = performance;
    
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
    
    try {
        await new Payslip().pdf(payroll.toJSON());
    } catch (err) {
        console.log(err);
        return next(new HttpError('Email Not sent',500));
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
    const educationCess = 0.04;
    const netTaxable = educationCess*tds+tds;
    const avgRateOfTds = (netTaxable/salaryPA)*100;
    return avgRateOfTds;
}

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

exports.createPaySlip = createPaySlip;
exports.generatePdf = generatePdf;
exports.addAllowances = addAllowances;
exports.sendPaySlip = sendPaySlip;