const mongoose = require('mongoose');
const HttpError = require('../../utils/http-error');
const Employee = mongoose.model('Employee');
const Department = mongoose.model('Department');
const Project = mongoose.model('Project');

const getHRDashboardData = async(req,res,next) =>{
    
    let data ={}

    const todayDate = new Date();
    const nextMonthDate = new Date();
    nextMonthDate.setDate(todayDate.getMonth() + 1)

    try {
        data.departmentCount = await Department.countDocuments();
        data.employeeCount= await Employee.countDocuments();
        data.projectCount= await Project.countDocuments();
        data.bdayEmployees = await Employee.find({'dateOfBirth':{
            $gte: todayDate,
            $lte: nextMonthDate
        }}).select('firstName lastName dateOfBirth')
    } catch (err) {
        const error = new HttpError('Something went wrong!',500);
        return next(error);
    }

    res.status(200).json(data);

}

exports.getHRDashboardData = getHRDashboardData;