const mongoose = require('mongoose');
const HttpError = require('../utils/http-error');
const Employee = mongoose.model('Employee');
const Department = mongoose.model('Department');
const Project = mongoose.model('Project');
const Team = mongoose.model('Team');
const Day = mongoose.model('Day');
const Leave = mongoose.model('Leave');
const Payroll = mongoose.model('Payroll');

const getHRDashboardData = async(req,res,next) =>{
    
    let data ={}

    const todayDate = new Date();
    const nextMonthDate = new Date();
    nextMonthDate.setMonth(todayDate.getMonth() + 1, 1);

    try {
        data.departmentCount = await Department.countDocuments();
        data.employeeCount= await Employee.countDocuments();
        data.projectCount= await Project.countDocuments();
        data.bdayEmployees = await Employee.find({'dateOfBirth':{
            $gte: todayDate,
            $lte: nextMonthDate
        }}).select('firstName lastName dateOfBirth').populate('department','deptName');
    } catch (err) {
        const error = new HttpError('Something went wrong!',500);
        return next(error);
    }

    res.status(200).json(data);

}

const getEmployeeDashboardData = async(req,res,next) =>{
    const userId = req.user.userId;

    const todayDate = new Date();
    const nextMonthDate = new Date();
    nextMonthDate.setMonth(todayDate.getMonth() + 1, 1);

    let team=null;
    let department,upcomingDays,employeeBdays,leaves,loanAndBonus;
    try {
        const emp = await Employee.findOne({userAuth:userId}).select('department assignedProject team payroll');
        await Department.findById(emp.department).select('employees deptName');
        if(emp.assignedProject){
            team = Team.findById(emp.team).populate([{path:'project',select:'projectName status'},
                {path:'teamLeader',select:'firstName lastName profileImage'},
                {path:'teamMembers',select:'firstName lastName profileImage'}
            ])
        }
        upcomingDays = await Day.find({'date':{
            $gte: todayDate,
            $lte: nextMonthDate
        },'title': {$in: ['Event', 'Holiday']}}).select('dayType date dayDescription');
        employeeBdays = await Employee.find({'dateOfBirth':{
            $gte: todayDate,
            $lte: nextMonthDate
        }}).select('firstName lastName dateOfBirth').populate('department','deptName');
        leaves = await Leave.findOne({empId:emp.id}).select('availableLeaves takenLeaves');
        loanAndBonus = await Payroll.findById(emp.payroll).select('loan bonus');
    } catch (err) {
        const error = new HttpError('Could not fetch data',500);
        return next(error);
    }

    const data = {
        team:team ? team:'Project Unassigned',
        department,
        upcomingDays,
        employeeBdays,
        leaves,
        loanAndBonus
    } 

    res.status(200).json(data);
}

exports.getHRDashboardData = getHRDashboardData;
exports.getEmployeeDashboardData = getEmployeeDashboardData;
