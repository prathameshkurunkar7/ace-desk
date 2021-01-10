const mongoose = require('mongoose');
const {validationResult} = require('express-validator');
const HttpError = require('../../utils/http-error');
const Employee = mongoose.model('Employee');
const Department = mongoose.model('Department');

// create departments
const createDepartment = async(req,res,next) =>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new HttpError(`${errors.array()[0].msg} given at ${errors.array()[0].param.toLowerCase()} ,please enter valid input.`
            , 422,true)
        return next(err);
    }
    
    const {deptName} = req.body;
    let dept;
    try {
        dept = await Department.findOne({ deptName });
    } catch (err) {
        const error = new HttpError('Some error occured while looking for department',500);
        return next(error);
    }

    if(dept){
        return next(new HttpError('Department already exists',500));
    }

    const department = new Department({
        deptName
    });
    
    try {
        await department.save();
    } catch (err) {
        const error = new HttpError('Could Not Create Department',500);
        return next(error);
    }

    res.status(201).json(department);

}

// remove departments
const dissolveDepartment = async(req,res,next) =>{
    const {deptId} = req.body;
    
    let dept;
    try {
        dept = await Department.findById(deptId);
    } catch (err) {
        const error = new HttpError('Could not find department',500);
        return next(error);
    }
    if(!dept){
        return next(new HttpError('Department does not exist.',404));
    }

    try {
        await Department.findByIdAndDelete(deptId);
        await Employee.updateMany({"department":deptId},{"department":undefined});
    } catch (err) {
        const error = new HttpError('Could not dissolve department',500);
        return next(error);
    }

    res.status(200).json({"message":"Department has been dissolved"});

}

exports.createDepartment = createDepartment;
exports.dissolveDepartment = dissolveDepartment;