const mongoose = require('mongoose');
const fs = require('fs');
const HttpError = require("../../utils/http-error");
const {validationResult} = require('express-validator');
const Employee = mongoose.model('Employee');

const updateProfile = async(req,res,next) =>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new HttpError(`${errors.array()[0].msg} given at ${errors.array()[0].param.toLowerCase()} ,please enter valid input.`
            , 422)
        return next(err);
    }
    const userId =  req.user.userId;

    let emp;
    try {
        emp = await Employee.findOne({userAuth:userId})
    } catch (err) {
        const error = new HttpError('Some error occurred while uploading file',500);
        return next(error);
    }

    if(!emp){
        return next(new HttpError('Employee does not exist',400));
    }
    
    let profileImage;
    if(req.file){
        profileImage = req.file.path;
    }

    if(emp.profileImage && profileImage){
        fs.unlink(emp.profileImage,(err)=>{
            if(err){
                console.log(err);
            }
        });
    }

    const {github,linkedIn,twitter} = req.body;
    const socialHandles = {
        github,
        linkedIn,
        twitter
    }

    let employee;
    try {
        employee = await Employee.findOneAndUpdate({userAuth:userId},{profileImage:profileImage,socialHandles},{new:true});
    } catch (err) {
        const error = new HttpError('Some error occurred while uploading file',500);
        return next(error);
    }

    res.status(200).json(employee);
}

exports.updateProfile = updateProfile;