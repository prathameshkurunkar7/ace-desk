const express = require('express');
const router = express.Router();
const {check} = require('express-validator');

const employeeController = require('../controllers/admin/employeeController');

router.post('/employee/create',
[
    check('firstName').notEmpty().isAlpha(),
    check('lastName').notEmpty().isAlpha(),
    check('dateOfBirth').isDate(),
    check('dateOfJoining').isDate(),
    check('contactNumbers.work').optional({checkFalsy:true}).isMobilePhone(),
    check('contactNumbers.personal').isMobilePhone(),
    check('addresses.Permanent.pincode').isPostalCode(),
    check('addresses.Residential.pincode').isPostalCode(),
    check('addresses.Permanent.address').notEmpty().isAlpha(),
    check('addresses.Permanent.city').notEmpty().isAlpha(),
    check('addresses.Permanent.state').notEmpty().isAlpha(),
    check('addresses.Permanent.country').notEmpty().isAlpha(),
    check('addresses.Residential.address').notEmpty().isAlpha(),
    check('addresses.Residential.city').notEmpty().isAlpha(),
    check('addresses.Residential.state').notEmpty().isAlpha(),
    check('addresses.Residential.country').notEmpty().isAlpha(),
    check('designation').notEmpty().isAlpha()
],
employeeController.createEmployee);

// router.patch('/employee/update',[ check().optional({checkFalsy: true}) ],)

router.get('/employee/send-credentials/:employeeId',employeeController.employeeCredentials);


module.exports = router;