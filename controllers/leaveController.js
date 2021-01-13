const mongoose = require('mongoose');
const {validationResult} = require('express-validator');
const HttpError = require('../utils/http-error');
const Attendance = mongoose.model('Attendance');
const Leave = mongoose.model('Leave');
const Employee = mongoose.model('Employee');

// employee applies for leave

// admin gets all the applied leaves from employees

// admin accepts or rejects leaves