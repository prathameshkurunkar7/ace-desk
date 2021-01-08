const mongoose = require('mongoose');
const appConfig = require('../config/appConfig');

mongoose.connect(appConfig.DB_URL_LOCAL,{ useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true, useCreateIndex: true}, (err) => {
    if (!err) {
      console.log('Connection to Database has been established.');
    }
    else {
      console.log('Error in connecting to Database.' + err);
    }
});

require('./employeeSchema');
require('./userAuthSchema');
require('./payrollSchema');
require('./attendanceSchema');
require('./leaveSchema');
require('./occasionSchema');
require('./projectSchema');
require('./departmentSchema');