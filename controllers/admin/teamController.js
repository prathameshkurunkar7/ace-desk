const mongoose = require('mongoose');
const {validationResult} = require('express-validator');
const HttpError = require('../../utils/http-error');
const Employee = mongoose.model('Employee');
const Team = mongoose.model('Team');
const Project = mongoose.model('Project');


// create teams for project
const createTeamAndProject = async(req,res,next) =>{
    const {teamName,teamLeader,teamMembers,projectName,description,status,clientName,dateOfAssignment,dateOfDeadline} = req.body;
    let existingTeam;
    try {
        existingTeam = await Team.findOne({teamName});
    } catch (err) {
        const error = new HttpError('Some error occured',500);
        return next(error);
    }
    if(existingTeam){
        return next(new HttpError('Team with this name Already exists',422));
    }

    let existingProject;
    try {
        existingProject = await Project.findOne({projectName});
    } catch (err) {
        const error = new HttpError('Some error occured',500);
        return next(error);
    }
    if(existingProject){
        return next(new HttpError('Project Already exists',422));
    }

    const project = new Project({
        projectName,
        description,
        status,
        clientName,
        dateOfAssignment,
        dateOfDeadline
    })

    let team = new Team({
        teamName,
        teamLeader,
        teamMembers,
    })

    let newTeam;
    try {
        const getProject = await project.save();
        team.project = getProject.id;
        newTeam = (await team.save()).populate('project');
    } catch (err) {
        const error = new HttpError('Could not create new Team and Project',500);
        return next(error);
    }

    try {
        newTeam.teamMembers.forEach(async(member) =>{
            try {
                await Employee.findByIdAndUpdate(member,{assignedProject: true});
            } catch (err) {
                const error = new HttpError('Could not assign Project to employee',500);
                return next(error);
            }
            await Employee.findByIdAndUpdate(newTeam.teamLeader,{assignedProject: true}); 
        })
    } catch (err) {
        console.log(err);
        const error = new HttpError('Some error occurred',500);
        return next(error);
    }

    res.status(201).json(newTeam);
}

//dissolve team
const dissolveTeamAndProject = async(req,res,next) =>{
    
    const {teamId} = req.body;

    let existingTeam;
    try {
        existingTeam = await Team.findById(teamId);
    } catch (err) {
        const error = new HttpError('Some error occured',500);
        return next(error);
    }
    if(!existingTeam){
        return next(new HttpError('This team does not exist',404));
    }

    let team;
    try {
        team = await Team.findByIdAndDelete(teamId);
        await Project.findByIdAndDelete(team.project);
    } catch (err) {
        const error = new HttpError('Could Not delete team or assigned project',500);
        return next(error);
    }

    try {
        team.teamMembers.forEach(async(member) =>{
            try {
                await Employee.findByIdAndUpdate(member,{assignedProject: false});
            } catch (err) {
                const error = new HttpError('Could not disassign Project to employee',500);
                return next(error);
            }
        })
        await Employee.findByIdAndUpdate(team.teamLeader,{assignedProject: false});   
    } catch (err) {
        const error = new HttpError('Some error occurred',500);
        return next(error);
    }

    res.status(200).json({"message":"Team has been deleted successfully"});

}


//add team member
const addTeamMember = async(req,res,next) =>{
    const {teamId,memberId} = req.body;
    let existingTeam;
    try {
        existingTeam = await Team.findById(teamId);
    } catch (err) {
        const error = new HttpError('Some error occured',500);
        return next(error);
    }
    if(!existingTeam){
        return next(new HttpError('This team does not exist',404));
    }

    if(existingTeam.teamMembers.includes(memberId)){
        return next(new HttpError('Member already exists in Team',400));
    }

    let emp;
    try {
        emp = await Employee.findById(memberId);
    } catch (err) {
        const error = new HttpError('Some error occured',500);
        return next(error);
    }

    if(emp.assignedProject){
        return next(new HttpError('Employee has been already assigned to a project',400));
    }

    let team;
    try {
        team = await Team.findByIdAndUpdate(teamId,{$push:{teamMembers:memberId}},{new:true});
        await Employee.findByIdAndUpdate(memberId,{assignedProject: true});
    } catch (err) {
        const error = new HttpError('Could Not Add employee as Team Member',500);
        return next(error);
    }

    res.status(200).json(team);

}

// remove team member
const removeTeamMember = async(req,res,next) =>{
    const {teamId,memberId} = req.body;
    let existingTeam;
    try {
        existingTeam = await Team.findById(teamId);
    } catch (err) {
        const error = new HttpError('Some error occured',500);
        return next(error);
    }
    if(!existingTeam){
        return next(new HttpError('This team does not exist',404));
    }

    if(!existingTeam.teamMembers.includes(memberId)){
        return next(new HttpError('Member does not exist in Team',400));
    }

    let team;
    try {
        team = await Team.findByIdAndUpdate(teamId,{$pull:{teamMembers:memberId}},{new:true});
        await Employee.findByIdAndUpdate(memberId,{assignedProject: false});
    } catch (err) {
        const error = new HttpError('Could Not Remove employee as Team Member',500);
        return next(error);
    }

    res.status(200).json(team);

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

// update Project details
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
    let project = null;
    try {
        updatedProject = await Project.findByIdAndUpdate(existingProject.id,req.body,{new:true});
        if(updatedProject.status ==='Finished'){
            project = await Project.findByIdAndUpdate(updatedProject.id,{dateOfCompletion:Date.now()},{new:true});
        }
    } catch (err) {
        const error = new HttpError('Could not update Project',500);
        return next(error);
    }

    res.status(200).json(project ? project : updatedProject);

}



exports.createTeamAndProject = createTeamAndProject;
exports.dissolveTeamAndProject = dissolveTeamAndProject;
exports.addTeamMember = addTeamMember;
exports.removeTeamMember = removeTeamMember;
exports.getProjects = getProjects;
exports.updateProject = updateProject;