const express = require('express');
const HttpError = require('./utils/http-error');
const adminRouter = require('./routers/adminRouter');
const authRouter = require('./routers/authRouter');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(helmet());
app.use(cors());


// all routes here
app.use('/register',authRouter);
app.use('/admin',adminRouter);


app.all('*',(req,res,next)=>{
    const error = new HttpError(`Can't find ${req.originalUrl} on this server.`,404,true);
    return next(error);
});


app.use((error, req, res, next) => {
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