import React from "react";
import Signin from "./Signin/Signin";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Dashboard from "./Admin/Dashboard/Dashboard";
import Project from "./Admin/Project/Project";
import Employee from "./Admin/Employee/Employee";
import Payroll from "./Admin/payroll/Payroll";
import Department from "./Admin/Department/Department";
import Policies from "./Admin/policies/policies";
import Holidays from "./Admin/holidays/Holidays";
import Attendence from "./Admin/Attendance/Attendence";
import AddEmployee from "./Admin/Employee/AddEmployee";
import EditEmployee from "./Admin/Employee/EditEmployee";
import Proform from "./Admin/Project/Proform";
import EditProject from "./Admin/Project/EditProject";
import Leaves from "./Admin/Leaves/Leaves";
import LnB from "./Admin/LoanB/LnB";
import Policyform from "./Admin/policies/Policyform";
import Editpolicy from "./Admin/policies/Editpolicy";
import Myprofile from "./Admin/MyProfile/Myprofile";
import Myprofilecontent from "./Admin/MyProfile/Myprofilecontent";
import Payslip from "./Admin/payroll/Payslip";
import EmpAttendance from "./Employee/EmpAttendance/EmpAttendance";
import EmpDashboard from "./Employee/EmpDashboard/EmpDashboard";
import EmpLeaves from "./Employee/EmpLeaves/EmpLeaves";
import ELnB from "./Employee/EmpLnB/ELnB";
import EmpPolicies from "./Employee/EmpPolicies/EmpPolicies";
import EditProfileContent from "./Employee/EditProfile/EditProfileContent";
import {
  PrivateAdminRoute,
  PrivateEmployeeRoute,
  PrivateRoute,
} from "./auth/privateRoute";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact component={Signin} />
          <PrivateRoute path="/profile" component={Myprofilecontent} />
          <PrivateRoute path="/editProfile" component={EditProfileContent} />
          <PrivateAdminRoute path="/AdminDashboard" component={Dashboard} />
          <PrivateAdminRoute path="/AdminProject" component={Project} />
          <PrivateAdminRoute path="/AdminEmployee" component={Employee} />
          <PrivateAdminRoute path="/AdminAttendence" component={Attendence} />
          <PrivateAdminRoute path="/AdminPayroll" component={Payroll} />
          <PrivateAdminRoute path="/AdminDepartment" component={Department} />
          <PrivateAdminRoute path="/AdminPolicies" component={Policies} />
          <PrivateAdminRoute path="/AdminHolidays" component={Holidays} />
          <PrivateAdminRoute path="/AdminLoanBonus" component={LnB} />
          <PrivateAdminRoute path="/addEmployee" component={AddEmployee} />
          <PrivateAdminRoute path="/editEmployee" component={EditEmployee} />
          <PrivateAdminRoute path="/addProject" component={Proform} />
          <PrivateAdminRoute path="/editProject" component={EditProject} />
          <PrivateAdminRoute path="/AdminLeaves" component={Leaves} />
          <PrivateAdminRoute path="/addPolicy" component={Policyform} />
          <PrivateAdminRoute path="/editPolicy" component={Editpolicy} />
          <PrivateAdminRoute path="/payslip" component={Payslip} />
          <PrivateEmployeeRoute path="/EmpLoanBonus" component={ELnB} />
          <PrivateEmployeeRoute
            path="/EmpAttendance"
            component={EmpAttendance}
          />
          <PrivateEmployeeRoute path="/EmpDashboard" component={EmpDashboard} />
          <PrivateEmployeeRoute path="/EmpLeaves" component={EmpLeaves} />
          <PrivateEmployeeRoute path="/EmpPolicies" component={EmpPolicies} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
