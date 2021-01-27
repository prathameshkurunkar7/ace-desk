import React from "react";
import "./EmpSidebar.css";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AppsOutlinedIcon from "@material-ui/icons/AppsOutlined";
import FingerprintOutlinedIcon from "@material-ui/icons/FingerprintOutlined";
import PolicyOutlinedIcon from "@material-ui/icons/PolicyOutlined";
import CreditCardRoundedIcon from "@material-ui/icons/CreditCardRounded";
import DirectionsRunRoundedIcon from "@material-ui/icons/DirectionsRunRounded";
import { selectisopenbutton } from "../../features/isopen";
import { isAuthenticate } from "../../auth/token";

function EmpSidebar() {
  const { profileImage, firstName } = isAuthenticate();
  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      "& > *": {
        margin: theme.spacing(1),
      },
    },
    large: {
      width: theme.spacing(12),
      height: theme.spacing(12),
      marginLeft: theme.spacing(12),
    },
  }));
  const classes = useStyles();
  const isopen = useSelector(selectisopenbutton);

  return (
    <div className={`${isopen ? "EmpSidebar" : "EmpNoSidebar"}`}>
      <ul>
        <li>
          <div className="EmpSidebar__proPic">
          <NavLink to="/profile">
              <Avatar
                src={profileImage}
                className={classes.large}
              />
            </NavLink>
          </div>
          <div className="EmpSidebar__profile">
            <NavLink to="/" className="EmpSidebar__name">
              Welcome {firstName}
            </NavLink>
          </div>
        </li>
        <li>
          <NavLink to="/EmpDashboard" className="EmpSidebar__link">
            <AppsOutlinedIcon className="EmpSidebar__icon" fontSize="large" />
            <span className="EmpSidebar__title">Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/EmpLoanBonus" className="EmpSidebar__link">
            <CreditCardRoundedIcon
              className="EmpSidebar__icon"
              fontSize="large"
            />
            <span className="EmpSidebar__title">Loans and Bonus</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/EmpAttendance" className="EmpSidebar__link">
            <FingerprintOutlinedIcon
              className="EmpSidebar__icon"
              fontSize="large"
            />
            <span className="EmpSidebar__title">Attendance</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/EmpLeaves" className="EmpSidebar__link">
            <DirectionsRunRoundedIcon
              className="EmpSidebar__icon"
              fontSize="large"
            />
            <span className="EmpSidebar__title">Leaves</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/EmpPolicies" className="EmpSidebar__link">
            <PolicyOutlinedIcon className="EmpSidebar__icon" fontSize="large" />
            <span className="EmpSidebar__title">Policies</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default EmpSidebar;
