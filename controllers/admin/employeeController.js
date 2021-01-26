const mongoose = require('mongoose');
const crypto = require('crypto');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');
const Email = require("../../utils/mailService");
const HttpError = require('../../utils/http-error');
const appConfig = require("../../config/appConfig");
const Employee = mongoose.model('Employee');
const UserAuth = mongoose.model('UserAuth');
const Department = mongoose.model('Department');
const Attendance = mongoose.model('Attendance');
const Leave = mongoose.model('Leave');
const Team = mongoose.model('Team');
const Payroll = mongoose.model('Payroll');

//POST Create a new Employee
const createEmployee = async(req,res,next) =>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new HttpError(`${errors.array()[0].msg} given at ${errors.array()[0].param.toLowerCase()} ,please enter valid input.`
            , 422)
        return next(err);
    }

    const {
        firstName,lastName,gender,dateOfBirth,
        bloodGroup,dateOfJoining,contactNumbers,
        addresses,email,designation,department,
        salaryPerAnnum,education,
        work
    } = req.body;
   
    let existingEmployee,dept;
    try {
        existingEmployee = await UserAuth.findOne({ email });
        dept = await Department.findById(department);
    } catch (err) {
        const error = new HttpError('Employee Auth Creation failed,please try again.', 500);
        return next(error);
    }

    if (existingEmployee) {
        const error = new HttpError('Employee already exists.', 422);
        return next(error);
    }
    if(!dept){
        return next(new HttpError('Department Does not exist',404));
    }

    let createdEmployeeAuth = new UserAuth({
       email,
       password: empTempPasswordGenerator(),
    })

    try {
        createdEmployeeAuth = await createdEmployeeAuth.save();
    } catch (err) {
        const error = new HttpError('New Employee was not created',500);
        return next(error);
    }

    //save Employee details in Employee collection
    let newEmployee = new Employee({
        firstName,
        lastName,
        employeeSerialId:empSerialIdGenerator(dateOfJoining),
        gender,
        dateOfBirth,
        dateOfJoining,
        bloodGroup,
        contactNumbers,
        addresses,
        designation,
        userAuth:createdEmployeeAuth.id,
        department,
        work,
        education
    });

    try {
        newEmployee = await newEmployee.save();
        await Department.findByIdAndUpdate(department,{$push:{employees:newEmployee.id}});
        const attendance = new Attendance({
            empId:newEmployee.id
        });
        const leaves = new Leave({
            empId:newEmployee.id
        })
        const payroll = new Payroll({
            empId:newEmployee.id,
            salaryPerAnnum:salaryPerAnnum
        })
        await attendance.save();
        await leaves.save();
        const pay = await payroll.save();
        newEmployee.payroll = pay.id;
        newEmployee = await newEmployee.save();
    } catch (err) {
        const error = new HttpError('New Employee was not created',500);
        return next(error);
    }


    // add the client side url here for displaying login window.
    const url = `${appConfig.APP_URL}`
    
    //send employee email of their credentials
    let hashedpassword;
    try {
        await new Email(createdEmployeeAuth,newEmployee.firstName).sendEmployeeLoginCred(createdEmployeeAuth['password'],url);
        hashedpassword = await bcrypt.hash(createdEmployeeAuth['password'], 10);
    } catch (err) {
        return next(new HttpError('Email Not sent',500));
    }
    
    try {
        await UserAuth.updateOne({_id:newEmployee.userAuth},{password:hashedpassword});
    } catch (err) {
        const error = new HttpError('Could Not Update User password',500);
        return next(error);    
    }

    res.status(201).json(newEmployee);

}

// GET Employees
const getEmployees = async(req,res,next) =>{

    let employees,numEmployees;
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
            query = query.sort('-dateOfJoining');
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
            numEmployees = await Employee.countDocuments();
            if(offset >= numEmployees){
                return next(new HttpError('This Page does not exist',404));
            }
        }
        //Execute query
        employees = await query.populate('userAuth','-password -__v').populate('department','deptName');
        
    } catch (err) {
        const error = new HttpError('Failed to get employee details',500);
        return next(error);
    }
    
    res.status(200).json({employees,totalCount:numEmployees?numEmployees:0});

}

