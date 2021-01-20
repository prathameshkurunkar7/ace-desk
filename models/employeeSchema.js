const mongoose = require('mongoose');
const { Designations, BloodGroups } = require('../utils/helperData');
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
        enum: BloodGroups,
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
        enum: Designations,
        default: 'Other'
    },
    department:{
        type: mongoose.Types.ObjectId,
        ref: 'Department'
    },
    assignedProject:{type: Boolean,default:false},
    team:{type: mongoose.Types.ObjectId,ref:'Team'},
    payroll:{
        type: mongoose.Types.ObjectId,
        ref: 'Payroll'
    },
    leaves:[{ type: mongoose.Types.ObjectId,ref: 'Leaves' }],
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
        graduatingDate:{type: Date},
        qualificationTitle:{type: String}
    }
});

mongoose.model('Employee', employeeSchema);