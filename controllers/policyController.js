const mongoose = require('mongoose');
const fs = require('fs');
const {validationResult} = require('express-validator');
const HttpError = require('../utils/http-error');
const appConfig = require('../config/appConfig');
const Policy = mongoose.model('Policy');

// create policy
const createPolicy = async(req,res,next) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new HttpError(`${errors.array()[0].msg} given at ${errors.array()[0].param.toLowerCase()} ,please enter valid input.`
            , 422)
        return next(err);
    }
    if(!req.file){
        return next(new HttpError('No File Found',400));
    }
    
    const policyFile = req.file.path;
    const {policyName,department,description} = req.body;

    let existingPolicy;
    try {
        existingPolicy = await Policy.findOne({policyName:policyName,department:department});
    } catch (err) {
        const error = new HttpError('Something went wrong',500);
        return next(error);
    }

    if(existingPolicy){
        return next(new HttpError('This Policy already exists!',400));
    }

    const policy = new Policy({
        policyName,
        department,
        description,
        policyFile
    })

    let newPolicy;
    try {
        newPolicy = await policy.save();
    } catch (err) {
        const error = new HttpError('Could Not create new policy',500);
        return next(error);
    }
    
    newPolicy.policyFile = newPolicy.policyFile.replace(/\\/g,'/');
    res.status(201).json(newPolicy)

}

//get policies
const getPolicies = async(req,res,next) =>{

    let policies;
    try {
        //filtering
        const queryObj = {...req.query};
        const fieldsExclude = ['page','sort','limit','fields'];
        fieldsExclude.forEach(elem => delete queryObj[elem]);

        let query = Policy.find(queryObj);

        //sorting
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        }else{
            query = query.sort('-createdAt');
        }

        // field limiting
        if(req.query.fields){
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        }else{
            query = query.select('-__v'); 
        }
        
        // pagination
        const limit = req.query.limit*1 || 10;
        const page = req.query.page*1 || 1;
        const offset = (page-1)*limit;
        
        query = query.skip(offset).limit(limit);
        
        if(req.query.page){
            const numPolicies = await Policy.countDocuments();
            if(offset >= numPolicies){
                return next(new HttpError('This Page does not exist',404));
            }
        }
        //Execute query
        policies = await query.populate('department','deptName');
        
    } catch (err) {
        const error = new HttpError('Failed to get policy details',500);
        return next(error);
    }
    policies.forEach((policy)=>{
        policy.policyFile = `${appConfig.APP_URL}/${policy.policyFile.replace(/\\/g,'/')}`;
    })

    res.status(200).json({policies,totalCount:policies.length?policies.length:0});
}

const deletePolicy = async(req,res,next) =>{
    const policyId = req.params.policyId;
    
    let policy;
    try {
        policy = await Policy.findById(policyId);
    } catch (err) {
        const error = new HttpError('Something went wrong!',500);
        return next(error);
    }

    if(!policy){
        return next(new HttpError('No such policy found!',400));
    }

    try {
        await Policy.findByIdAndDelete(policy.id);
    } catch (err) {
        const error = new HttpError('Could not remove policy',500);
        return next(error);
    }
    
    fs.unlink(policy.policyFile,err=>{
        if(err){
            console.log(err);
        }
    });

    res.status(200).json({"message":"Policy has been discarded successfully"})

}

const updatePolicy = async(req,res,next) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new HttpError(`${errors.array()[0].msg} given at ${errors.array()[0].param.toLowerCase()} ,please enter valid input.`
            ,422)
        return next(err);
    }
    
    let existingPolicy;
    try {
        existingPolicy = await Policy.findById(req.params.policyId);
    } catch (err) {
        const error = new HttpError('Something went wrong!',500);
        return next(error);
    }
    
    if(!existingPolicy){
        return next(new HttpError('No Policy Found',404));
    }

    let policy;
    if(req.file){
        const policyFile = req.file.path;
        
        if(existingPolicy.policyFile){
            fs.unlink(existingPolicy.policyFile,(err)=>{
                if(err) console.log(err);
            })
        }

        try {
            policy = await Policy.findByIdAndUpdate(req.params.policyId,{policyFile:policyFile},{new:true});
        } catch (err) {
            const error = new HttpError('Could Not Update Policy',500);
            return next(error);
        }
    }

    try {
        policy = await Policy.findByIdAndUpdate(req.params.policyId,req.body,{new:true});      
    } catch (err) {
        const error = new HttpError('Could Not Update Policy',500);
        return next(error);
    }
    
    policy.policyFile = `${appConfig.APP_URL}/${policy.policyFile.replace(/\\/g,'/')}`;
    
    res.status(200).json(policy);
}

exports.createPolicy = createPolicy;
exports.getPolicies = getPolicies;
exports.deletePolicy = deletePolicy;
exports.updatePolicy = updatePolicy;