// GET Employee by Id
const getEmployeeById = async(req,res,next) =>{
    
    let existingEmployee;
    try {
        existingEmployee = await Employee.findById(req.params.employeeId);
    } catch (err) {
        const error = new HttpError('Could Not fetch Employee details',500);
        return next(error);
    }
    
    if(!existingEmployee){
        return next(new HttpError('No Employee Found',404));
    }

    let employee;
    try {
        employee=await Employee.findById(req.params.employeeId).populate([
            {path:'userAuth',select:'-password -__v'},
            {path:'department',select:'deptName'},
            {path:'payroll',select:'salaryPerAnnum'}
        ]);
    } catch (err) {
        const error = new HttpError('Could Not fetch Employee details',500);
        return next(error);
    }

    if(employee.profileImage){
        employee.profileImage = `${appConfig.APP_URL}/${employee.profileImage}`;
    }

    res.status(200).json(employee);
}

const updateEmployee = async(req,res,next) =>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new HttpError(`${errors.array()[0].msg} given at ${errors.array()[0].param.toLowerCase()} ,please enter valid input.`
            , 422)
        return next(err);
    }
    
    let existingEmployee;
    try {
        existingEmployee = await Employee.findById(req.params.employeeId);
    } catch (err) {
        const error = new HttpError('Could Not find Employee',500);
        return next(error);
    }
    
    if(!existingEmployee){
        return next(new HttpError('No Employee Found',404));
    }

    if(req.body.email){
        try {
            await UserAuth.findByIdAndUpdate(existingEmployee.userAuth,{email:req.body.email});
        } catch (err) {
            const error = new HttpError('Could Not Update employee',500);
            return next(error);
        }
    }

    let employee;
    try {
        employee = await Employee.findByIdAndUpdate(req.params.employeeId,req.body,{new:true});      
    } catch (err) {
        const error = new HttpError('Could Not Update employee',500);
        return next(error);
    }

    res.status(200).json(employee);

}

const deleteEmployee = async(req,res,next) =>{

    let existingEmployee;
    try {
        existingEmployee = await Employee.findById(req.params.employeeId);
    } catch (err) {
        const error = new HttpError('Could Not find Employee',500);
        return next(error);
    }

    if(!existingEmployee){
        return next(new HttpError('No Employee Found',404));
    }

    try {
        await Employee.findByIdAndDelete(req.params.employeeId);
        await UserAuth.findByIdAndDelete(existingEmployee.userAuth);
        await Attendance.findOneAndDelete({empId:existingEmployee.id});
        await Leave.findOneAndDelete({empId:existingEmployee.id});
        if(existingEmployee.assignedProject){
            const team = await Team.findById(existingEmployee.team);
            if(team.teamLeader === existingEmployee.id){
                await Team.findByIdAndUpdate(existingEmployee.team,{teamLeader:undefined});
            }else{
                await Team.findByIdAndUpdate(existingEmployee.team,{$pull:{teamMembers:existingEmployee.id}});
            }

            if(team.teamMembers.length===0 && !team.teamLeader){
                await Team.findByIdAndDelete(teamId);
                await Project.findByIdAndDelete(team.project);
            }
        }
        await Department.findByIdAndUpdate(existingEmployee.department,{$pull:{employees:existingEmployee.id}});
        await Payroll.findOneAndDelete({empId:existingEmployee.id});
    } catch (err) {
        const error = new HttpError('Could Not delete Employee',500);
        return next(error);
    }

    if(existingEmployee.profileImage){
        fs.unlink(existingEmployee.profileImage,(err)=>{
            if(err){
                console.log(err);
            }
        });
    }

    res.status(200).json({message:"Employee has been deleted successfully"});

}

const empSerialIdGenerator = (dateOfCreation) =>{
    
    const date = new Date(dateOfCreation);
    const length = 4;
    const randomCode = crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length).toUpperCase();
    
    //CN refers to Company Name,replace it later
    const empSerialId = `AD${date.getFullYear()}${date.getMonth()+1}${date.getDate()}${randomCode}`;

    return empSerialId;
}
const empTempPasswordGenerator = () =>{
    const length = 8;
    const tempPassword = crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length).toUpperCase();
    return tempPassword;
}


exports.getEmployees = getEmployees;
exports.getEmployeeById = getEmployeeById;
exports.createEmployee = createEmployee;
exports.updateEmployee = updateEmployee;
exports.deleteEmployee = deleteEmployee;