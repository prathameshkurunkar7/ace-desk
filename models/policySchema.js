const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const policySchema = new Schema({
    policyName:{type:String,required:true},
    department:{type:mongoose.Types.ObjectId,ref:'Department'},
    description:{type: String,required: true},
    createdAt:{type:Date,default:Date.now()},
    policyFile:{type:String,required:true}
});

mongoose.model('Policy', policySchema);