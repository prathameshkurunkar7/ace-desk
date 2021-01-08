const mongoose = require('mongoose');
const {validationResult} = require('express-validator');
const HttpError = require('../../utils/http-error');
const appConfig = require("../../config/appConfig");
const Employee = mongoose.model('Employee');
const UserAuth = mongoose.model('UserAuth');
const Department = mongoose.model('Department');
const Project = mongoose.model('Project');

// create departments
const createDepartment = async(req,res,next) =>{
    
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

// add teams in departments
const createTeam = async(req,res,next) =>{
    const {deptId,teamName,teamLeader,teamMembers} = req.body;

    let dept;
    try {
        dept = await Department.findById(deptId);
    } catch (err) {
        const error = new HttpError('Some error occured',500);
        return next(error);
    }

    const found = dept.teams.some(elem => elem.teamName.toLowerCase() === teamName.toLowerCase());
    if(found){
        return next(new HttpError('Team already exists,please try again.',500));
    }

    const team = {
        teamName,
        teamLeader,
        teamMembers
    }
    
    let department;
    try {
        department = await Department.findByIdAndUpdate(deptId,{$push:{teams:team}},{new:true});
    } catch (err) {
        const error = new HttpError('Some error occured while creating new team.',500);
        return next(error);
    }

    res.status(201).json(department);

}

// add team members in teams later
const addTeamMember = async(req,res,next) =>{
    const {teamId,empId} = req.body;
    
    let dept;
    try {
        dept = await Department.findOne({'teams._id':teamId});
    } catch (err) {
        const error = new HttpError('Could not find team',500);
        return next(error);
    }
    if(!dept){
        return next(new HttpError('Team does not exist.',404));
    }
    
    let team = dept.teams.find(team =>team.id ===teamId);
    if(team.teamMembers.includes(empId)){
        return next(new HttpError('Employee already added in team',422));
    }

    const updatedTeam = team.teamMembers.push(empId);
    const newTeams = dept.teams.map(team => {
        if(updatedTeam.id === team.id){
            team = updatedTeam;
        }
        return team;
    });

    let department;
    try {
        department = await Department.findOneAndUpdate({'teams._id':teamId},{teams:newTeams},{new:true});
    } catch (err) {
        const error = new HttpError('Some error occurred while adding new Employee as Team member',500);
        return next(error);
    }
    
    res.status(200).json(department);
}

// add projects for teams
const assignProject = async(req,res,next) =>{
    const {teamId,projectName,description,status,clientName,dateOfAssignment,dateOfCompletion,dateOfDeadline} = req.body;
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new HttpError(`${errors.array()[0].msg},please enter valid input.`
            , 422,true)
        return next(err);
    }

    let existingProject;
    try {
        existingProject = await Project.findOne({projectName});
    } catch (err) {
        const error = new HttpError('Some error occurred',500);
        return next(error);
    }

    if(existingProject){
        return next(new HttpError('Project already exists',500));
    }

    const project = new Project({
        projectName,
        description,
        status,
        clientName,
        dateOfAssignment,
        dateOfCompletion,
        dateOfDeadline
    })

    let newProject;
    try {
        newProject = await project.save();
        await Department.findOneAndUpdate({'teams._id':teamId},{$push:{"teams.$[].projects":newProject.id}});
    } catch (err) {
        console.log(err);
        const error = new HttpError('Some error occured while assigning project',500);
        return next(error);
    }

    res.status(201).json(newProject);

}

// update project details
const updateProject = async(req,res,next) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new HttpError(`${errors.array()[0].msg},please enter valid input.`
            , 422,true)
        return next(err);
    }
    
    let existingProject;
    try {
        existingProject = await Project.findById(req.params.projectId);
    } catch (err) {
        const error = new HttpError('Could Not find Project',500);
        return next(error);
    }
    
    if(!existingProject){
        return next(new HttpError('No Project Found',404));
    }

    let updatedProject;
    try {
        updatedProject = await Project.findByIdAndUpdate(existingProject.id,req.body,{new:true});
    } catch (err) {
        const error = new HttpError('Could not update Project',500);
        return next(error);
    }

    res.status(200).json(updatedProject);

}

