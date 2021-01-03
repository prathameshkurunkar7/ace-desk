const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {check} = require('express-validator');

router.post('/signup',[check('email').isEmail(), check('password').isLength({ min: 6 })],authController.signUp);
router.post('/login',[check('email').isEmail(), check('password').isLength({ min: 6 })],authController.login);

module.exports = router;