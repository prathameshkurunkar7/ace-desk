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
import "./DashContent.css";
import { isAuthenticate } from "../../auth/token";

function DashboardContent() {
  const { token } = isAuthenticate();

  const useStyles = makeStyles({});
  const classes = useStyles();
  const [dashData, setDashData] = useState({
    employeeCount: "",
    departmentCount: "",
    projectCount: "",
  });
  const [birthdays, setBirthdays] = useState([]);
  const [chartData, setChartData] = useState({});
  const [leaves, setLeaves] = useState([]);
  const [loans, setLoans] = useState([]);
  const [bonus, setBonus] = useState([]);

  useEffect(() => {
    chart();
  }, []);
  useEffect(function set() {
    async function fetchdashData() {
      const response = await fetch(
        `/admin/dashboard/get-data`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const json = await response.json();
      setBirthdays(json.bdayEmployees);
      setDashData({
        ...dashData,
        employeeCount: json.employeeCount,
        projectCount: json.projectCount,
        departmentCount: json.departmentCount,
      });
      setLeaves(json.leaves);
      setLoans(json.loan);
      setBonus(json.bonus);
    }
    fetchdashData();
  }, []);
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
          label: "Employees",
          data: json.employeeCounts,
          backgroundColor: ["rgba(75, 192, 192, 0.6)"],
          borderWidth: 4,
        },
      ],
    });
  };

  return (
    <div className="dashboard">
      <div className="dashboard__row1">
        <div className="dashboard__card1">
          <h1 className="dashboard__cardHead">Department vs Employee</h1>
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
        <div className="dashboard__col1">
          <div className="dashboard__card2">
            <NavLink to="/AdminProject" className="dashboard__navlink">
              <div className="dashboard__info">
                <div className="dashboard__circle">
                  <WorkRoundedIcon
                    style={{ fontSize: "40px" }}
                    className="dashboard__icon"
                  />
                </div>
                <div className="dashboard__val">
                  <h1 className="dashboard__valh">{dashData.projectCount}</h1>
                  <div className="dashboard__valspan">Projects</div>
                </div>
              </div>
            </NavLink>
          </div>
          <div className="dashboard__card2">
            <NavLink to="/AdminEmployee" className="dashboard__navlink">
              <div className="dashboard__info">
                <div className="dashboard__circle">
                  <PeopleAltRoundedIcon
                    style={{ fontSize: "40px" }}
                    className="dashboard__icon"
                  />
                </div>
                <div className="dashboard__val">
                  <h1 className="dashboard__valh">{dashData.employeeCount}</h1>
                  <div className="dashboard__valspan">Employees</div>
                </div>
              </div>
            </NavLink>
          </div>
          <div className="dashboard__card2">
            <NavLink to="/AdminDepartment" className="dashboard__navlink">
              <div className="dashboard__info">
                <div className="dashboard__circle">
                  <DesktopWindowsRoundedIcon
                    style={{ fontSize: "40px" }}
                    className="dashboard__icon"
                  />
                </div>
                <div className="dashboard__val">
                  <h1 className="dashboard__valh">
                    {dashData.departmentCount}
                  </h1>
                  <div className="dashboard__valspan">Departments</div>
                </div>
              </div>
            </NavLink>
          </div>
        </div>
      </div>
      <div class="dashboard__row2">
        <div class="dashboard__card3">
          <h1 className="dashboard__cardHead">Loans and Bonus</h1>
          <div className="dashboard__cardBody">
            <div classNameName="dashboard__notice">
              <TableContainer>
                <Table className={classes.table} aria-label="simple table">
                  <TableBody>
                    {loans.length === 0 ? (
                      <div style={{ textAlign: "center" }}>
                        {" "}
                        <span>No pending loans</span>
                      </div>
                    ) : (
                      loans.map((row) => (
                        <TableRow>
                          <TableCell align="center">
                            {row.empId.firstName} {row.empId.lastName}
                          </TableCell>
                          <TableCell align="center">
                            {row.loan.amount}
                          </TableCell>
                          <TableCell align="center">
                            {row.loan.status}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                    {bonus.length === 0 ? (
                      <div style={{ display: "flex",justifyContent: "center" }}>
                        <div>No pending bonuses</div>
                      </div>
                    ) : (
                      bonus.map((row) => (
                        <TableRow>
                          <TableCell align="center">
                            {row.empId.firstName} {row.empId.lastName}
                          </TableCell>
                          <TableCell align="center">
                            {row.bonus.amount}
                          </TableCell>
                          <TableCell align="center">
                            {row.bonus.status}
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

        <div className="dashboard__col2">
          <div className="dashboard__card2">
            <h1 className="dashboard__cardHead">Leaves</h1>
            <div className="dashboard__bdayTable">
              <TableContainer>
                <Table className={classes.table} aria-label="simple table">
                  <TableBody>
                    {leaves.length === 0 ? (
                      <div style={{ textAlign: "center" }}>
                        {" "}
                        <span>No leaves</span>
                      </div>
                    ) : (
                      leaves.map((row) => (
                        <TableRow>
                          <TableCell align="center">
                            {row.employeeFirstName} {row.employeeLastName}
                          </TableCell>
                          <TableCell align="center">
                            {row.appliedLeaves.leaveDescription}
                          </TableCell>
                          <TableCell align="center">
                            {row.appliedLeaves.status}
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
        <div className="dashboard__col2">
          <div className="dashboard__card2">
            <h1 className="dashboard__cardHead">Birthdays</h1>
            <div className="dashboard__bdayTable">
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

export default DashboardContent;
