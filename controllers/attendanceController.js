const mongoose = require('mongoose');
const {validationResult} = require('express-validator');
const HttpError = require('../utils/http-error');
const Attendance = mongoose.model('Attendance');
const Leave = mongoose.model('Leave');
const Employee = mongoose.model('Employee');

const markAttendance = async(req,res,next) =>{
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new HttpError(`${errors.array()[0].msg} given at ${errors.array()[0].param.toLowerCase()} ,please enter valid input.`
            , 422)
        return next(err);
    }

    const {status,workingDate} = req.body
    
    let attendee;
    try {
        const employee = await Employee.findOne({userAuth:req.user.userId});
        attendee = await Attendance.findOne({empId:employee.id});
    } catch (err) {
        const error = new HttpError('Something went wrong!',500);
        return next(error);
    }

    if(!attendee){
        return next(new HttpError('Could not find attendance of employee',500));
    }

    const markedWorkingDays = attendee.workingDays.map(day=>{
        const date = new Date(day.workingDate);
        const nextDay = new Date();
        nextDay.setDate(date.getDate() + 1)
        if(new Date(workingDate)>=date && new Date(workingDate)<nextDay){
            day.status = status
        }
        return day;
    });

    let newAttendee;
    try {
        newAttendee = await Attendance.findByIdAndUpdate(attendee.id,{workingDays:markedWorkingDays},{new:true});
    } catch (err) {
        const error = new HttpError('Could not mark attendance',500);
        return next(error);
    }

    res.status(201).json(newAttendee);
    
}

const getAttendees = async(req,res,next) =>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new HttpError(`${errors.array()[0].msg} given at ${errors.array()[0].param.toLowerCase()} ,please enter valid input.`
            , 422,true)
        return next(err);
    }

    let attendees,numAttendees,newAttendees;
    try {

        //filtering
        const queryObj = {...req.query};
        const fieldsExclude = ['page','limit','fields'];
        fieldsExclude.forEach(elem => delete queryObj[elem]);
        
        const todayDate = new Date(queryObj.workingDate);
        const nextDate = new Date();
        nextDate.setDate(todayDate.getDate() + 1)
        
        let query;
        if(queryObj.status){
            query = Attendance.find({'workingDays.workingDate':{
                $gte: todayDate,
                $lte: nextDate
            },'workingDays.status':queryObj.status});    
        } else{
            query = Attendance.find({'workingDays.workingDate':{
                $gte: todayDate,
                $lte: nextDate
            }});
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
            numAttendees = await Attendance.countDocuments();
            if(offset >= numAttendees){
                return next(new HttpError('This Page does not exist',404));
            }
        }
        //Execute query
        attendees = await query.populate('empId','firstName lastName');
        newAttendees = attendees.map((attendee)=>{

            let filteredAtt;
            if(!queryObj.status){
                filteredAtt = attendee.workingDays.filter((day)=>day.workingDate >=todayDate && day.workingDate<nextDate);
            }else{
                filteredAtt = attendee.workingDays.filter((day)=>(day.workingDate >=todayDate && day.workingDate<nextDate)&&day.status===queryObj.status);
            }
            
            return {
                "empId":attendee.empId._id,
                "firstName":attendee.empId.firstName,
                "lastName":attendee.empId.lastName,
                "status": filteredAtt[0].status,
                "workingDate": filteredAtt[0].workingDate,
                "id": filteredAtt[0]._id
            }
        })
    } catch (err) {
        console.log(err);
        const error = new HttpError('Failed to get attendance details',500);
        return next(error);
    }

    res.status(200).json({newAttendees,totalCount:newAttendees.length});

}

exports.markAttendance = markAttendance;
exports.getAttendees = getAttendees;