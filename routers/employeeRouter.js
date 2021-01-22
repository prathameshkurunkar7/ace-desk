const express = require('express');
const router = express.Router();

const authenticate = require('../middlewares/authenticate');
const employeeController = require('../controllers/employee/employeeController');
const attendanceController = require('../controllers/attendanceController');
const leaveController = require('../controllers/leaveController');
const dashboardController = require('../controllers/dashboardController');
const { validationMarkAttendance, validationApplyLeaves, validateApplyLoanBonus } = require('../middlewares/validations');
const {fileUpload,resizeImage,imageUpload} = require('../middlewares/uploader');
const payrollController = require('../controllers/payrollController');

//dashboard
router.get('/dashboard/get-data',authenticate,dashboardController.getEmployeeDashboardData);

//my profile
router.patch('/profile-image',imageUpload,resizeImage,authenticate,employeeController.updateProfile);

//mark attendance route
router.post('/attendance/mark',validationMarkAttendance,authenticate,attendanceController.markAttendance);

// leaves
router.post('/leaves/apply',validationApplyLeaves,authenticate,leaveController.applyLeave);

router.delete('/leaves/delete/:appliedLeaveId',leaveController.deleteLeave);

// loan and bonus
router.get('/payroll/my-loan-bonus',authenticate,payrollController.empLoanAndBonus);

router.post('/payroll/apply-loan-bonus/',validateApplyLoanBonus,authenticate,payrollController.applyLoanBonus);


module.exports = router;