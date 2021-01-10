const express = require('express');
const router = express.Router();
const {check} = require('express-validator');
const authController = require('../controllers/authController');
const authenticate = require('../middlewares/authenticate');

router.post('/signup',[
    check('email').normalizeEmail().isEmail(), check('password').isLength({ min: 8,max:30 }).withMessage('Minimum length has to be 8')
],authController.signUp);

router.post('/login',[
    check('email').normalizeEmail().isEmail(), check('password').isLength({ min: 8,max:30 }).withMessage('Minimum length has to be 8')
],authController.login);

router.patch('/update-password',[
    check('currentPassword').isLength({min:8,max:30}).withMessage('Minimum length has to be 8'),
    check('newPassword').isLength({min:8,max:30}).withMessage('Minimum length has to be 8')
],authenticate,authController.updatePassword);

module.exports = router;