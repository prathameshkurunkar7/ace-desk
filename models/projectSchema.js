const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// to be changed
const projectSchema = new Schema({
    projectName:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    status:{
        type: String,
        enum:['Ongoing','Finished'],
        default:'Ongoing',
        required: true
    },
    clientName:{type: String},
    dateOfAssignment:{type: Date,default: Date.now()},
    dateOfDeadline:{type: Date,default: Date.now()},
    dateOfCompletion:{type: Date}
});

mongoose.model('Project', projectSchema);