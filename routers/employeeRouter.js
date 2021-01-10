const express = require('express');
const router = express.Router();

const employeeController = require('../controllers/employee/employeeController');
const {fileUpload,resizeImage} = require('../middlewares/fileUpload');
const authenticate = require('../middlewares/authenticate');

router.patch('/profile-image',fileUpload,resizeImage,authenticate,employeeController.updateProfileImage);

module.exports = router;