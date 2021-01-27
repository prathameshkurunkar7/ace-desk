/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { makeStyles } from "@material-ui/core/styles";
import WorkRoundedIcon from "@material-ui/icons/WorkRounded";
import PeopleAltRoundedIcon from "@material-ui/icons/PeopleAltRounded";
import DesktopWindowsRoundedIcon from "@material-ui/icons/DesktopWindowsRounded";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import "./EmpDashboardContent.css";
import { isAuthenticate } from "../../auth/token";

const useStyles = makeStyles({});

function EmpDashboardContent() {
  const classes = useStyles();
  const [birthdays, setBirthdays] = useState([]);
  const [holiday, setholidays] = useState([]);

  const [info, setInfo] = useState({
    projectName: "",
    teamLeader: "",
    department: "",
    employeecount: "",
    availLeaves: "",
    takenLeaves: "",
    bonusAmount: "",
    bonusstatus: "",
    loanAmount: "",
    loanstatus: "",
  });
  const [chartData, setChartData] = useState({});
  const { token } = isAuthenticate();

  const chart = async () => {
    const response = await fetch(
      `/employee/dashboard/graph-data`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const json = await response.json();
    setChartData({
      labels: json.departmentNames,
      datasets: [
        {
          label: "Employee Count",
          data: json.employeeCounts,
          backgroundColor: ["rgba(75, 192, 192, 0.6)"],
          borderWidth: 4,
        },
      ],
    });
  };
  useEffect(() => {
    chart();
  }, []);
  useEffect(async () => {
    await fetch(
      `/employee/dashboard/get-data`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setInfo({
          ...info,
          projectName: data.team.project.projectName,
          teamLeader: data.team.teamLeader.firstName,
          department: data.departmentName,
          employeecount: data.departmentEmployeeCount,
          availLeaves: data.leaves.availableLeaves,
          takenLeaves: data.leaves.takenLeaves,
          bonusAmount: data.loanAndBonus.bonus.amount,
          bonusstatus: data.loanAndBonus.bonus.status,
          loanAmount: data.loanAndBonus.loan.amount,
          loanstatus: data.loanAndBonus.loan.status,
        });
        setBirthdays(data.employeeBdays);
        setholidays(data.upcomingDays);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="Empdashboard">
      <div className="Empdashboard__row1">
        <div className="Empdashboard__card1">
          <h1 className="Empdashboard__cardHead">Department vs Employee</h1>
          <div style={{ width: "100%", height: "60vh" }}>
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                title: { text: "Employee count per Department", display: true },

                scales: {
                  yAxes: [
                    {
                      ticks: {
                        autoSkip: true,
                        maxTicksLimit: 10,
                        beginAtZero: true,
                      },
                      gridLines: {
                        display: false,
                      },
                    },
                  ],
                  xAxes: [
                    {
                      gridLines: {
                        display: false,
                      },
                    },
                  ],
                },
              }}
            />
          </div>
        </div>
        <div className="Empdashboard__col1">
          <div className="Empdashboard__card2">
            <NavLink to="/project" className="Empdashboard__navlink">
              <div className="Empdashboard__info">
                <div className="Empdashboard__circle">
                  <WorkRoundedIcon
                    style={{ fontSize: "40px" }}
                    className="Empdashboard__icon"
                  />
                </div>
                <div>
                  <h1 className="Empdashboard__valh"> Project Name:</h1>
                  <h2 className="Empdashboard__valspan">{info.projectName}</h2>
                  <h1 className="Empdashboard__valspanh"> Team Leader:</h1>
                  <div className="Empdashboard__valspan">{info.teamLeader}</div>
                </div>
              </div>
            </NavLink>
          </div>
          <div className="Empdashboard__card2">
            <NavLink to="/project" className="Empdashboard__navlink">
              <div className="Empdashboard__info">
                <div className="Empdashboard__circle">
                  <PeopleAltRoundedIcon
                    style={{ fontSize: "40px" }}
                    className="Empdashboard__icon"
                  />
                </div>
                <div className="Empdashboard__val">
                  <h1 className="Empdashboard__valh">Department:</h1>
                  <div className="Empdashboard__valspan">{info.department}</div>
                  <h1 className="Empdashboard__valspanh">Employee Count:</h1>
                  <div className="Empdashboard__valspan">
                    {info.employeecount}
                  </div>
                </div>
              </div>
            </NavLink>
          </div>
        </div>
      </div>
      <div class="Empdashboard__row2">
        <div class="Empdashboard__card3">
          <NavLink className="dashboard__navlink" to="./EmpLoanBonus">
            <h1 className="Empdashboard__cardHead">Loans and Bonus</h1>
            <div className="Empdashboard__cardBody">
              <div classNameName="Empdashboard__notice">
                <div>
                  <h2 className="Empdashboard__valh">Bonus</h2>
                  <span className="Empdashboard__valspan">
                    {info.bonusAmount}
                  </span>
                  &nbsp;&nbsp;
                  <span className="Empdashboard__valspan">
                    {info.bonusstatus}
                  </span>
                </div>
                <div>
                  <h2 className="Empdashboard__valh">Loans</h2>
                  <span className="Empdashboard__valspan">
                    {info.loanAmount}
                  </span>
                  &nbsp;&nbsp;
                  <span className="Empdashboard__valspan">
                    {info.loanstatus}
                  </span>
                </div>
              </div>
            </div>
          </NavLink>
        </div>
        <div className="Empdashboard__card3">
          <NavLink className="dashboard__navlink" to="EmpLeaves">
            <h1 className="Empdashboard__cardHead">Leaves</h1>
            <div className="Empdashboard__cardBody">
              <div classNameName="Empdashboard__notice">
                <div classNameName="Empdash__leaves">
                  <div>
                    <h2 className="Empdashboard__valh">{info.availLeaves}</h2>
                    <span className="Empdashboard__valspan">
                      Available Leaves
                    </span>
                  </div>
                  <div>
                    <h2 className="Empdashboard__valh">{info.takenLeaves}</h2>
                    <span className="Empdashboard__valspan">Taken Leaves</span>
                  </div>
                </div>
              </div>
            </div>
          </NavLink>
        </div>
        <div className="Empdashboard__card3">
          <h1 className="Empdashboard__cardHead">Upcoming Events</h1>
          <div className="Empdashboard__cardBody">
            <TableContainer>
              <Table className={classes.table} aria-label="simple table">
                <TableBody>
                  {holiday.length === 0 ? (
                    <div style={{ textAlign: "center" }}>
                      {" "}
                      <span>No Upcoming Events in this Month</span>
                    </div>
                  ) : (
                    holiday.map((row) => (
                      <TableRow>
                        <TableCell align="center">{row.dayType}</TableCell>
                        <TableCell align="center">
                          {row.date.substring(0, 10)}
                        </TableCell>
                        <TableCell align="center">
                          {row.dayDescription}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
        <div className="Empdashboard__col2">
          <div className="Empdashboard__card2">
            <h1 className="Empdashboard__cardHead">Birthdays</h1>

            <div className="Empdashboard__bdayTable">
              <TableContainer>
                <Table className={classes.table} aria-label="simple table">
                  <TableBody>
                    {birthdays.length === 0 ? (
                      <div style={{ textAlign: "center" }}>
                        {" "}
                        <span>No Upcoming Birthdays in this Month</span>
                      </div>
                    ) : (
                      birthdays.map((row) => (
                        <TableRow>
                          <TableCell align="center">
                            {row.firstName} {row.lastName}
                          </TableCell>
                          <TableCell align="center">
                            {row.dateOfBirth.substring(0, 10)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmpDashboardContent;
