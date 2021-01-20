const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const payrollSchema = new Schema({
    empId:{
        type: mongoose.Types.ObjectId,
        ref: 'Employee'
    },
    salaryPerAnnum:{
        type: Number,
    },
    basicSalary:{
        type: Number,
    },
    // In hand Salary
    netSalary:{
        type: Number,
    },
    grossSalary:{
        type: Number,
    },
    allowances:{
        dearness:{ type: Number },
        phone: { type: Number },
        houseRent: { type: Number },
        conveyance: { type: Number },
        medical: { type: Number },
        performance: { type: Number },
        otherAllowanceTotal:{type:Number}
    },
    deductions:{
        tds: { type: Number},
        epf: { type: Number },
        esi: {type: Number},
        professional: { type: Number,default: 200},
        totalDedcutions:{type:Number}       
    },
    updatedAt:{type: Date,default: Date.now()}
});

mongoose.model('Payroll', payrollSchema);