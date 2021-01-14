const mongoose = require('mongoose');
const HttpError = require('../utils/http-error');
const Day = mongoose.model('Day');
const Attendance = mongoose.model('Attendance');

// set day type
const setDaySchedule = async(req,res,next) =>{
    //check validation errors

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
    })
    
    res.status(200).json("OK");
}


// delete set day type

// edit set day type

// get day types

exports.setDaySchedule = setDaySchedule;