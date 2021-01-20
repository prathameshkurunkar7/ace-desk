const fs = require("fs");
const path = require("path"); 
const puppeteer = require('puppeteer');  
const handlebars = require('handlebars')  

class Payslip {
    async html(payroll) {
        try {
            const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            const d = new Date();
            
            payroll.Date = `${monthNames[d.getMonth()]} ${d.getFullYear()}`
            const data = payroll;
            
            const templateHtml = fs.readFileSync(path.join(process.cwd(), 'views','payslip.hbs'), 'utf8');
            const template = handlebars.compile(templateHtml);
            return template(data);

        } catch (error) {
            throw new Error('Cannot create invoice HTML template.')
        }
    }

    async pdf(payroll) {
        try {
            const html = await this.html(payroll)

            const browser = await puppeteer.launch()
            const page = await browser.newPage()
            await page.setContent(html)
            
            const pdfName =  `Payslip-${payroll.empId['employeeSerialId']}`
            
            await page.pdf({
                path: `./docs/${pdfName}.pdf`,
                format: 'A4',
                printBackground: true
            })
    
            await browser.close();   
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = Payslip;