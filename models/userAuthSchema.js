const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const userAuthSchema = new Schema({
    empId:{
        type: mongoose.Types.ObjectId,
        ref: 'Employee'
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['HR','Employee'],
        default: 'Employee'
    },
});

userAuthSchema.plugin(uniqueValidator);
mongoose.model('UserAuth',userAuthSchema)