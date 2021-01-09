const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teamSchema = new Schema({
    teamName:{type: String,required:true},
    teamLeader:{type: mongoose.Types.ObjectId,ref:'Employee'},
    teamMembers:[{
        type: mongoose.Types.ObjectId,
        ref:'Employee'
    }],
    project:{type:mongoose.Types.ObjectId,ref:'Project'}
});

mongoose.model('Team', teamSchema);