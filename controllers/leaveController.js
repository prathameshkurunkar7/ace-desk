const mongoose = require('mongoose');
const {validationResult} = require('express-validator');
const HttpError = require('../utils/http-error');
const Attendance = mongoose.model('Attendance');
const Leave = mongoose.model('Leave');
const Employee = mongoose.model('Employee');

// employee applies for leave
const applyLeave = async(req,res,next) =>{
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new HttpError(`${errors.array()[0].msg} given at ${errors.array()[0].param.toLowerCase()} ,please enter valid input.`
            , 422)
        return next(err);
    }
    const {leaveFrom,leaveTo,leaveDescription} = req.body;
    
    let leave;
    try {
        const employee = await Employee.findOne({userAuth:req.user.userId});
        leave = await Leave.findOne({empId:employee.id});
    } catch (err) {
        const error = new HttpError('Something went wrong!',500);
        return next(error);
    }

    let leaveSlotAvailable = true;
    leave.appliedLeaves.forEach((appleave)=>{
        if(new Date(leaveFrom)<= appleave.leaveTo && new Date(leaveFrom)>=appleave.leaveFrom){
            leaveSlotAvailable = false;
        }
    });

    if(!leaveSlotAvailable){
        return next(new HttpError('Leave already applied for such slot',400));
    }

    const appliedLeave = {
        leaveFrom,
        leaveTo,
        status: 'Pending',
        leaveDescription
    }

    try {
        leave = await Leave.findByIdAndUpdate(leave.id,{$push:{appliedLeaves:appliedLeave}},{new:true});
    } catch (err) {
        const error = new HttpError('Could not apply leave',500);
        return next(error);
    }

    res.status(201).json(leave);

}

const deleteLeave = async(req,res,next) =>{
    const appliedLeaveId = req.params.appliedLeaveId;
    
    let leave;
    try {
        leave = await Leave.findOne({'appliedLeaves':{$elemMatch:{_id:appliedLeaveId}}});
    } catch (err) {
        const error = new HttpError('Something went wrong!',500);
        return next(error);
    }

    if(!leave){
        return next(new HttpError('No such leave found!',400));
    }

    const filteredAppliedLeaves = leave.appliedLeaves.filter((appLeave)=>appLeave.id!==appliedLeaveId);

    try {
        await Leave.findByIdAndUpdate(leave.id,{appliedLeaves:filteredAppliedLeaves},{new:true});
        await Employee.findByIdAndUpdate(leave.empId,{$pull:{leaves:appliedLeaveId}});
    } catch (err) {
        const error = new HttpError('Could not remove applied leave',500);
        return next(error);
    }

    res.status(200).json({"message":"Applied Leave has been deleted successfully"});
}


// admin gets all the applied leaves from employees
const getLeaves = async(req,res,next) =>{
    
    const queryObj = {...req.query};
    
    let leaves,leaveAggregate;
    try {

        //filtering
        const fieldsExclude = ['page','sort','limit','fields'];
        fieldsExclude.forEach(elem => delete queryObj[elem]);

        let query = Leave.find(queryObj);

        //sorting
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        }else{
            query = query.sort('-_id');
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
            const numLeaves = await Leave.countDocuments();
            if(offset >= numLeaves){
                return next(new HttpError('This Page does not exist',404));
            }
        }
        //Execute query
        leaves = await query.populate('empId','firstName lastName')
        
    } catch (err) {
        const error = new HttpError('Failed to get employee details',500);
        return next(error);
    }
    
    
    let newLeaves = leaves.map((leave)=>{
        
        let newAppliedLeaves = leave.appliedLeaves.map((appLeave)=>{
            if(appLeave.status === queryObj['appliedLeaves.status']){
                return {
                    "_id":appLeave.id,
                    "leaveFrom":appLeave.leaveFrom,
                    "leaveTo":appLeave.leaveTo,
                    "status":appLeave.status,
                    "leaveDescription":appLeave.leaveDescription,
                    "leaveId":leave.id,
                    "empId":leave.empId.id,
                    "firstName":leave.empId.firstName,
                    "lastName":leave.empId.lastName
                }
            }else{
                return 1;
            }
        })
        newAppliedLeaves = newAppliedLeaves.filter((leave)=>leave!==1);
        return newAppliedLeaves
    })
    newLeaves = newLeaves.flat();
    res.status(200).json({leaves:newLeaves,totalCount:newLeaves.count?newLeaves.count:0});

}

