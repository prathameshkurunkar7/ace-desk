const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leaveSchema = new Schema({
    empId:{
        type: mongoose.Types.ObjectId,
        ref:'Employee',
        required: true
    },
    availableLeaves:{
        type: Number,
        default: 30,
        required: true
    },
    carriedForwardLeaves:{
        type: Number,
        default: 0,
        required: true
    },
    takenLeaves:{
        type: Number,
        default: 0,
        required: true
    },
    appliedLeaves:{
        status: {type: String,enum: ['Pending','Rejected','Accepted'],default:'Pending'},
        duration: {type: Number},
        leaveFrom: {type: Date,default: Date.now()},
        leaveTo: {type: Date,default: Date.now()}
    },
    leaveDescription:{
        type: String,
        required: true
    }
});

mongoose.model('Leave', leaveSchema);