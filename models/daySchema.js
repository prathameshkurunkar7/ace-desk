const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const daySchema = new Schema({
    dayType:{
        type: String,
        enum: ['Event','Holiday','Business'],
        default: 'Business'
    },
    date: { type: Date, default: Date.now() },
    dayDescription: { type: String ,default:'Working',required: true},
});

mongoose.model('Day',daySchema);