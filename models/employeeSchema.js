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
    contactNumbers:[{
        work:{
            type: Number,
            required: true
        },
        personal:{
            type: Number,
            required: true
        }
    }],
    addresses:[
        {
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
        }
    ],
    userAuth:{
        type: mongoose.Types.ObjectId,
        ref: 'UserAuth'
    },
    designation:{
        type: String,
        enum: ['Manager','General Manager','Executive','President','Project Manager','Developer','Designer','Marketing Head','HR Admin','Other'],
        default: 'Other'
    },
    department:{
        type: mongoose.Types.ObjectId,
        ref: 'Department'
    },
    myProjects:[{ type: mongoose.Types.ObjectId,ref: 'Projects'}],
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
});

mongoose.model('Employee', employeeSchema);