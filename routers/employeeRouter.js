const express = require('express');
const router = express.Router();

const authenticate = require('../middlewares/authenticate');
const employeeController = require('../controllers/employee/employeeController');
const attendanceController = require('../controllers/attendanceController');
const leaveController = require('../controllers/leaveController');
const { validationMarkAttendance, validationApplyLeaves } = require('../middlewares/validations');
const {fileUpload,resizeImage,imageUpload} = require('../middlewares/uploader');

router.patch('/profile-image',imageUpload,resizeImage,authenticate,employeeController.updateProfileImage);

//mark attendance route
router.post('/attendance/mark',validationMarkAttendance,authenticate,attendanceController.markAttendance);

// leaves
router.post('/leaves/apply',validationApplyLeaves,authenticate,leaveController.applyLeave);

router.delete('/leaves/delete/:appliedLeaveId',leaveController.deleteLeave);

module.exports = router;