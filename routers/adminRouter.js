const express = require('express');
const router = express.Router();
const {check} = require('express-validator');
const {validateEmployeeCreation, validateEmployeeUpdation,validationTeamCreation,validationUpdateProject,validationCreateProject} = require('../middlewares/validations');

const employeeController = require('../controllers/admin/employeeController');
const departmentController = require('../controllers/admin/departmentController');

//employee routes
router.get('/employee/',employeeController.getEmployees);

router.get('/employee/:employeeId',employeeController.getEmployeeById);

router.get('/employee/send-credentials/:employeeId',employeeController.sendEmployeeCredentials);

router.post('/employee/create',validateEmployeeCreation,employeeController.createEmployee);

router.patch('/employee/update/:employeeId',validateEmployeeUpdation,employeeController.updateEmployee);

router.delete('/employee/delete/:employeeId',employeeController.deleteEmployee);

// departmental routes
router.get('/department/projects/',departmentController.getProjects);

router.post('/department/create',[check('deptName').isLength({min:4}).isAlpha('en-US')],departmentController.createDepartment);

router.post('/department/add-team',validationTeamCreation,departmentController.createTeam);

router.post('/department/assign-project',validationCreateProject,departmentController.assignProject);

router.patch('/department/add-team-member',departmentController.addTeamMember);

router.patch('/department/update-project/:projectId',validationUpdateProject,departmentController.updateProject);

router.delete('/department/dissolve-department',departmentController.dissolveDepartment);

router.delete('/department/dissolve-team',departmentController.dissolveTeam);

router.delete('/department/remove-team-member',departmentController.removeTeamMember);

router.delete('/department/disassign-project',departmentController.disassignProject);

module.exports = router;