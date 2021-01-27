const express = require('express');
const router = express.Router();

const authenticate = require('../middlewares/authenticate');
const profileController = require('../controllers/profileController');
const attendanceController = require('../controllers/attendanceController');
const leaveController = require('../controllers/leaveController');
const dashboardController = require('../controllers/dashboardController');
const { validationMarkAttendance, validationApplyLeaves, validateApplyLoanBonus,validateUpdateProfile } = require('../middlewares/validations');
const {resizeImage,imageUpload} = require('../middlewares/uploader');
const payrollController = require('../controllers/payrollController');

//dashboard
router.get('/dashboard/get-data',authenticate,dashboardController.getEmployeeDashboardData);

router.get('/dashboard/graph-data',authenticate,dashboardController.getDashboardGraph);

//my profile
router.get('/profile/',authenticate,profileController.getMyProfile);

router.patch('/profile/update',imageUpload,resizeImage,validateUpdateProfile,authenticate,profileController.updateProfile);

//mark attendance route
router.post('/attendance/mark',validationMarkAttendance,authenticate,attendanceController.markAttendance);

// leaves
router.post('/leaves/apply',validationApplyLeaves,authenticate,leaveController.applyLeave);

router.delete('/leaves/delete/:appliedLeaveId',authenticate,leaveController.deleteLeave);

// loan and bonus
router.get('/payroll/my-loan-bonus',authenticate,payrollController.empLoanAndBonus);

router.post('/payroll/apply-loan-bonus/',validateApplyLoanBonus,authenticate,payrollController.applyLoanBonus);


module.exports = router;