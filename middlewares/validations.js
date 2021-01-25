const {check,body,query} = require('express-validator');
const {IndianStates, Designations, QualificationTitles, BloodGroups} = require('../utils/helperData');

exports.validateEmployeeCreation = [
    check('firstName').notEmpty().trim().withMessage('Name must not be empty').isAlpha().withMessage('Name should be Alphabetic'),
    check('lastName').notEmpty().trim().withMessage('Name must not be empty').isAlpha().withMessage('Name should be Alphabetic'),
    check('email').normalizeEmail().isEmail(),
    check('dateOfBirth').custom(val=>{
        if (isNaN(Date.parse(val))) return false;
        else return true;
    }).withMessage('Entered Date is not valid'),
    check('dateOfJoining').custom(val=>{
        if (isNaN(Date.parse(val))) return false;
        else return true;
    }).withMessage('Entered Date is not valid'),
    check('bloodGroup').isIn(BloodGroups).withMessage('Should be a legit blood group'),
    check('contactNumbers.work').optional({checkFalsy:true}).isMobilePhone('en-IN').withMessage('Not a valid Mobile Number'),
    check('contactNumbers.personal').isMobilePhone('en-IN').withMessage('Not a valid Mobile Number'),
    check('addresses.*.pincode').isPostalCode('IN').withMessage('Should be a valid Postal Code'),
    check('addresses.*.address').notEmpty().trim(),
    check('addresses.*.city').notEmpty().trim(),
    check('addresses.*.state').notEmpty().trim().isIn(IndianStates),
    check('addresses.*.country').notEmpty().trim().equals('India'),
    check('designation').notEmpty().isIn(Designations).withMessage('Should be a legit designation'),
    check('work.experience').isNumeric({no_symbols:true}),
    check('work.previousCompany').notEmpty().trim(),
    check('education.instituteName').notEmpty().trim(),
    check('education.graduatingDate').custom(val=>{
        if (isNaN(Date.parse(val))) return false;
        else return true;
    }).withMessage('Entered Date is not valid'),
    check('education.qualificationTitle').isIn(QualificationTitles).withMessage('Employee with such qualification not allowed')
]

exports.validateEmployeeUpdation = [
    body().custom(body => {
        const keys = ['firstName','lastName','email','dateOfBirth','dateOfJoining','bloodGroup','contactNumbers.work','contactNumbers.personal'
        ,'addresses.Permanent.pincode','addresses.Permanent.address','addresses.Permanent.city','addresses.Permanent.state','addresses.Permanent.country'
        ,'addresses.Residential.pincode','addresses.Residential.address','addresses.Residential.city','addresses.Residential.state','addresses.Residential.country'
        ,'designation'];
        return Object.keys(body).every(key => keys.includes(key));
    }).withMessage('Some extra parameters are sent'),
    check('firstName').optional({checkFalsy:true}).notEmpty().trim().withMessage('Name must not be empty').isAlpha().withMessage('Name should be Alphabetic'),
    check('lastName').optional({checkFalsy:true}).notEmpty().trim().withMessage('Name must not be empty').isAlpha().withMessage('Name should be Alphabetic'),
    check('dateOfBirth').optional({checkFalsy:true}).custom(val=>{
        if (isNaN(Date.parse(val))) return false;
        else return true;
    }).withMessage('Entered Date is not valid'),
    check('dateOfJoining').optional({checkFalsy:true}).custom(val=>{
        if (isNaN(Date.parse(val))) return false;
        else return true;
    }).withMessage('Entered Date is not valid'),
    check('bloodGroup').optional({checkFalsy:true}).isIn(BloodGroups).withMessage('Should be a legit blood group'),
    check('contactNumbers.work').optional({checkFalsy:true}).isMobilePhone('en-IN').withMessage('Not a valid Mobile Number'),
    check('contactNumbers.personal').optional({checkFalsy:true}).isMobilePhone('en-IN').withMessage('Not a valid Mobile Number'),
    check('addresses.*.pincode').optional({checkFalsy:true}).isPostalCode('IN').withMessage('Should be a valid Postal Code'),
    check('addresses.*.address').optional({checkFalsy:true}).notEmpty().trim(),
    check('addresses.*.city').optional({checkFalsy:true}).notEmpty().trim(),
    check('addresses.*.state').optional({checkFalsy:true}).notEmpty().trim().isIn(IndianStates),
    check('addresses.*.country').optional({checkFalsy:true}).notEmpty().trim().equals('India'),
    check('designation').optional({checkFalsy:true}).notEmpty().isIn(Designations).withMessage('Should be a legit designation'),
    check('work.experience').optional({checkFalsy:true}).isNumeric({no_symbols:true}),
    check('work.previousCompany').optional({checkFalsy:true}).notEmpty().trim(),
    check('education.instituteName').optional({checkFalsy:true}).notEmpty().trim(),
    check('education.graduatingDate').optional({checkFalsy:true}).custom(val=>{
        if (isNaN(Date.parse(val))) return false;
        else return true;
    }).withMessage('Entered Date is not valid'),
    check('education.qualificationTitle').optional({checkFalsy:true}).isIn(QualificationTitles).withMessage('Employee with such qualification not allowed')
]


