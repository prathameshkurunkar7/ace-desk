const express = require('express');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require("express-rate-limit");
const compression = require('compression');
const favicon = require('serve-favicon');

const adminRouter = require('./routers/adminRouter');
const authRouter = require('./routers/authRouter');
const employeeRouter = require('./routers/employeeRouter');

const app = express();

app.use(helmet({
    contentSecurityPolicy: false,
}));
app.use(cors());
app.use(compression())
app.use(favicon(path.join(__dirname, 'client', 'public','images','favicon.ico')));

app.set('trust proxy', 1);
 
const apiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1hr
    max: 100,
    message: 'Too many requests from this IP,please try again later.'
});

// limit body data at 300kb only
app.use(express.json({ limit: '300kb' }));
app.use(express.urlencoded({extended:false}));

app.use('/uploads/files',express.static(path.join('uploads','files')));
app.use('/uploads/images',express.static(path.join('uploads','images')));


// all routes here
app.use('/register',apiLimiter,authRouter);
app.use('/admin',adminRouter);
app.use('/employee',employeeRouter);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

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