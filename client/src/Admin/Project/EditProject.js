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
import { NavLink } from "react-router-dom";
import AddRoundedIcon from "@material-ui/icons/AddRounded";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import "./Proform.css";
import { TablePagination } from "@material-ui/core";
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { savedProId } from "../../features/editpro";
import { useHistory } from "react-router-dom";
import { isAuthenticate } from "../../auth/token";

export default function EditProject() {
  const [values, setvalues] = useState({
    teamName: "",
    teamLeader: "",
    projectName: "",
    description: "",
    clientName: "",
  });
  const [departments, setDepartments] = useState([]);

  const [proId, setProId] = useState("");
  const [teamMember, setTeamMember] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(3);
  const [employees, setEmployees] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const [searchEmp, setSearchEmp] = useState("");
  const [searchEmpByDept, setSearchEmpByDept] = useState("");
  const _id = useSelector(savedProId);
  const [message, setMessage] = useState("");
  const { token } = isAuthenticate();

  const [dateOfAssignment, setSelectedDateForDoa] = useState(
    Date().toLocaleString()
  );

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
  const history = useHistory();

  useEffect(async () => {
    await fetch(`/admin/department/`,{headers: {
      Authorization: `Bearer ${token}`,
    }})
      .then((response) => response.json())
      .then(({ departments }) => {
        setDepartments(departments);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  useEffect(async () => {
    await fetch(
      `/admin/projects/?_id=${_id}`,{headers: {
        Authorization: `Bearer ${token}`,
      }}
    )
      .then((response) => response.json())
      .then(({ projects }) => {
        setProId(projects[0].project._id);
        setvalues({
          teamName: projects[0].teamName,
          teamLeader: projects[0].teamLeader,
          projectName: projects[0].project.projectName,
          description: projects[0].project.description,
          clientName: projects[0].project.clientName,
        });
        setTeamMember(projects[0].teamMembers);
        setSelectedDateForDoa(projects[0].project.dateOfAssignment);
        setSelectedDateForDod(projects[0].project.dateOfDeadline);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
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
      `/admin/employee/?${paging}${se}${sd}`,{headers: {
        Authorization: `Bearer ${token}`,
      }}
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
  const UpdateTeam = () => {
    const body = {
      teamName: values.teamName,
      teamLeader: values.teamLeader,
    };
    return fetch(
      `/admin/team/update-team/${_id}`,
      {
        method: "PATCH",
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
  const clickSubmitTeam = (event) => {
    event.preventDefault();
    UpdateTeam().then((data) => {
      if (data?.message) {
        showError(data.message);
      } else {
        showSuccess(
          "team updated successfully ,you will we redirected to dashboard"
        );
        setTimeout(function () {
          let path = `/AdminProject`;
          history.push(path);
        }, 3200);
      }
    });
  };
  const updatePro = () => {
    const body = {
      projectName: values.projectName,
      description: values.description,
      clientName: values.clientName,
      dateOfAssignment,
      dateOfDeadline,
    };
    return fetch(
      `/admin/team/update-project/${proId}`,
      {
        method: "PATCH",
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
  const clickSubmitProject = (event) => {
    event.preventDefault();
    updatePro().then((data) => {
      if (data?.message) {
        showError(data.message);
      } else {
        showSuccess("project updated successfully");
      }
    });
  };

  const useStyles = makeStyles({
    table: {
      minWidth: 600,
    },
  });
  const pagination = () => {
    if (searchEmp == "" && searchEmpByDept == "" && message == "")
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
  const AddTeamMember = (memberId) => {
    const body = {
      memberId,
      teamId: _id,
    };
    return fetch(
      `/admin/team/add-team-member`,
      {
        method: "PATCH",
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
      .then((response) => {
        if (response.message) {
          showError(response.message);
        } else {
          setTeamMember([...teamMember, response.teamMembers[0]]);
          showSuccess("member added successfully");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const DeleteTeamMember = (memberId) => {
    const body = {
      memberId,
      teamId: _id,
    };
    return fetch(
      `/admin/team/remove-team-member`,
      {
        method: "DELETE",
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
      .then((response) => {
        if (response.message) {
          showError(response.message);
        } else {
          var alreadyPresent = teamMember.filter(
            (member) => member._id !== memberId
          );
          setTeamMember(alreadyPresent);
          showSuccess("member deleted successfully");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const showError = (error) => {
    toast.dark(error, {
      position: "top-right",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const showSuccess = (success) => {
    toast.info(success, {
      position: "top-left",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  return (
    <div className="proform">
      <div className="proform__card">
        <div className="proform__header">
          <h1>Project</h1>
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
            <div className="proform__row"></div>
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
                Date of Assignment<span className="proform__star">*</span>
              </label>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container justify="space-around">
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
                Date of Deadline<span className="proform__star">*</span>
              </label>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container justify="space-around">
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

            <div className="proform__rowBtn">
              <button className="proform__btn" onClick={clickSubmitProject}>
                Update Project
              </button>
            </div>
            <hr className="proform__hr" />
            <div className="proform__header">
              <h1>Team</h1>
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
                      placeholder="Search by employee's first name"
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
                    <span>no employees </span>
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
                          {employee.department.deptName}{" "}
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
                                    AddTeamMember(employee._id);
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
                                    DeleteTeamMember(employee._id);
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
                Team Members<span className="proform__star"> *</span>
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
                    {teamMember.map((team) => (
                      <StyledTableRow key={team._id} className="proform__trow">
                        <StyledTableCell
                          align="center"
                          component="th"
                          scope="row"
                        >
                          {team._id}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {team.firstName} {team.lastName}
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
                  <option selected>{values.teamLeader["firstName"]}</option>
                  {teamMember.map((team) => (
                    <option value={team._id}>
                      {team.firstName} {team.lastName}
                    </option>
                  ))}

                  {/* <option value="Finance">Accounting And Finance</option>
                  <option value="Finance">Human Resource And Management</option> */}
                </select>
              </div>
            </div>
            <div className="proform__rowBtn">
              <button className="proform__btn" onClick={clickSubmitTeam}>
                Update Team
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
