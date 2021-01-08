const {check,body} = require('express-validator');

exports.validateEmployeeCreation = [
    check('firstName').notEmpty().isAlpha().withMessage('Name should be Alphabetic'),
    check('lastName').notEmpty().isAlpha().withMessage('Name should be Alphabetic'),
    check('email').normalizeEmail().isEmail(),
    check('dateOfBirth').custom(val=>{
        if (isNaN(Date.parse(val))) return false;
        else return true;
    }).withMessage('Entered Date is not valid'),
    check('dateOfJoining').custom(val=>{
        if (isNaN(Date.parse(val))) return false;
        else return true;
    }).withMessage('Entered Date is not valid'),
    check('bloodGroup').isIn(['A+','A-','O+','O-','B+','B-','AB+','AB-']).withMessage('Should be a legit blood group'),
    check('contactNumbers.work').optional({checkFalsy:true}).isMobilePhone('en-IN').withMessage('Not a valid Mobile Number'),
    check('contactNumbers.personal').isMobilePhone('en-IN').withMessage('Not a valid Mobile Number'),
    check('addresses.*.pincode').isPostalCode('IN').withMessage('Should be a valid Postal Code'),
    check('addresses.*.address').isLength({min:4,max:60}).isAlpha(),
    check('addresses.*.city').notEmpty().isAlpha(),
    check('addresses.*.state').notEmpty().isAlpha(),
    check('addresses.*.country').notEmpty().isAlpha(),
    check('designation').notEmpty().isAlpha().isIn(['Manager','General Manager','Executive','President','Project Manager','Developer','Designer','Marketing Head','HR Admin','Captain','Other']).withMessage('Should be a legit designation'),
]

exports.validateEmployeeUpdation = [
    body().custom(body => {
        const keys = ['firstName','lastName','email','dateOfBirth','dateOfJoining','bloodGroup','contactNumbers.work','contactNumbers.personal'
        ,'addresses.Permanent.pincode','addresses.Permanent.address','addresses.Permanent.city','addresses.Permanent.state','addresses.Permanent.country'
        ,'addresses.Residential.pincode','addresses.Residential.address','addresses.Residential.city','addresses.Residential.state','addresses.Residential.country'
        ,'designation'];
        return Object.keys(body).every(key => keys.includes(key));
    }).withMessage('Some extra parameters are sent'),
    check('firstName').optional({checkFalsy:true}).notEmpty().isAlpha().withMessage('Should Be Alphabetic'),
    check('lastName').optional({checkFalsy:true}).notEmpty().isAlpha().withMessage('Should be Alphabetic'),
    check('dateOfBirth').optional({checkFalsy:true}).custom(val=>{
        if (isNaN(Date.parse(val))) return false;
        else return true;
    }).withMessage('Entered Date is not valid'),
    check('dateOfJoining').optional({checkFalsy:true}).custom(val=>{
        if (isNaN(Date.parse(val))) return false;
        else return true;
    }).withMessage('Entered Date is not valid'),
    check('bloodGroup').optional({checkFalsy:true}).isIn(['A+','A-','O+','O-','B+','B-','AB+','AB-']).withMessage('Should be a legit blood group'),
    check('contactNumbers.work').optional({checkFalsy:true}).isMobilePhone('en-IN').withMessage('Not a valid Mobile Number'),
    check('contactNumbers.personal').optional({checkFalsy:true}).isMobilePhone('en-IN').withMessage('Not a valid Mobile Number'),
    check('addresses.*.pincode').optional({checkFalsy:true}).isPostalCode('IN').withMessage('Should be a valid Postal Code'),
    check('addresses.*.address').optional({checkFalsy:true}).isLength({min:4,max:60}).isAlpha(),
    check('addresses.*.city').optional({checkFalsy:true}).notEmpty().isAlpha(),
    check('addresses.*.state').optional({checkFalsy:true}).notEmpty().isAlpha(),
    check('addresses.*.country').optional({checkFalsy:true}).notEmpty().isAlpha(),
    check('designation').optional({checkFalsy:true}).notEmpty().isAlpha().isIn(['Manager','General Manager','Executive','President','Project Manager','Developer','Designer','Marketing Head','HR Admin','Captain','Other']).withMessage('Should be a legit designation'),
]

exports.validationTeamCreation = [check('teamName').isAlpha().isLength({min:4})]

exports.validationCreateProject = [
    check('projectName').isLength({min:4,max:30}).withMessage('Project Name should have atleast 4 characters'),
    check('description').isLength({min:4,max:60}).withMessage('Description can be of max 60 characters and minimum 4 characters'),
    check('status').isIn(['Ongoing','Finished']).withMessage('Status has to be either Ongoing or finished'),
    check('clientName').isLength({min:4}).withMessage('Client Name has to be atleast 4 characters'),
    check('dateOfAssignment').custom(val=>{
        if (isNaN(Date.parse(val))) return false;
        else return true;
    }).withMessage('Entered date is invalid'),
    check('dateOfDeadline').custom(val=>{
        if (isNaN(Date.parse(val))) return false;
        else return true;
    }).withMessage('Entered date is invalid'),
    check('dateOfCompletion').custom(val=>{
        if (isNaN(Date.parse(val))) return false;
        else return true
    }).withMessage('Entered date is invalid')
]
exports.validationUpdateProject = [
    body().custom(body => {
        const keys = ['projectName','description','status','clientName','dateOfAssignment','dateOfDeadline','dateOfCompletion'];
        return Object.keys(body).every(key => keys.includes(key));
    }).withMessage('Some extra parameters are sent'),
    check('projectName').optional({checkFalsy:true}).isLength({min:4,max:30}).withMessage('Project Name should have atleast 4 characters'),
    check('description').optional({checkFalsy:true}).isLength({min:4,max:60}).withMessage('Description can be of max 60 characters'),
    check('status').optional({checkFalsy:true}).isIn(['Ongoing','Finished']).withMessage('Status has to be either Ongoing or finished'),
    check('clientName').optional({checkFalsy:true}).isLength({min:4}).withMessage('Client Name has to be atleast 4 characters'),
    check('dateOfAssignment').optional({checkFalsy:true}).custom(val=>{
        if (isNaN(Date.parse(val))) return false;
        else return true;
    }).withMessage('Entered date is invalid'),
    check('dateOfDeadline').optional({checkFalsy:true}).custom(val=>{
        if (isNaN(Date.parse(val))) return false;
        else return true;
    }).withMessage('Entered date is invalid'),
    check('dateOfCompletion').optional({checkFalsy:true}).custom(val=>{
        if (isNaN(Date.parse(val))) return false;
        else return true;
    }).withMessage('Entered date is invalid')

]