const express = require('express');
const router = express.Router();

const {fileUpload,resizeImage} = require('../middlewares/fileUpload');
const authenticate = require('../middlewares/authenticate');
const employeeController = require('../controllers/employee/employeeController');
const attendanceController = require('../controllers/attendanceController');
const leaveController = require('../controllers/leaveController');
const { validationMarkAttendance, validationApplyLeaves } = require('../middlewares/validations');

router.patch('/profile-image',fileUpload,resizeImage,authenticate,employeeController.updateProfileImage);

//mark attendance route
router.post('/attendance/mark',validationMarkAttendance,authenticate,attendanceController.markAttendance);

// leaves
router.post('/leaves/apply',validationApplyLeaves,authenticate,leaveController.applyLeave);

module.exports = router;