exports.validationCreateTeamAndProject = [
    check('teamName').notEmpty().trim(),
    check('projectName').isLength({min:4,max:30}).withMessage('Project Name should have atleast 4 characters'),
    check('description').notEmpty().trim(),
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
        const keys = ['projectName','description','status','clientName','dateOfAssignment','dateOfDeadline'];
        return Object.keys(body).every(key => keys.includes(key));
    }).withMessage('Some extra parameters are sent'),
    check('projectName').optional({checkFalsy:true}).isLength({min:4,max:30}).withMessage('Project Name should have atleast 4 characters'),
    check('description').optional({checkFalsy:true}).notEmpty().trim(),
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
]

exports.validationUpdateTeamDetails = [
    body().custom(body => {
        const keys = ['teamName','teamLeader'];
        return Object.keys(body).every(key => keys.includes(key));
    }).withMessage('Some extra parameters are sent'),
    check('teamName').notEmpty().trim(),
]

exports.validationGetAttendance = [
    query('status').optional({checkFalsy:true}).isIn(['Present','Absent','On Leave']),
    query('workingDate').optional({checkFalsy:true}).custom(val=>{
        if (isNaN(Date.parse(val))) return false;
        else return true;
    }).withMessage('Entered date is invalid')
]

exports.validationMarkAttendance = [
    check('status').optional({checkFalsy:true}).isIn(['Present','Absent']),
]

exports.validationSetSchedule = [
    check('daysSchedule.*.dayType').isIn(['Event','Holiday','Business']).withMessage('Different values given from what expected'),
    check('daysSchedule.*.date').custom(val=>{
        if (isNaN(Date.parse(val))) return false;
        else return true;
    }).withMessage('Entered date is invalid'),
    check('daysSchedule.*.dayDescription').notEmpty().trim().withMessage('Description is invalid')
]

exports.validationEditDaySchedule = [
    body().custom(body => {
        const keys = ['dayType','dayDescription'];
        return Object.keys(body).every(key => keys.includes(key));
    }).withMessage('Some extra parameters are sent'),
    check('dayType').isIn(['Event','Holiday','Business']).withMessage('Different values given from what expected'),
    check('dayDescription').notEmpty().trim().withMessage('Description is invalid')
]

exports.validationApplyLeaves = [
    body().custom(body => {
        const keys = ['leaveFrom','leaveTo','leaveDescription'];
        return Object.keys(body).every(key => keys.includes(key));
    }).withMessage('Some extra parameters are sent'),
    check('leaveDescription').notEmpty().trim().withMessage('Description is invalid'),
    check('leaveFrom').custom(val=>{
        if (isNaN(Date.parse(val))) return false;
        else return true;
    }).withMessage('Entered date is invalid'),
    check('leaveTo').custom(val=>{
        if (isNaN(Date.parse(val))) return false;
        else return true;
    }).withMessage('Entered date is invalid'),
]

