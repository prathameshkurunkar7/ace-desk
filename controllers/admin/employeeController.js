const Email = require("../../utils/mailService");
const mongoose = require('mongoose');
const crypto = require('crypto');
const HttpError = require('../../utils/http-error');
const bcrypt = require('bcryptjs');
const appConfig = require("../../config/appConfig");
const Employee = mongoose.model('Employee');
const UserAuth = mongoose.model('UserAuth');

const createEmployee = async(req,res,next) =>{

    const {firstName,lastName,gender,dateOfBirth,bloodGroup,dateOfJoining,contactNumbers,addresses,email,designation} = req.body;
   
    let existingEmployee;
    try {
        existingEmployee = await UserAuth.findOne({ email });
    } catch (err) {
        const error = new HttpError('Employee Auth Creation failed,please try again.', 500);
        return next(error);
    }

    if (existingEmployee) {
        const error = new HttpError('Employee already exists.', 422);
        return next(error);
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
        userAuth:createdEmployeeAuth.id
    });

    try {
        newEmployee = await newEmployee.save();
    } catch (err) {
        console.log(err);
        const error = new HttpError('New Employee was not created',500);
        return next(error);
    }

    res.status(201).json(newEmployee);

}

const employeeCredentials = async(req,res,next) =>{
 
    //for the requested employee, give the relevant information as object in Email argument user.
    let employee;
    try {
        employee = await Employee.findById(req.params.employeeId).populate('userAuth');
    } catch (err) {
        const error = new HttpError('Could Not find Employee',500);
        return next(error);
    }

    // add the client side url here for displaying login window.
    const url = `${req.protocol}://${req.hostname}:${appConfig.PORT}/register/login`
    let hashedpassword;
    try {
        await new Email(employee.userAuth,employee.firstName,url).sendEmployeeLoginCred();    
        hashedpassword = await bcrypt.hash(employee.userAuth.password, 10);
    } catch (err) {
        return next(new HttpError('Email Not sent',500));
    }
    
    try {
        await UserAuth.updateOne({_id:employee.userAuth.id},{password:hashedpassword});
    } catch (err) {
        const error = new HttpError('Could Not Update User password',500);
        return next(error);    
    }

    res.status(200).json('Email has been sent successfully');

}

const empSerialIdGenerator = (dateOfCreation) =>{
    
    const date = new Date(dateOfCreation);
    const length = 4;
    const randomCode = crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length).toUpperCase();
    
    //CN refers to Company Name,replace it later
    const empSerialId = `CN${date.getFullYear()}${date.getMonth()+1}${date.getDate()}${randomCode}`;

    return empSerialId;
}
const empTempPasswordGenerator = () =>{
    const length = 8;
    const tempPassword = crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length).toUpperCase();
    return tempPassword;
}


// GET Employees
const getEmployees = async(req,res,next) =>{

    let employees;
    try {
        //Build query

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
            const numEmployees = await Employee.countDocuments();
            if(offset >= numEmployees){
                return next(new HttpError('This Page does not exist'));
            }
        }
        //Execute query
        employees = await query;
        
    } catch (err) {
        const error = new HttpError('Failed to get employee details',500);
        return next(error);
    }
    
    res.status(200).json({employees});

}



exports.employeeCredentials = employeeCredentials;
exports.createEmployee = createEmployee;