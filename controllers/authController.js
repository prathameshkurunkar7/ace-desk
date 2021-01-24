const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const HttpError = require('../utils/http-error');
const appConfig = require('../config/appConfig');
const UserAuth = mongoose.model('UserAuth');
const Employee = mongoose.model('Employee');


const signUp = async(req, res, next) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new HttpError(`${errors.array()[0].msg} given at ${errors.array()[0].param.toLowerCase()} ,please enter valid input.`,422);
        return next(err);
    }

    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await UserAuth.findOne({ email });
    } catch (err) {
        const error = new HttpError('Signing up failed,please try again.', 500);
        return next(error);
    }

    if (existingUser) {
        const error = new HttpError('User already exists,please try logging in', 422);
        return next(error);
    }

    let hashedpassword;
    try {
        hashedpassword = await bcrypt.hash(password, 10);
    } catch (err) {
        const error = new HttpError('Could not create user,please try again', 500)
        return next(error);
    }

    const createdUser = new UserAuth({
        email,
        password: hashedpassword,
    });

    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError(
            'Error while creating new user',
            500
        );
        return next(error);
    }

    let token;
    try {
        token = jwt.sign(
            {userId:createdUser.id,email:createdUser.email,role:createdUser.role},
            appConfig.JWT_SECRET_KEY,
            {expiresIn:"4h"}
        );    
    } catch (err) {
        const error = new HttpError('Signup failed,please try again.',500);
        return next(error);
    }

    res.status(201).json({ userId: createdUser.id, email: createdUser.email,token:token });

};

const login = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new HttpError(`${errors.array()[0].msg} given at ${errors.array()[0].param.toLowerCase()} ,please enter valid input.`
            , 422,true)
        return next(err);
    }

    const { email, password } = req.body;

    let existingUser;
    // existing user in database check
    try {
        existingUser = await UserAuth.findOne({ email });
    } catch (err) {
        const error = new HttpError('Logging in failed,please try again', 500);
        return next(error);
    }

    if (!existingUser) {
        const error = new HttpError('You are not a registered user.', 401);
        return next(error);
    }

    // password check
    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
        const error = new HttpError('Could not log you in,please verify your credentials and try again.', 500);
        return next(error);
    }

    if (!isValidPassword) {
        const error = new HttpError('Invalid credentials,could not log you in.',401);
        return next(error);
    }

    let token;
    try {
        token = jwt.sign(
            { userId: existingUser.id, email: existingUser.email, role: existingUser.role },
            appConfig.JWT_SECRET_KEY,
            { expiresIn: "24h" }
        );
    } catch (err) {
        const error = new HttpError('Logging in failed,please try again.',500);
        return next(error);
    }
    
    let employee;
    try {
        employee = await Employee.findOne({userAuth:existingUser.id}).select('firstName profileImage')
    } catch (err) {
        const error = new HttpError('Something went wrong!',500);
        return next(error);
    }
    
    if(employee.profileImage){
        employee.profileImage = `${appConfig.APP_URL}/${employee.profileImage}`;
    }

    res.status(200).json({
        userId: existingUser.id, email: existingUser.email, token: token,role: existingUser.role,
        firstName:employee.firstName,
        profileImage:employee.profileImage
    });

}

const updatePassword = async(req,res,next) =>{

    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        const err = new HttpError(`${errors.array()[0].msg} given at ${errors.array()[0].param.toLowerCase()} ,please enter valid input.`
            , 422)
        return next(err);
    }

    const {currentPassword,newPassword} = req.body;
    let user;
    try {
        user = await UserAuth.findById(req.user.userId);
    } catch (err) {
        const error = new HttpError('Could Not find Employee User',500);
        return next(error);
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(currentPassword, user.password);
    } catch (err) {
        const error = new HttpError('Could not log you in,please verify your credentials and try again.', 500);
        return next(error);
    }

    if (!isValidPassword) {
        const error = new HttpError('Invalid credentials,could not log you in.',401);
        return next(error);
    }

    let hashedpassword;
    try {
        hashedpassword = await bcrypt.hash(newPassword, 10);
    } catch (err) {
        const error = new HttpError('Could not update password,please try again', 500)
        return next(error);
    }

    let updatedUser;
    try {
       updatedUser = await UserAuth.findByIdAndUpdate(req.user.userId,{password:hashedpassword},{new:true});
    } catch (err) {
        const error = new HttpError('Could not update password,please try again', 500);
        return next(error);
    }

    // let token;
    // try {
    //     token = jwt.sign(
    //         { userId: updatedUser.id, email: updatedUser.email, role: updatedUser.role },
    //         appConfig.JWT_SECRET_KEY,
    //         { expiresIn: "24h" }
    //     );
    // } catch (err) {
    //     const error = new HttpError('Logging in failed,please try again.',500);
    //     return next(error);
    // }
    
    // res.status(200).json({
    //     userId: updatedUser.id, email: updatedUser.email, token: token
    // });

    res.status(200).json({"message":"Your Password has been updated"});

}

exports.signUp = signUp;
exports.login = login;
exports.updatePassword = updatePassword;