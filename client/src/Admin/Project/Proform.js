import React, { useState, useEffect } from "react";
import SearchRoundedIcon from "@material-ui/icons/SearchRounded";
import "date-fns";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import AddRoundedIcon from "@material-ui/icons/AddRounded";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import "./Proform.css";
import { TablePagination } from "@material-ui/core";
import { toast, ToastContainer } from "react-toastify";
import { useHistory } from "react-router-dom";
import { isAuthenticate } from "../../auth/token";

export default function Proform() {
  const [values, setvalues] = useState({
    teamName: "",
    teamLeader: "",
    projectName: "",
    description: "",
    clientName: "",
  });
  const history = useHistory();
  const { token } = isAuthenticate();

  const [message, setMessage] = useState("");
  const [departments, setDepartments] = useState([]);
  const [teamList, setTeamList] = useState([]);
  const [teamMember, setTeamMember] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(3);
  const [employees, setEmployees] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const [searchEmp, setSearchEmp] = useState("");
  const [searchEmpByDept, setSearchEmpByDept] = useState("");
  const [dateOfAssignment, setSelectedDateForDoa] = useState(
    Date().toLocaleString()
  );
  useEffect(async () => {
    await fetch(`/admin/department/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then(({ departments }) => {
        setDepartments(departments);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const handleDateChangeForDoa = (date) => {
    setSelectedDateForDoa(date);
  };
  const [dateOfDeadline, setSelectedDateForDod] = useState(
    Date().toLocaleString()
  );

  const handleDateChangeForDod = (date) => {
    setSelectedDateForDod(date);
  };
  const handleChange = (event) => {
    setvalues({ ...values, [event.target.name]: event.target.value });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 17,
    },
  }))(TableCell);

  const StyledTableRow = withStyles((theme) => ({
    root: {
      "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }))(TableRow);
  useEffect(async () => {
    let paging = "";
    if (searchEmp == "" && searchEmpByDept == "" && message == "") {
      paging = `limit=${rowsPerPage}&page=${page + 1}`;
    } else {
      paging = "";
    }
    const se = searchEmp ? `&firstName=${searchEmp}` : "";
    const sd = searchEmpByDept ? `&department=${searchEmpByDept}` : "";

    await fetch(
      `/admin/employee/?${paging}${se}${sd}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then(({ employees, totalCount, message }) => {
        if (message) {
          setMessage(message);
        }
        setEmployees(employees);
        setTotal(totalCount);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [rowsPerPage, page, searchEmp, searchEmpByDept]);
  const AddPro = () => {
    const body = {
      teamName: values.teamName,
      teamLeader: values.teamLeader,
      teamMembers: teamMember,
      projectName: values.projectName,
      description: values.description,
      clientName: values.clientName,
      dateOfAssignment,
      dateOfDeadline,
    };
    return fetch(
      `/admin/team/add-team-project`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    )
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const clickSubmit = (event) => {
    event.preventDefault();
    AddPro().then((data) => {
      if (data?.message) {
        showError(data.message);
      } else {
        showSuccess(
          "Project created successfully,you will we redirected to dashboard"
        );
        setTimeout(function () {
          let path = `/AdminProject`;
          history.push(path);
        }, 3200);
      }
    });
  };
  const showError = (error) => {
    toast.dark(error, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const showSuccess = (success) => {
    toast.info(success, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const useStyles = makeStyles({
    table: {
      minWidth: 600,
    },
  });
  const pagination = () => {
    if (searchEmp == "" && searchEmpByDept == "")
      return (
        <TablePagination
          rowsPerPageOptions={[3, 5, 7]}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      );
  };
  const classes = useStyles();

  return (
    <div className="proform">
      <div className="proform__card">
        <div className="proform__header">
          <h1 className="proform__heading">Project</h1>
        </div>
        <div className="proform__body">
          <form>
            <div className="proform__row">
              <label className="proform__label">
                Project Name<span className="proform__star">*</span>
              </label>
              <input
                className="proform__input"
                type="text"
                autoFocus
                name="projectName"
                onChange={handleChange}
                value={values.projectName}
              />
              <label className="proform__label">
                Client Name<span className="proform__star">*</span>
              </label>
              <input
                className="proform__input"
                type="text"
                name="clientName"
                onChange={handleChange}
                value={values.clientName}
              />
            </div>

            <div className="proform__row">
              <label className="proform__label">
                Description<span className="proform__star">*</span>
              </label>
              <textarea
                name="description"
                onChange={handleChange}
                className="proform__area"
                value={values.description}
              ></textarea>
            </div>
            <div className="proform__row">
              <label className="proform__label">
                Date Of Assignment<span className="proform__star">*</span>
              </label>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container justify="flex-start">
                  <KeyboardDatePicker
                    margin="normal"
                    className="proform__inputDate"
                    id="date-picker-dialog"
                    format="MM/dd/yyyy"
                    required
                    value={dateOfAssignment}
                    onChange={handleDateChangeForDoa}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </Grid>
              </MuiPickersUtilsProvider>
              <label className="proform__label">
                Date Of Deadline<span className="proform__star">*</span>
              </label>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container justify="flex-start">
                  <KeyboardDatePicker
                    margin="normal"
                    className="proform__inputDate"
                    id="date-picker-dialog"
                    format="MM/dd/yyyy"
                    required
                    value={dateOfDeadline}
                    onChange={handleDateChangeForDod}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </Grid>
              </MuiPickersUtilsProvider>
            </div>
            <div className="proform__row"></div>
            <hr className="proform__hr" />
            <div className="proform__header">
              <h1 className="proform__heading">Team</h1>
            </div>
            <div className="proform__row">
              <label className="proform__label">
                Team Name<span className="proform__star">*</span>
              </label>
              <input
                className="proform__input"
                type="text"
                autoFocus
                name="teamName"
                onChange={handleChange}
                value={values.teamName}
              />
            </div>
            <div className="proform__row">
              <label className="proform__label">
                Department Name<span className="proform__star">*</span>
              </label>
              <div class="proform__selectRow">
                <select
                  class="proform__select"
                  value={searchEmpByDept}
                  onChange={(e) => setSearchEmpByDept(e.target.value)}
                >
                  <option value="" selected>
                    Department
                  </option>
                  {departments.map((department) => (
                    <option value={department._id}>
                      {department.deptName}
                    </option>
                  ))}
                </select>
                <div class="proform__searchBox">
                  <div class="proform__searchField">
                    <input
                      type="text"
                      className="proform__searchip"
                      placeholder="Search by Employee's First Name"
                      onChange={(e) => setSearchEmp(e.target.value)}
                      value={searchEmp}
                    />
                    <SearchRoundedIcon className="proform__icon" />
                  </div>
                </div>
              </div>
            </div>
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="customized table">
                <TableHead className="proform__theader">
                  <TableRow>
                    <StyledTableCell align="center">
                      Employee ID
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      Employee Name
                    </StyledTableCell>
                    <StyledTableCell align="center">Department</StyledTableCell>
                    <StyledTableCell align="center">
                      Designation
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      Work Experience
                    </StyledTableCell>
                    <StyledTableCell align="center">Email ID</StyledTableCell>
                    <StyledTableCell align="center">Action</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {message || employees.length === 0 ? (
                    <span>No Employees </span>
                  ) : (
                    employees.map((employee, index) => (
                      <StyledTableRow
                        key={employee._id}
                        className="Employee__formTableRow"
                      >
                        <StyledTableCell align="center">
                          {employee.employeeSerialId}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {`${employee.firstName + " " + employee.lastName}`}{" "}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {employee.department.deptName}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {employee.designation}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {employee.contactNumbers.personal}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {employee.userAuth.email}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {
                            <div className="Employee__formaction">
                              <div>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    var alreadyPresent = teamMember.includes(
                                      employee._id
                                    );
                                    if (alreadyPresent === false) {
                                      setTeamMember([
                                        ...teamMember,
                                        employee._id,
                                      ]);
                                      setTeamList([
                                        ...teamList,
                                        {
                                          employeeName: employee.firstName,
                                          employeeId: employee.employeeSerialId,
                                          _id: employee._id,
                                        },
                                      ]);
                                    }
                                  }}
                                  className="Employee__formactionAdd"
                                >
                                  <AddRoundedIcon />
                                </button>
                              </div>
                              <div>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    const deleteTeamMember = teamMember.filter(
                                      (i) => i !== employee._id
                                    );
                                    setTeamMember(deleteTeamMember);
                                    const deleteTeamList = teamList.filter(
                                      (i) =>
                                        i.employeeId !==
                                        employee.employeeSerialId
                                    );
                                    setTeamList(deleteTeamList);
                                  }}
                                  className="Employee__formactionRem"
                                >
                                  <CloseRoundedIcon />
                                </button>
                              </div>
                            </div>
                          }
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {pagination()}
            <div className="proform__row">
              <label className="proform__label">
                Team Members<span className="proform__star">*</span>
              </label>
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table">
                  <TableHead className="proform__theader">
                    <TableRow>
                      <StyledTableCell align="center">
                        Employee ID
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Employee Name
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {teamList.map((team) => (
                      <StyledTableRow
                        key={team.employeeId}
                        className="proform__trow"
                      >
                        <StyledTableCell
                          align="center"
                          component="th"
                          scope="row"
                        >
                          {team.employeeId}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {team.employeeName}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            <div className="proform__row">
              <label className="proform__label">
                Team Leader<span className="proform__star">*</span>
              </label>
              <div class="proform__selectRow">
                <select
                  onChange={handleChange}
                  value={values.teamLeader}
                  name="teamLeader"
                  class="proform__select"
                  required
                >
                  <option selected>Please Select</option>
                  {teamList.map((team) => (
                    <option value={team._id}>{team.employeeName}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="proform__rowBtn">
              <button className="proform__btn" onClick={clickSubmit}>
                SUBMIT
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
