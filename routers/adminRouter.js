const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');

router.get('/',adminController.getAdmin);
// add new admin
router.post('/create',adminController.createAdmin);
// delete admin users
router.delete('/delete',adminController.deleteAdmin);
// edit admin user info
router.patch('/edit',adminController.editAdmin);


module.exports = router;