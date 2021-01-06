const express = require('express');
const router = express.Router();
const {validateEmployeeCreation, validateEmployeeUpdation} = require('../middlewares/validations');

const employeeController = require('../controllers/admin/employeeController');

router.get('/employee/',employeeController.getEmployees);

router.get('/employee/:employeeId',employeeController.getEmployeeById);

router.get('/employee/send-credentials/:employeeId',employeeController.sendEmployeeCredentials);

router.post('/employee/create',validateEmployeeCreation,employeeController.createEmployee);

router.patch('/employee/update/:employeeId',validateEmployeeUpdation,employeeController.updateEmployee);

router.delete('/employee/delete/:employeeId',employeeController.deleteEmployee);

module.exports = router;