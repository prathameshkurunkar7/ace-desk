const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const departmentSchema = new Schema({
    deptName:{type: String,required: true},
    employees:[{
        type: mongoose.Types.ObjectId,
        ref: 'Employee'
    }]
});

mongoose.model('Department', departmentSchema);