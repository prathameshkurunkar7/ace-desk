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
    validationUpdateTeamDetails
} = require('../middlewares/validations');

const employeeController = require('../controllers/admin/employeeController');
const departmentController = require('../controllers/admin/departmentController');
const teamController = require('../controllers/admin/teamController');
const attendanceController = require('../controllers/attendanceController');
const dayController = require('../controllers/dayController');

//employee routes
router.get('/employee/',employeeController.getEmployees);

router.get('/employee/:employeeId',employeeController.getEmployeeById);

router.get('/employee/send-credentials/:employeeId',employeeController.sendEmployeeCredentials);

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

//will be removed later
router.patch('/team/add-team-member',teamController.addTeamMember);

router.patch('/team/update-project/:projectId',validationUpdateProject,teamController.updateProject);

router.delete('/team/dissolve-team-project',teamController.dissolveTeamAndProject);

//will be removed later
router.delete('/team/remove-team-member',teamController.removeTeamMember);

// attendance route
router.get('/attendance/',validationGetAttendance,attendanceController.getAttendees);

// scheduling routes
router.get('/schedule/',dayController.getSchedule);

router.post('/schedule/create',validationSetSchedule,dayController.setDaySchedule);

router.patch('/schedule/edit/:dayId',validationEditDaySchedule,dayController.editSetDay);

router.delete('/schedule/delete/:dayId',dayController.deleteSetDay);

module.exports = router;