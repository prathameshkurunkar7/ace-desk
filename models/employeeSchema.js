const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
    employeeSerialId:{
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true
    },
    dateOfBirth:{
        type: Date,
        required: true
    },
    bloodGroup:{
        type: String,
        enum: ['A+','A-','O+','O-','B+','B-','AB+','AB-'],
        required: true
    },
    dateOfJoining:{
        type: Date,
        default: Date.now(),
        required: true
    },
    contactNumbers:{
        personal:{
            type: Number,
            required: true
        },
        work:{
            type: Number,
        }
    },
    addresses:{
        Permanent:{
            address:{
                type: String,
                trim: true,
                required: true
            },
            city:{
                type: String,
                trim: true,
                required: true
            },
            state:{
                type: String,
                trim: true,
                required: true
            },
            country:{
                type: String,
                trim: true,
                required: true    
            },
            pincode:{
                type: Number,
                required: true
            }
        },
        Residential:{
            address:{
                type: String,
                trim: true,
                required: true
            },
            city:{
                type: String,
                trim: true,
                required: true
            },
            state:{
                type: String,
                trim: true,
                required: true
            },
            country:{
                type: String,
                trim: true,
                required: true    
            },
            pincode:{
                type: Number,
                required: true
            }
        }
    },
    userAuth:{
        type: mongoose.Types.ObjectId,
        ref: 'UserAuth'
    },
    profileImage:{type: String},
    designation:{
        type: String,
        enum: ['Manager','General Manager','Executive','President','Project Manager','Developer','Designer','Marketing Head','HR Admin','Captain','Other'],
        default: 'Other'
    },
    department:{
        type: mongoose.Types.ObjectId,
        ref: 'Department'
    },
    assignedProject:{type: Boolean,default:false},
    salary:{
        type: mongoose.Types.ObjectId,
        ref: 'Payroll'
    },
    leaves:[{ type: mongoose.Types.ObjectId,ref: 'Leaves' }],
    attendanceReport:[{ type: mongoose.Types.ObjectId,ref: 'Attendance' }],
    socialHandles: {
        github: { type: String },
        linkedIn: { type: String },
        twitter: { type: String }
    },
    work:{
        experience: {type: Number},
        previousCompany: {type: String },
    },
    education:{
        instituteName:{type: String},
        graduatingYear:{type: Number},
        qualificationTitle:{type: String}
    }
});

mongoose.model('Employee', employeeSchema);