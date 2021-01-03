const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
    empId:{
        type: mongoose.Types.ObjectId,
        ref: 'Employee'
    },
    workingdays:[{
        status:{
            type: String,
            enum: ['Present','Absent'],
            default: 'Absent'
        },
        workingdate:{ type: Date,default:Date.now()},
    }]
});

mongoose.model('Attendance',attendanceSchema);