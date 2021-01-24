import React from "react";
import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import AppsOutlinedIcon from "@material-ui/icons/AppsOutlined";
import LocalMallOutlinedIcon from "@material-ui/icons/LocalMallOutlined";
import FaceOutlinedIcon from "@material-ui/icons/FaceOutlined";
import TodayOutlinedIcon from "@material-ui/icons/TodayOutlined";
import FingerprintOutlinedIcon from "@material-ui/icons/FingerprintOutlined";
import PolicyOutlinedIcon from "@material-ui/icons/PolicyOutlined";
import AccountTreeOutlinedIcon from "@material-ui/icons/AccountTreeOutlined";
import CreditCardRoundedIcon from "@material-ui/icons/CreditCardRounded";
import AccountBalanceWalletRoundedIcon from "@material-ui/icons/AccountBalanceWalletRounded";
import BusinessCenterRoundedIcon from "@material-ui/icons/BusinessCenterRounded";
import DirectionsRunRoundedIcon from "@material-ui/icons/DirectionsRunRounded";
import { selectisopenbutton } from "../../features/isopen";
import { isAuthenticate } from "../../auth/token";
function Sidebar() {
  const { profileImage, firstName } = isAuthenticate();
  const isopen = useSelector(selectisopenbutton);
  return (
    <div className={`${isopen ? "Sidebar" : "NoSidebar"}`}>
      <ul>
        <li>
          <div className="Sidebar__proPic">
            <NavLink to="/profile">
              <img
                src={profileImage}
                className="Sidebar__img"
                alt="adminImage"
              />
            </NavLink>
          </div>
          <div className="Sidebar__profile">
            <NavLink to="/" className="Sidebar__name">
              Welcome {firstName}
            </NavLink>
          </div>
        </li>
        <li>
          <NavLink to="/AdminDashboard" className="Sidebar__link">
            <AppsOutlinedIcon className="Sidebar__icon" fontSize="large" />
            <span className="Sidebar__title">Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/AdminProject" className="Sidebar__link">
            <LocalMallOutlinedIcon className="Sidebar__icon" fontSize="large" />
            <span className="Sidebar__title">Projects</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/AdminEmployee" className="Sidebar__link">
            <FaceOutlinedIcon className="Sidebar__icon" fontSize="large" />
            <span className="Sidebar__title">Employees</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/AdminDepartment" className="Sidebar__link">
            <BusinessCenterRoundedIcon
              className="Sidebar__icon"
              fontSize="large"
            />
            <span className="Sidebar__title">Departments</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/AdminPayroll" className="Sidebar__link">
            <AccountBalanceWalletRoundedIcon
              className="Sidebar__icon"
              fontSize="large"
            />
            <span className="Sidebar__title">Payroll</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/AdminLoanBonus" className="Sidebar__link">
            <CreditCardRoundedIcon className="Sidebar__icon" fontSize="large" />
            <span className="Sidebar__title">Loans And Bonus</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/AdminHolidays" className="Sidebar__link">
            <TodayOutlinedIcon className="Sidebar__icon" fontSize="large" />
            <span className="Sidebar__title">Schedule</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/AdminAttendence" className="Sidebar__link">
            <FingerprintOutlinedIcon
              className="Sidebar__icon"
              fontSize="large"
            />
            <span className="Sidebar__title">Attendance</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/AdminLeaves" className="Sidebar__link">
            <DirectionsRunRoundedIcon
              className="Sidebar__icon"
              fontSize="large"
            />
            <span className="Sidebar__title">Leaves</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/AdminPolicies" className="Sidebar__link">
            <PolicyOutlinedIcon className="Sidebar__icon" fontSize="large" />
            <span className="Sidebar__title">Policies</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
