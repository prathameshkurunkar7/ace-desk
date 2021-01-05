# Backend Essentials
## Error Handling
## Server and API separation
## Security Measures
## Apply Rate Limiting
## Uncaught and Unhandled Exception Handlers

## Perfrom User authentication
## While Signing up, register user with Employee role. When changed to HR role manually provide HR permissions.
## While Logging in, show different windows based on Employee or HR.

## HR operations

### -> Adding Employee and Details
### -> Functionality to change,delete and edit Employee. 
### -> Sanction Leaves
### -> Manage Payroll
### -> Verify Attendance
### -> Holiday and Event Creator
### -> Keep Track of Employee B'days. Gift Them Something.
### -> Policy Formation
### -> Select Employee of the Month
### -> Making Departments, assigning Employees,forming teams.
### -> Check Various Recruits and their Applications

## Employee operations
### -> 


# Routing:
## Auth routes
### POST    /register/signup    -> SignUp User
### POST    /register/login     -> Login User
### PATCH   /register/update-password-> Updates Password

## Employee side routes
### /employee ->Base Route


## HR Admin side routes
### /admin ->Base Route
### POST    /admin/employee/create ->                   Adding Employee Details
### GET     /admin/employee/send-credentials/:id ->     Send Login Credential details on Email to particular Employee


# Notes

## Choose Country wise states option in input fields.

<!-- HRM functions
Recruitment
Training
Placement
Appraisal and Reward Systems
Organizational Development Initiatives

Employee fields that can be considered
Salary, Allowances, Increments, leave etc.
Work Experience, training, competencies, skills, performance, expectations.

Blood Group, Age, Educational and Professional Qualifications, Organizational History (Placements, Promotions, Training, Competencies, Performance Appraisal), Salary, Allowances.

Some of the data is static and required to be entered only once like name, date of birth, date of joining.
Data on Placement, training are upgraded frequently.

Data Analysis can be performed on age, gender, geographical regions, level in the organization etc. 

Future Scope
Employee's Feedback and Reward System -->