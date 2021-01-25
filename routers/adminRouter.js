const express = require('express');
const router = express.Router();
const {check} = require('express-validator');
const {
    validateEmployeeCreation, 
    validateEmployeeUpdation,
    validationCreateTeamAndProject,
    validationUpdateProject, 
    validationGetAttendance,
    validationSetSchedule,
    validationEditDaySchedule,
    validationUpdateTeamDetails,
    validationsActionOnLeave,
    validationCreatePolicy,
    validationUpdatePolicy,
    validationCreatePaySlip,
    validationAddAllowance,
    validateSanctionLoanBonus
} = require('../middlewares/validations');

const employeeController = require('../controllers/admin/employeeController');
const departmentController = require('../controllers/admin/departmentController');
const teamController = require('../controllers/admin/teamController');
const attendanceController = require('../controllers/attendanceController');
const dayController = require('../controllers/dayController');
const leaveController = require('../controllers/leaveController');
const policyController = require('../controllers/policyController');
const payrollController = require('../controllers/payrollController');
const dashboardController = require('../controllers/dashboardController');
const { fileUpload } = require('../middlewares/uploader');
const authenticate = require('../middlewares/authenticate');
const restricted = require('../middlewares/restricted');

//dashboard routes
router.get('/dashboard/get-data',authenticate,restricted,dashboardController.getHRDashboardData);

//employee routes
router.get('/employee/',authenticate,restricted,employeeController.getEmployees);

router.get('/employee/:employeeId',authenticate,restricted,employeeController.getEmployeeById);

router.post('/employee/create',validateEmployeeCreation,authenticate,restricted,employeeController.createEmployee);

router.patch('/employee/update/:employeeId',validateEmployeeUpdation,authenticate,restricted,employeeController.updateEmployee);

router.delete('/employee/delete/:employeeId',authenticate,restricted,employeeController.deleteEmployee);

// departmental routes
router.get('/department/',authenticate,departmentController.getDepartments);

router.post('/department/create',[check('deptName').isLength({min:2}).isAlpha('en-US')],authenticate,restricted,departmentController.createDepartment);

router.delete('/department/dissolve-department/:deptId',authenticate,restricted,departmentController.dissolveDepartment);

// project and Team routes
router.get('/projects/',authenticate,restricted,teamController.getProjects);

router.post('/team/add-team-project',validationCreateTeamAndProject,authenticate,restricted,teamController.createTeamAndProject);

router.patch('/team/update-team/:teamId',validationUpdateTeamDetails,authenticate,restricted,teamController.updateTeamDetails);

router.patch('/team/add-team-member',authenticate,restricted,teamController.addTeamMember);

router.patch('/team/update-project/:projectId',validationUpdateProject,authenticate,restricted,teamController.updateProject);

router.delete('/team/dissolve-team-project/:teamId',authenticate,restricted,teamController.dissolveTeamAndProject);

router.delete('/team/remove-team-member',authenticate,restricted,teamController.removeTeamMember);

// attendance route
router.get('/attendance/',validationGetAttendance,authenticate,restricted,attendanceController.getAttendees);

// scheduling routes
router.get('/schedule/',authenticate,restricted,dayController.getSchedule);

router.post('/schedule/create',validationSetSchedule,authenticate,restricted,dayController.setDaySchedule);

router.patch('/schedule/edit/:dayId',validationEditDaySchedule,authenticate,restricted,dayController.editSetDay);

router.delete('/schedule/delete/:dayId',authenticate,restricted,dayController.deleteSetDay);

// leaves routes
router.get('/leaves/',authenticate,restricted,leaveController.getLeaves);

router.patch('/leaves/action',validationsActionOnLeave,authenticate,restricted,leaveController.actionOnLeave);

//policy routes
router.get('/policy/',authenticate,policyController.getPolicies);

router.post('/policy/create',fileUpload,validationCreatePolicy,authenticate,restricted,policyController.createPolicy);

router.patch('/policy/update/:policyId',fileUpload,validationUpdatePolicy,authenticate,restricted,policyController.updatePolicy);

router.delete('/policy/delete/:policyId',authenticate,restricted,policyController.deletePolicy);

//payroll routes
router.get('/payroll/',authenticate,restricted,payrollController.getPayrolls);

router.get('/payroll/payslip/generate-pdf/:payrollId',authenticate,restricted,payrollController.generatePdf);

router.get('/payroll/payslip/send-mail/:payrollId',authenticate,restricted,payrollController.sendPaySlip);

router.get('/payroll/get-loan-bonus/',authenticate,restricted,payrollController.getLoanAndBonus);

router.patch('/payroll/sanction-loan-bonus/:employeeId',validateSanctionLoanBonus,authenticate,restricted,payrollController.sanctionLoanBonus);

router.post('/payroll/payslip/create',validationCreatePaySlip,authenticate,restricted,payrollController.createPaySlip);

router.patch('/payroll/payslip/save-changes/:payrollId',validationAddAllowance,authenticate,restricted,payrollController.addAllowances);

module.exports = router;