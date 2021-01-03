const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const occasionSchema = new Schema({
    occasion:{
        type: String,
        enum: ['Event','Holiday'],
        default: 'Holiday'
    },
    occasionDate: { type: Date, default: Date.now() },
    occasionName: { type: String ,required: true},
});

mongoose.model('Occasion',occasionSchema);