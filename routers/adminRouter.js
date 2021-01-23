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

//dashboard routes
router.get('/dashboard/get-data',dashboardController.getHRDashboardData);

//employee routes
router.get('/employee/',employeeController.getEmployees);

router.get('/employee/:employeeId',employeeController.getEmployeeById);

router.post('/employee/create',validateEmployeeCreation,employeeController.createEmployee);

router.patch('/employee/update/:employeeId',validateEmployeeUpdation,employeeController.updateEmployee);

router.delete('/employee/delete/:employeeId',employeeController.deleteEmployee);

// departmental routes
router.get('/department/',departmentController.getDepartments);

router.post('/department/create',[check('deptName').isLength({min:4}).isAlpha('en-US')],departmentController.createDepartment);

router.delete('/department/dissolve-department/:deptId',departmentController.dissolveDepartment);

// project and Team routes
router.get('/projects/',teamController.getProjects);

router.post('/team/add-team-project',validationCreateTeamAndProject,teamController.createTeamAndProject);

router.patch('/team/update-team/:teamId',validationUpdateTeamDetails,teamController.updateTeamDetails);

router.patch('/team/add-team-member',teamController.addTeamMember);

router.patch('/team/update-project/:projectId',validationUpdateProject,teamController.updateProject);

router.delete('/team/dissolve-team-project/:teamId',teamController.dissolveTeamAndProject);

router.delete('/team/remove-team-member',teamController.removeTeamMember);

// attendance route
router.get('/attendance/',validationGetAttendance,attendanceController.getAttendees);

// scheduling routes
router.get('/schedule/',dayController.getSchedule);

router.post('/schedule/create',validationSetSchedule,dayController.setDaySchedule);

router.patch('/schedule/edit/:dayId',validationEditDaySchedule,dayController.editSetDay);

router.delete('/schedule/delete/:dayId',dayController.deleteSetDay);

// leaves routes
router.get('/leaves/',leaveController.getLeaves);

router.patch('/leaves/action',validationsActionOnLeave,leaveController.actionOnLeave);

//policy routes
router.get('/policy/',policyController.getPolicies);

router.post('/policy/create',fileUpload,validationCreatePolicy,policyController.createPolicy);

router.patch('/policy/update/:policyId',fileUpload,validationUpdatePolicy,policyController.updatePolicy);

router.delete('/policy/delete/:policyId',policyController.deletePolicy);

//payroll routes
router.get('/payroll/',payrollController.getPayrolls);

router.get('/payroll/payslip/generate-pdf/:payrollId',payrollController.generatePdf);

router.get('/payroll/payslip/send-mail/:payrollId',payrollController.sendPaySlip);

router.patch('/payroll/sanction-loan-bonus/:employeeId',validateSanctionLoanBonus,payrollController.sanctionLoanBonus);

router.post('/payroll/payslip/create',validationCreatePaySlip,payrollController.createPaySlip);

router.patch('/payroll/payslip/save-changes/:payrollId',validationAddAllowance,payrollController.addAllowances);

module.exports = router;