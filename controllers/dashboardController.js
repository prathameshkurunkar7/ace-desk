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
        data.bdayEmployees = await Employee.aggregate([
            { $project: {
                "firstName": 1,
                "lastName": 1,
                "dateOfBirth": 1,
                "profileImage":1,
                "month": "$month"
            }},
            {
                $match: {
                $expr: {
                  $eq: [{ $month: '$dateOfBirth' }, { $month: new Date() }],
                },
            }}
        ]);
    } catch (err) {
        const error = new HttpError('Something went wrong!',500);
        return next(error);
    }

    let leaves;
    try {
        leaves = await Leave.aggregate([
            {
                '$unwind':"$appliedLeaves"
            },
            {
                '$project':{
                    'empId':1,
                    'appliedLeaves':1
                }
            },
            {
                '$match': {"appliedLeaves.status": 'Pending'}
            }
        ])
    } catch (err) {
        const error = new HttpError('Something went wrong!',500);
        return next(error);
    }

    leaves = await Promise.all(leaves.map(async(leave)=>{
        let emp;
        try {
            emp = await Employee.findById(leave.empId).select('firstName lastName');
        } catch (err) {
            const error = new HttpError('Something went wrong!',500);
            return next(error);
        }

        return {
            ...leave,
            employeeFirstName: emp.firstName,
            employeeLastName: emp.lastName
        }
    }));

    let loan=[],bonus=[];
    try {
        loan = await Payroll.find({"loan.status": 'Pending'}).select('loan').populate('empId','firstName lastName');
        bonus = await Payroll.find({"bonus.status": 'Pending'}).select('bonus').populate('empId','firstName lastName');
    } catch (err) {
        const error = new HttpError('Could not get Pending Loans and Bonus',500);
        return next(error);
    }
        
    data.leaves = leaves;
    data.loan = loan;
    data.bonus = bonus;
    res.status(200).json(data);

}

const getDashboardGraph = async(req,res,next) =>{

    let departments;
    try {
        departments = await Department.find({});
    } catch (err) {
        const error = new HttpError('Could not fetch Graph Data',500);
        return next(error);    
    }

    let employeeCounts=[];
    let departmentNames = [];
    departments.forEach((department)=>{
        employeeCounts.push(department.employees.length);
        departmentNames.push(department.deptName);
    })
    
    res.status(200).json({employeeCounts,departmentNames})

}

const getEmployeeDashboardData = async(req,res,next) =>{
    const userId = req.user.userId;

    let todayDate = new Date();
    let nextMonthDate = new Date();
    nextMonthDate.setMonth(todayDate.getMonth() + 1, 1);
    todayDate = todayDate.toISOString().substring(0,10);
    nextMonthDate = nextMonthDate.toISOString().substring(0,10);

    let team=null;
    let department,upcomingDays,employeeBdays,leaves,loanAndBonus;
    try {
        const emp = await Employee.findOne({userAuth:userId}).select('department assignedProject team payroll');
        department = await Department.findById(emp.department).select('employees deptName');
        if(emp.assignedProject){
            team = await Team.findById(emp.team).populate([{path:'project',select:'projectName status'},
                {path:'teamLeader',select:'firstName lastName profileImage'},
                {path:'teamMembers',select:'firstName lastName profileImage'}
            ])
        }
        upcomingDays = await Day.find({'date':{
            $gte: todayDate,
            $lte: nextMonthDate
        },'dayType': {$in: ['Event', 'Holiday']}}).select('dayType date dayDescription');
        employeeBdays = await Employee.aggregate([
            { $project: {
                "firstName": 1,
                "lastName": 1,
                "dateOfBirth": 1,
                "month": "$month"
            }},
            {
                $match: {
                $expr: {
                  $eq: [{ $month: '$dateOfBirth' }, { $month: new Date() }],
                },
            }}
        ]);
        leaves = await Leave.findOne({empId:emp.id}).select('availableLeaves takenLeaves');
        loanAndBonus = await Payroll.findById(emp.payroll).select('loan bonus');
    } catch (err) {
        const error = new HttpError('Could not fetch data',500);
        return next(error);
    }

    if(loanAndBonus.loan['amount']===0 && !loanAndBonus.loan['status']){
        delete loanAndBonus.loan['amount']
        loanAndBonus.loan['status'] = 'No Loans'
    }

    if(loanAndBonus.bonus['amount']===0 && !loanAndBonus.bonus['status']){
        delete loanAndBonus.bonus['amount']
        loanAndBonus.bonus['status'] = 'No Bonuses'
    }

    let newTeam = {
        project:{
            projectName: 'Unassigned'
        },
        teamLeader:{
            firstName: 'Not Applicable'
        }
    }
    const data = {
        team: team ? team:newTeam,
        departmentName:department.deptName,
        departmentEmployeeCount:department.employees.length,
        upcomingDays,
        employeeBdays,
        leaves,
        loanAndBonus
    } 

    res.status(200).json(data);
}

exports.getHRDashboardData = getHRDashboardData;
exports.getEmployeeDashboardData = getEmployeeDashboardData;
exports.getDashboardGraph = getDashboardGraph;