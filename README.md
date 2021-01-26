# AceDesk-A HRMS Web Application

This documentation speaks about the AceDesk Web Application.
Demo Link: 'https://ace-desk.herokuapp.com/'

Where full URLs are provided in responses they will be rendered as if service
is running on 'http://localhost:3030'.

## :wrench: How to setup

```bash
git clone https://github.com/prathameshkurunkar7/ace-desk.git
cd ace-desk
npm install && npm install client
npm client
npm start
```

## :warning: Requirements

- [npm](https://yarnpkg.com)
- [node.js](https://zeit.co/download)
- [MongoDB](https://www.mongodb.com/)

## :hamburger: Tech Stack

- MongoDB
- Express.js
- React.js
- Node.js
- Redux
- Mongoose

## Open Endpoints

Open Functionalities require no Authentication.
* [Home]
* [Login]

## Endpoints that require Authentication

Closed endpoints require a valid JWT Token to be included in the header of the
request.(After Sucessful Login process)
## Common Functionalities
* [Profile Info]

### Admin User Dashboard

Each endpoint manipulates or displays information related to the User whose
Token is provided with the request,with respect to his role the authorization is then decided and the user is redirected their particular
Dashboard:
* [Admin Dashboard]
* [Employee Management]
* [Department Management]
* [Teams and Project Management]
* [Attendances Management]
* [Scheduling & Planning]
* [Leaves Handling]
* [Policies Handling]
* [Payroll Management]
* [Loans and Bonus Management]

### Employee Dashboard

Endpoints for viewing and manipulating the Accounts that the Authenticated User
has permissions to access.

* [Employee Dashboard]
* [Mark Attendance]
* [Apply Leaves]
* [Delete Applied Leaves]
* [Apply Loans and Bonus]
* [Delete Loans and Bonus]