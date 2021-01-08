const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const departmentSchema = new Schema({
    deptName:{type: String,required: true},
    teams:[{
        teamName:{type: String,required: true},
        teamLeader:{type: mongoose.Types.ObjectId,ref:'Employee'},
        teamMembers:[{type: mongoose.Types.ObjectId,ref:'Employee'}],
        projects:[{type: mongoose.Types.ObjectId,ref:'Project'}]
    }]
});

mongoose.model('Department', departmentSchema);