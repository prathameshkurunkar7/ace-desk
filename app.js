const express = require('express');
const fs = require('fs');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require("express-rate-limit");

const HttpError = require('./utils/http-error');
const adminRouter = require('./routers/adminRouter');
const authRouter = require('./routers/authRouter');
const employeeRouter = require('./routers/employeeRouter');

const app = express();

app.use(helmet());
app.use(cors());
// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);
 
const apiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1hr
    max: 100,
    message: 'Too many requests from this IP,please try again later.'
});

// limit body data at 300kb only
app.use(express.json({ limit: '500kb' }));
app.use(express.urlencoded({extended:true}));

app.use('/uploads/files',express.static('uploads/files'));
app.use('/uploads/images',express.static('uploads/images'));

// all routes here
app.use('/register',apiLimiter,authRouter);
app.use('/admin',adminRouter);
app.use('/employee',employeeRouter);


app.all('*',(req,res,next)=>{
    const error = new HttpError(`Can't find ${req.originalUrl} on this server.`,404,true);
    return next(error);
});


app.use((error, req, res, next) => {
    if(req.file){
        fs.unlink(req.file.path,(err)=>{
            if(err) console.log(err);
        });
    }
    if (res.headerSent) {
        return next(error)
    }
    
    // Checking for operational/trusted errors
    if(error.isOperational){
        res.status(error.code);
        res.json({ message: error.message});
    }
    
    // Unknown or Development based errors
    else{
        console.error(error);
        res.status(500).json({
            message: 'An Unknown Error has Occured'
        });
    }
});

module.exports = app;