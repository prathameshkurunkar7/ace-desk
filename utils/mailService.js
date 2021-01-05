const { model } = require('mongoose');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const appConfig = require('../config/appConfig');

module.exports = class Email{
    constructor(user,firstName,url){
        this.to = user.email,
        this.firstName = firstName,
        this.url = url,
        this.password = user.password //temporary only
        this.from = `Company Name <${appConfig.EMAIL_FROM}>`
    }

    modifiedTransport(){
        if(process.env.NODE_ENV === 'production'){
            //sendGrid configuration
            return 1;
        }

        return nodemailer.createTransport({
            host: appConfig.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            requireTLS: true,
            auth: {
                user: appConfig.EMAIL_USERNAME,
                pass: appConfig.EMAIL_PASSWORD
            }
        });
    }

    async sendEmail(template,subject,data){

        const handlebarOptions = {
            viewEngine: {
              extName: '.hbs',
              partialsDir: 'views',
              layoutsDir: 'views',
              defaultLayout: ''
            },
            viewPath: 'views',
            extName: '.hbs',
        };
        
        const transporter = this.modifiedTransport();
        transporter.use('compile', hbs(handlebarOptions));
    
    
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            template,
            context: data
        };

        await transporter.sendMail(mailOptions);
    }

    async sendEmployeeLoginCred(){
        const data = {
            "name":this.firstName,
            "message-line-1":"You have been registered as an Employee on our Portal. Please use this password and registered Email-Id as your login credentials.",
            "message-line-2":"Hope you have no troubles logging in. Have a good day!",
            "url": this.url,
            "temporaryPassword": this.password
        }
        await this.sendEmail('mail','Employee Login Credentials',data)
    }

}