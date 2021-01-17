const mongoose = require('mongoose');
const HttpError = require("../../utils/http-error");
const Employee = mongoose.model('Employee');

const updateProfileImage = async(req,res,next) =>{
    if(!req.file){
        return next(new HttpError('No File Found',400));
    }
    const userId =  req.user.userId;
    
    const profileImage = req.file.path;

    let employee;
    try {
        employee = await Employee.findOneAndUpdate({userAuth:userId},{profileImage:profileImage},{new:true});
    } catch (err) {
        const error = new HttpError('Some error occurred while uploading file',500);
        return next(error);
    }

    res.status(200).json(employee);
}

exports.updateProfileImage = updateProfileImage;