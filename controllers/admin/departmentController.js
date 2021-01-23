const mongoose = require('mongoose');
const {validationResult} = require('express-validator');
const HttpError = require('../../utils/http-error');
const Employee = mongoose.model('Employee');
const Department = mongoose.model('Department');

// create departments
const createDepartment = async(req,res,next) =>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new HttpError(`${errors.array()[0].msg} given at ${errors.array()[0].param.toLowerCase()} ,please enter valid input.`
            , 422,true)
        return next(err);
    }
    
    const {deptName} = req.body;
    let dept;
    try {
        dept = await Department.findOne({ deptName });
    } catch (err) {
        const error = new HttpError('Some error occured while looking for department',500);
        return next(error);
    }

    if(dept){
        return next(new HttpError('Department already exists',500));
    }

    const department = new Department({
        deptName
    });
    
    try {
        await department.save();
    } catch (err) {
        const error = new HttpError('Could Not Create Department',500);
        return next(error);
    }

    res.status(201).json(department);

}

const getDepartments = async(req,res,next) =>{
    
    let departments,numDepartments,newDepartments;
    try {

        //filtering
        const queryObj = {...req.query};
        const fieldsExclude = ['page','sort','limit','fields'];
        fieldsExclude.forEach(elem => delete queryObj[elem]);
        
        let query = Department.find(queryObj);

        //sorting
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        }else{
            query = query.sort('_id');
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
            numDepartments = await Department.countDocuments();
            if(offset >= numDepartments){
                return next(new HttpError('This Page does not exist',404));
            }
        }
        //Execute query
        departments = await query;
        
        newDepartments = departments.map(dept =>{
            return {
                employeesCount:dept.employees.length,
                _id: dept.id,
                deptName: dept.deptName
            }
        });
    } catch (err) {
        const error = new HttpError('Failed to get department details',500);
        return next(error);
    }
    
    res.status(200).json({departments:newDepartments,totalCount:numDepartments?numDepartments:0})
}

// remove departments
const dissolveDepartment = async(req,res,next) =>{
    const deptId = req.params.deptId;
    
    let dept;
    try {
        dept = await Department.findById(deptId);
    } catch (err) {
        const error = new HttpError('Could not find department',500);
        return next(error);
    }
    if(!dept){
        return next(new HttpError('Department does not exist.',404));
    }

    try {
        await Department.findByIdAndDelete(deptId);
        await Employee.updateMany({"department":deptId},{"department":undefined});
    } catch (err) {
        const error = new HttpError('Could not dissolve department',500);
        return next(error);
    }

    res.status(200).json({"message":"Department has been dissolved"});

}


exports.createDepartment = createDepartment;
exports.dissolveDepartment = dissolveDepartment;
exports.getDepartments = getDepartments;