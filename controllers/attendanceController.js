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
            , 422,true)
        return next(err);
    }

    const {status,workingDate} = req.body;
    
    let attendeeExists,emp;
    try {
        emp = await Employee.findOne({userAuth:req.user.userId});
        attendeeExists = await Attendance.findOne({empId:emp.id});
    } catch (err) {
        const error = new HttpError('Something went wrong!',500);
        return next(error);
    }

    let empAttendance = null;
    if(!attendeeExists){
        
        const newAttendee = new Attendance({
            empId:emp.id
        });
        try {
           const attendee = await newAttendee.save();
           const workingDay = {
               status,
               workingDate
           }
           empAttendance=await Attendance.findByIdAndUpdate(attendee.id,{$push:{workingDays:workingDay}},{new: true}); 
        } catch (err) {
            const error = new HttpError('Could not add attendance for employee',500);
            return next(error);
        }
    } else{
        
        try {
            const workingDay = {
                status,
                workingDate
            }
            empAttendance = await Attendance.findOneAndUpdate({empId:emp.id},{$push:{workingDays:workingDay}},{new:true});
        } catch (err) {
            const error = new HttpError('Could not add attendance for employee',500);
            return next(error);
        }
    }

    res.status(201).json(empAttendance);

}

const getAttendees = async(req,res,next) =>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new HttpError(`${errors.array()[0].msg} given at ${errors.array()[0].param.toLowerCase()} ,please enter valid input.`
            , 422,true)
        return next(err);
    }

    const todayDate = new Date(req.query.workingDate)
    let nextDate =  new Date()
    nextDate.setDate(todayDate.getDate() + 1)

    let attendees;
    try {
        attendees = await Attendance.find({'workingDays.status':req.query.status,'workingDays.workingDate':{
            $gte: todayDate,
            $lt: nextDate
        }});
    } catch (err) {
        console.log(err);
        const error = new HttpError('Could not find attendees',500);
        return next(error);
    }

    res.status(200).json(attendees);

}

exports.markAttendance = markAttendance;
exports.getAttendees = getAttendees;