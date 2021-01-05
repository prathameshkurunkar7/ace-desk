const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticate = require('../middlewares/authenticate');
const {check} = require('express-validator');

router.post('/signup',[check('email').isEmail(), check('password').isLength({ min: 8 })],authController.signUp);
router.post('/login',[check('email').isEmail(), check('password').isLength({ min: 8 })],authController.login);

router.patch('/update-password',[check('currentPassword').isLength({min:8}),check('newPassword').isLength({min:8})],authenticate,authController.updatePassword);

module.exports = router;