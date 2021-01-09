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
    salaryPerMonth:{
        type: Number,
        required: true
    },
    basicSalary:{
        type: Number,
        required: true
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
        //internetAllowance
    },
    deductions:{
        tds: { type: Number ,required:true},
        epf: { type: Number },
        esi: {type: Number},
        professional: { type: Number,default: 200}        
    }
});

mongoose.model('Payroll', payrollSchema);