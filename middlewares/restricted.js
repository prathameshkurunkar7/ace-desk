const HttpError = require('../utils/http-error');

const restrictedAccess = (req,res,next) =>{
    if(req.user.role === 'Employee'){
        const error = new HttpError('You are unauthorized to perform this operation',403);
        return next(error);
    }
    next();
}

module.exports = restrictedAccess;