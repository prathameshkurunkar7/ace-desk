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
        totalDeductions:{type:Number}       
    },
    loan:{
        amount:{type: Number,max:50000,default:0},
        status:{type: String,enum:['Pending','Accepted','Rejected']},
        description:{type:String}
    },
    bonus:{
        amount:{type: Number,max:50000,default:0},
        status:{type: String,enum:['Pending','Accepted','Rejected']},
        description:{type:String},
        lastDate:{type:Date,default:Date.now()}
    },
    updatedAt:{type: Date,default: Date.now()}
});

mongoose.model('Payroll', payrollSchema);