const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const appConfig = require('../config/appConfig');

module.exports = class Email{
    constructor(user,firstName){
        this.to = user.email,
        this.firstName = firstName,
        this.from = `AceDesk <${appConfig.EMAIL_FROM}>`
    }

    modifiedTransport(){
        if(process.env.NODE_ENV === 'production'){
            return nodemailer.createTransport({
                service:'SendGrid',
                auth:{
                    user: process.env.SEND_GRID_USERNAME,
                    pass: process.env.SEND_GRID_PASSWORD
                }
            })
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

    async sendAttachmentEmail(attachmentFileName,subject,text){
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            text,
            attachments: [{
                filename: `${attachmentFileName}.pdf`,
                path: `./docs/${attachmentFileName}.pdf`,
                contentType: 'application/pdf'
            }],
        };

        const transporter = this.modifiedTransport();
        await transporter.sendMail(mailOptions);
    }

    async sendEmployeeLoginCred(tempPassword,url){
        const data = {
            "name":this.firstName,
            "message-line-1":"You have been registered as an Employee on our Portal. Please use this password and registered Email-Id as your login credentials.",
            "message-line-2":"Hope you have no troubles logging in. Have a good day!",
            "url": url,
            "temporaryPassword": tempPassword
        }
        await this.sendEmail('mail','Employee Login Credentials',data)
    }

    async sendEmployeePaySlip(payroll){
        const attachmentFileName =  `Payslip-${payroll.empId['employeeSerialId']}`
        await this.sendAttachmentEmail(attachmentFileName,'Payslip','Please check your payslip for the month')
    }
}