exports.validationsActionOnLeave = [
    body().custom(body => {
        const keys = ['appliedLeaveId','leaveId','action'];
        return Object.keys(body).every(key => keys.includes(key));
    }).withMessage('Some extra parameters are sent'),
    check('action').isIn(['Accepted','Rejected'])
]

exports.validationCreatePolicy = [
    body().custom(body => {
        const keys = ['policyName','description','department'];
        return Object.keys(body).every(key => keys.includes(key));
    }).withMessage('Some extra parameters are sent'),
    check('policyName').not().isEmpty().trim().withMessage('Policy cannot be empty'),
    check('description').not().isEmpty().trim().withMessage('Description cannot be empty')
]

exports.validationUpdatePolicy = [
    body().custom(body => {
        const keys = ['policyName','description','department'];
        return Object.keys(body).every(key => keys.includes(key));
    }).withMessage('Some extra parameters are sent'),
    check('policyName').not().isEmpty().trim().withMessage('Policy cannot be empty'),
    check('description').not().isEmpty().trim().withMessage('Description cannot be empty')
]

exports.validationCreatePaySlip = [
    body().custom(body => {
        const keys = ['empId'];
        return Object.keys(body).every(key => keys.includes(key));
    }).withMessage('Some extra parameters are sent'),
]

exports.validationAddAllowance = [
    body().custom(body => {
        const keys = ['phone','conveyance','medical','performance'];
        return Object.keys(body).every(key => keys.includes(key));
    }).withMessage('Some extra parameters are sent'),
    check('phone').isNumeric({no_symbols:true}).withMessage('Should be a number'),
    check('conveyance').isNumeric({no_symbols:true}).withMessage('Should be a number'),
    check('medical').isNumeric({no_symbols:true}).withMessage('Should be a number'),
    check('performance').isNumeric({no_symbols:true}).withMessage('Should be a number'),
]

exports.validateSanctionLoanBonus = [
    body().custom(body => {
        const keys = ['paymentRequest','amount','description','status'];
        return Object.keys(body).every(key => keys.includes(key));
    }).withMessage('Some extra parameters are sent'),
    check('paymentRequest').isIn(['Loan','Bonus']).withMessage('Can be Loan or Bonus only'),
    check('amount').isInt({max:50000,min:1000}).withMessage('Amount must be between 1000 and 50000'),
    check('description').notEmpty().trim().withMessage('Please enter valid description.'),
    check('status').isIn(['Rejected','Accepted']),
]

exports.validateApplyLoanBonus = [
    body().custom(body => {
        const keys = ['paymentRequest','amount','description'];
        return Object.keys(body).every(key => keys.includes(key));
    }).withMessage('Some extra parameters are sent'),
    check('paymentRequest').isIn(['Loan','Bonus']).withMessage('Can be Loan or Bonus only'),
    check('amount').isInt({max:50000,min:1000}).withMessage('Amount must be between 1000 and 50000'),
    check('description').notEmpty().trim().withMessage('Please enter valid description.'),
]

exports.validateUpdateProfile = [
    body().custom(body => {
        const keys = ['github','linkedIn','twitter','about'];
        return Object.keys(body).every(key => keys.includes(key));
    }).withMessage('Some extra parameters are sent'),
    check('github').isURL({ host_whitelist: [/^.*github\.com$/,] }).withMessage('Should be a Github URL'),
    check('linkedIn').isURL({ host_whitelist: [/^.*linkedin\.com$/,] }).withMessage('Should be a LinkedIn URL'),
    check('twitter').isURL({ host_whitelist: [/^.*twitter\.com$/,] }).withMessage('Should be a Twitter URL'),
    check('about').notEmpty().trim().withMessage('Please enter valid About')
]