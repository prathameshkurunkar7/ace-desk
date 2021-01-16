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
    },
    takenLeaves:{
        type: Number,
        default: 0,
    },
    appliedLeaves:[{
        status: {type: String,enum: ['Pending','Rejected','Accepted'],default:'Pending'},
        leaveFrom: {type: Date,default: Date.now()},
        leaveTo: {type: Date,default: Date.now()},
        leaveDescription:{type: String}
    }],
});

mongoose.model('Leave', leaveSchema);