// get projects
const getProjects = async(req,res,next) =>{
    
    let projects,numProjects;
    try {

        //filtering
        const queryObj = {...req.query};
        const fieldsExclude = ['page','sort','limit','fields'];
        fieldsExclude.forEach(elem => delete queryObj[elem]);

        let query = Project.find(queryObj);

        //sorting
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        }else{
            query = query.sort('-dateOfDeadline');
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
            numProjects = await Project.countDocuments();
            if(offset >= numProjects){
                return next(new HttpError('This Page does not exist',404));
            }
        }
        //Execute query
        projects = await query;
        
    } catch (err) {
        const error = new HttpError('Failed to get project details',500);
        return next(error);
    }
    
    res.status(200).json({projects,totalCount:numProjects});

}

// disassign teams from project
const disassignProject = async(req,res,next)=>{
    const {projectId,teamId} = req.body;
    
    let existingProject;
    try {
        existingProject = await Project.findById(projectId);
    } catch (err) {
        const error = new HttpError('Could not find Project',500);
        return next(error);
    }
    if(!existingProject){
        return next(new HttpError('Project does not exist',404));
    }

    let dept;
    try {
        dept = await Department.findOne({'teams._id':teamId});
    } catch (err) {
        const error = new HttpError('Some error occured',500);
        return next(error);
    }

    let team = dept.teams.find(team =>team.id ===teamId);
    const updatedProjects =team.projects.filter(project => project.toString() !== projectId);

    const newTeam = {
        id:team.id,
        projects:updatedProjects,
        teamName:team.teamName,
        teamLeader: team.teamLeader,
        teamMembers: team.teamMembers
    }

    try {
        department = await Department.findOneAndUpdate({'teams._id':teamId},{teams:newTeam},{new:true});
    } catch (err) {
        const error = new HttpError('Could Not Disassign team from project',500);
        return next(error);
    }

    res.status(200).json({"message":"Project has been disassigned."});

}

// remove team members from teams
const removeTeamMember = async(req,res,next) =>{
    const {teamId,empId} = req.body;
    
    let dept;
    try {
        dept = await Department.findOne({'teams._id':teamId});
    } catch (err) {
        const error = new HttpError('Could not find team',500);
        return next(error);
    }
    if(!dept){
        return next(new HttpError('Team does not exist.',404));
    }
    
    let team = dept.teams.find(team =>team.id ===teamId);
    if(!team.teamMembers.includes(empId)){
        return next(new HttpError('Employee does not exist in team',422));
    }

    const updatedTeam =team.teamMembers.filter(emp => emp.toString() !== empId)
    const newTeam = {
        id:team.id,
        projects:team.projects,
        teamName:team.teamName,
        teamLeader: team.teamLeader,
        teamMembers: updatedTeam
    }

    let department;
    try {
        department = await Department.findOneAndUpdate({'teams._id':teamId},{teams:newTeam},{new:true});
    } catch (err) {
        const error = new HttpError('Some error occurred while removing Employee as Team member',500);
        return next(error);
    }
    
    res.status(200).json(department);
}

// remove teams from departments
const dissolveTeam = async(req,res,next) =>{
    const {teamId} = req.body;
    let dept;
    try {
        dept = await Department.findOne({'teams._id':teamId});
    } catch (err) {
        const error = new HttpError('Could not find team',500);
        return next(error);
    }
    if(!dept){
        return next(new HttpError('Team does not exist.',404));
    }
    let team = dept.teams.find(team =>team.id ===teamId);

    try {
        await Department.findByIdAndUpdate(dept.id,{$pull:{teams:team}});
    } catch (err) {
        const error = new HttpError('Could Not Dissolve Team',500);
        return next(error);
    }

    res.status(200).json({"message":"Team has been dissolved successfully "})
}

// remove departments
const dissolveDepartment = async(req,res,next) =>{
    const {deptId} = req.body;
    
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
exports.createTeam = createTeam;
exports.dissolveTeam = dissolveTeam;
exports.addTeamMember = addTeamMember;
exports.removeTeamMember = removeTeamMember;
exports.assignProject = assignProject;
exports.updateProject = updateProject;
exports.disassignProject = disassignProject;
exports.getProjects = getProjects;