const mongoose = require('mongoose');
const HttpError = require('../utils/http-error');
const {validationResult} = require('express-validator');
const Day = mongoose.model('Day');
const Attendance = mongoose.model('Attendance');

// set day type
const setDaySchedule = async(req,res,next) =>{
    //check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new HttpError(`${errors.array()[0].msg} at ${errors.array()[0].param},please enter valid input.`
            , 422)
        return next(err);
    }

    const {daysSchedule} = req.body;
    
    daysSchedule.forEach(async (day)=>{
        
        var newDay = new Day({
            dayType:day.dayType,
            date:day.date,
            dayDescription:day.dayDescription
        })
        
        let dayFound;
        try {
            dayFound = await Day.findOne({date:day.date});
        } catch (err) {
            const error = new HttpError('Something went wrong!',500);
            return next(error);
        }

        if(dayFound){
            return;
        }
        
        try {
            const setday = await newDay.save();
            const scheduledDay = {
                status:'Absent',
                workingDate:setday.date
            }
            await Attendance.updateMany({},{$push:{workingDays:scheduledDay}});
        } catch (err) {
            const error = new HttpError('Something went wrong!',500);
            return next(error);
        }
    });
    
    res.status(201).json({"status":"Schedule has been successfully created."});

}


// delete set day type
const deleteSetDay = async(req,res,next) =>{
    const dayId = req.params.dayId;
    
    let day;
    try {
        day = await Day.findById(dayId);
    } catch (err) {
        const error = new HttpError('Something went wrong!',500);
        return next(error);
    }
    
    if(!day){
        return next(new HttpError('Day is not present in schedule',400));
    }

    try {
        await Day.findByIdAndDelete(dayId);
        const scheduleDay={
            status:day.status,
            workingDate:day.date
        }
        await Attendance.updateMany({},{$pull:{workingDays:scheduleDay}});
    } catch (err) {
        const error = new HttpError('Could not delete the set day',500);
        return next(error);
    }
    
    res.status(200).json({"message":"Set day has been deleted successfully"});

}

// edit set day type
const editSetDay = async(req,res,next) =>{
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new HttpError(`${errors.array()[0].msg} given at ${errors.array()[0].param.toLowerCase()} ,please enter valid input.`
            , 422,true)
        return next(err);
    }
    
    let existingDay;
    try {
        existingDay = await Day.findById(req.params.dayId);
    } catch (err) {
        const error = new HttpError('Something went wrong!',500);
        return next(error);
    }
    
    if(!existingDay){
        return next(new HttpError('No Day Found',404));
    }


    let day;
    try {
        day = await Day.findByIdAndUpdate(req.params.dayId,req.body,{new:true});      
    } catch (err) {
        const error = new HttpError('Could Not Update day',500);
        return next(error);
    }

    res.status(200).json(day);
}

// get schedule
const getSchedule = async(req,res,next) =>{
    
    let days;
    try {

        //filtering
        const queryObj = {...req.query};
        const fieldsExclude = ['page','sort','limit','fields'];
        fieldsExclude.forEach(elem => delete queryObj[elem]);

        let query = Day.find(queryObj);

        //sorting
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        }else{
            query = query.sort('date');
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
            const numDays = await Day.countDocuments();
            if(offset >= numDays){
                return next(new HttpError('This Page does not exist',404));
            }
        }
        //Execute query
        days = await query;
        
    } catch (err) {
        const error = new HttpError('Failed to get schedule details',500);
        return next(error);
    }
    
    res.status(200).json({days,totalCount:days.length?days.length:0});
}


exports.setDaySchedule = setDaySchedule;
exports.deleteSetDay = deleteSetDay;
exports.editSetDay = editSetDay;
exports.getSchedule = getSchedule;