// admin accepts or rejects leaves
const actionOnLeave = async(req,res,next) =>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new HttpError(`${errors.array()[0].msg} given at ${errors.array()[0].param.toLowerCase()} ,please enter valid input.`
            , 422)
        return next(err);
    }

    const {leaveId,appliedLeaveId,action} = req.body;
    
    let leave;
    try {
        leave = await Leave.findById(leaveId);
    } catch (err) {
        const error = new HttpError('Something went wrong!',500);
        return next(error);
    }
    if(!leave){
        return next(new HttpError('Leave does not exist',400));
    }

    let appliedLeave = leave.appliedLeaves.filter((appLeave)=>appLeave.id===appliedLeaveId);

    const arrayOfDates=getDates(appliedLeave[0].leaveFrom,appliedLeave[0].leaveTo);
    
    let updatedLeaves;
    if(action === 'Accepted'){
        let existsAtt;
        const appLeaves = leave.appliedLeaves.map((appLeave)=>{
            if(appLeave.id===appliedLeaveId){
                appLeave.status = 'Accepted'
            }
            return appLeave;
        });
        
        let errors=[];
        arrayOfDates.forEach(async(date)=>{
            
            const todayDate = new Date(date);
            const nextDate = new Date();
            nextDate.setDate(todayDate.getDate() + 1)
            
            try {
                existsAtt = await Attendance.findOneAndUpdate({'workingDays.workingDate':{
                    $gte: todayDate,
                    $lt: nextDate
                },'empId':leave.empId},{ $set: { 'workingDays.$.status': 'On Leave'}}).select('workingDays');
            } catch (err) {
                errors.push('Some error occured');
                return
            }
            
            if(!existsAtt){
                return
            }
            
        })

        if(errors.length!==0){
            return next(new HttpError('Some error occured',500));
        }

        let emp;
        try {
            emp = await Employee.findById(leave.empId);
        } catch (err) {
            return next(new HttpError('Something went wrong!',500));
        }

        if(emp.leaves.includes(appliedLeaveId)){
            return next(new HttpError('Already performed action on this',400));
        }


        try {
            const availableLeaves = leave.availableLeaves - arrayOfDates.length;
            updatedLeaves = await Leave.findByIdAndUpdate(leave.id,{
                'appliedLeaves':appLeaves,'availableLeaves':availableLeaves,$inc:{takenLeaves: arrayOfDates.length}
            }
            ,{new:true}
            );
            await Employee.findByIdAndUpdate(updatedLeaves.empId,{$push:{leaves:mongoose.Types.ObjectId(appliedLeave[0]._id)}});
        } catch (err) {
            const error = new HttpError('Could not update leaves',500);
            return next(error);
        }

    }else{
        const appLeaves = leave.appliedLeaves.map((appLeave)=>{
            if(appLeave.id===appliedLeaveId){
                appLeave.status = 'Rejected'
            }
            return appLeave;
        });

        let emp;
        try {
            emp = await Employee.findById(leave.empId);
        } catch (err) {
            return next(new HttpError('Something went wrong!',500));
        }

        if(emp.leaves.includes(appliedLeaveId)){
            return next(new HttpError('Already performed action on this',400));
        }

        try {
            updatedLeaves = await Leave.findByIdAndUpdate(leave.id,{'appliedLeaves':appLeaves},{new:true});
            await Employee.findByIdAndUpdate(leave.empId,{$push:{leaves:mongoose.Types.ObjectId(appliedLeave[0]._id)}});
        } catch (err) {
            const error = new HttpError('Could not update leaves',500);
            return next(error);
        }
    }

    res.status(200).json(updatedLeaves);
}


Date.prototype.addDays = function(days) {
    let date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

function getDates(startDate, stopDate){
    let dateArray = new Array();
    let currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(new Date (currentDate));
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}

exports.applyLeave = applyLeave;
exports.getLeaves = getLeaves;
exports.actionOnLeave = actionOnLeave;
exports.deleteLeave = deleteLeave;