const express = require('express');
const router = express.Router();
const {check} = require('express-validator');
const {validateEmployeeCreation, validateEmployeeUpdation,validationCreateTeamAndProject,validationUpdateProject} = require('../middlewares/validations');

const employeeController = require('../controllers/admin/employeeController');
const departmentController = require('../controllers/admin/departmentController');
const teamController = require('../controllers/admin/teamController');

//employee routes
router.get('/employee/',employeeController.getEmployees);

router.get('/employee/:employeeId',employeeController.getEmployeeById);

router.get('/employee/send-credentials/:employeeId',employeeController.sendEmployeeCredentials);

router.post('/employee/create',validateEmployeeCreation,employeeController.createEmployee);

router.patch('/employee/update/:employeeId',validateEmployeeUpdation,employeeController.updateEmployee);

router.delete('/employee/delete/:employeeId',employeeController.deleteEmployee);

// departmental routes
router.post('/department/create',[check('deptName').isLength({min:4}).isAlpha('en-US')],departmentController.createDepartment);

router.delete('/department/dissolve-department',departmentController.dissolveDepartment);

// project and Team routes
router.get('/projects/',teamController.getProjects);

router.post('/team/add-team-project',validationCreateTeamAndProject,teamController.createTeamAndProject);

router.patch('/team/add-team-member',teamController.addTeamMember);

router.patch('/team/update-project/:projectId',validationUpdateProject,teamController.updateProject);

router.delete('/team/dissolve-team-project',teamController.dissolveTeamAndProject);

router.delete('/team/remove-team-member',teamController.removeTeamMember);

module.exports = router;