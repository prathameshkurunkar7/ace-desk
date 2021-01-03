const createAdmin = (req,res,next) =>{
    res.json("Admin Create Route");
}

const deleteAdmin = (req,res,next)=>{
    res.json("Admin Delete Route");
}

const editAdmin = (req,res,next) =>{
    res.json("Admin Edit Route");
}

const getAdmin = (req,res,next)=>{
    res.json("Works");
}


exports.createAdmin = createAdmin;
exports.deleteAdmin = deleteAdmin;
exports.editAdmin = editAdmin;
exports.getAdmin = getAdmin;