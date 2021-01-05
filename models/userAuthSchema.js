const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const userAuthSchema = new Schema({
    email:{
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    role: {
        type: String,
        enum: ['HR','Employee'],
        default: 'Employee'
    },
});

userAuthSchema.plugin(uniqueValidator);
mongoose.model('UserAuth',userAuthSchema)