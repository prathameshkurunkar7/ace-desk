const express = require('express');
const router = express.Router();

const {fileUpload,resizeImage} = require('../middlewares/fileUpload');
const authenticate = require('../middlewares/authenticate');
const employeeController = require('../controllers/employee/employeeController');
const attendanceController = require('../controllers/attendanceController');
const { validationMarkAttendance } = require('../middlewares/validations');

router.patch('/profile-image',fileUpload,resizeImage,authenticate,employeeController.updateProfileImage);

//mark attendance route
router.post('/attendance/mark',validationMarkAttendance,authenticate,attendanceController.markAttendance);

module.exports = router;