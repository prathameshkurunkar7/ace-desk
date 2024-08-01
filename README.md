# AceDesk-A HRMS Web Application
This is an old project, no longer maintained or worked on. This was developed as a college project for a Hackathon, the code is now available for reference purpose only. 

Fellow Contributors:
<div>
<a href="https://github.com/lavishgupta029">Lavish Gupta</a>
</div>
<div>
<a href="https://github.com/nikki1908">Niharika Bisht</a>
</div>
<div>
  Rujula Shinde
</div>

<br>

Wherever full URLs are provided in responses they will be rendered as if service
is running on 'http://localhost:3030'.

## :wrench: How to setup

```bash
git clone https://github.com/prathameshkurunkar7/ace-desk.git
cd ace-desk
npm install && npm run install-client
npm run client (in separate terminal)
npm run dev
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
* Home
* Login

## Endpoints that require Authentication

Closed endpoints require a valid JWT Token to be included in the header of the
request.(After Sucessful Login process)
## Common Functionalities
* Profile Info

### Admin User Dashboard

Each endpoint manipulates or displays information related to the User whose
Token is provided with the request,with respect to his role the authorization is then decided and the user is redirected their particular
Dashboard:
* Admin Dashboard
* Employee Management
* Department Management
* Teams and Project Management
* Attendances Management
* Scheduling & Planning
* Leaves Handling
* Policies Handling
* Payroll Management
* Loans and Bonus Management

### Employee Dashboard

Endpoints for viewing and manipulating the Accounts that the Authenticated User
has permissions to access.

* Employee Dashboard
* Mark Attendance
* Apply Leaves
* Delete Applied Leaves
* Apply Loans and Bonus
* Delete Loans and Bonus
