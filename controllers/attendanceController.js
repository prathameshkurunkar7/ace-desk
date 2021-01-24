const mongoose = require('mongoose');
const {validationResult} = require('express-validator');
const HttpError = require('../utils/http-error');
const Attendance = mongoose.model('Attendance');
const Employee = mongoose.model('Employee');

const markAttendance = async(req,res,next) =>{
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new HttpError(`${errors.array()[0].msg} given at ${errors.array()[0].param.toLowerCase()} ,please enter valid input.`
            , 422)
        return next(err);
    }

    const {status} = req.body
    const workingDate = new Date().toISOString().substring(0,10);

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
        if(workingDate === new Date(day.workingDate).toISOString().substring(0,10)){
            day.status = status
        }
        return day;
    })

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
        
        let todayDate = new Date(queryObj.workingDate);
        let nextDate = new Date();
        nextDate.setDate(todayDate.getDate() + 1)
        todayDate = todayDate.toISOString().substring(0,10);
        nextDate = nextDate.toISOString().substring(0,10);
        
        let query;
        if(queryObj.status){
            query = Attendance.find({'workingDays.workingDate':{
                $gte: todayDate,
                $lt: nextDate
            },'workingDays.status':queryObj.status});    
        } else{
            query = Attendance.find({'workingDays.workingDate':{
                $gte: todayDate,
                $lt: nextDate
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
                filteredAtt = attendee.workingDays.filter((day)=>new Date(day.workingDate).toISOString().substring(0,10)===todayDate);
            }else{
                filteredAtt = attendee.workingDays.filter((day)=>new Date(day.workingDate).toISOString().substring(0,10)===todayDate && day.status===queryObj.status);
            }

            if(filteredAtt.length===0){
                return
            }else{
                return {
                    "empId":attendee.empId._id,
                    "firstName":attendee.empId.firstName,
                    "lastName":attendee.empId.lastName,
                    "status": filteredAtt[0].status,
                    "workingDate": filteredAtt[0].workingDate,
                    "id": filteredAtt[0]._id
                }
            }
        })
        newAttendees = newAttendees.filter((attendees)=>attendees!==undefined);
    } catch (err) {
        const error = new HttpError('Failed to get attendance details',500);
        return next(error);
    }

    res.status(200).json({newAttendees,totalCount:numAttendees?numAttendees:newAttendees.length});

}

exports.markAttendance = markAttendance;
exports.getAttendees = getAttendees;