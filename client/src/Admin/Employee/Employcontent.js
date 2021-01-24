import React, { useEffect, useState } from "react";
import "./Employcontent.css";
import { useHistory } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import SearchRoundedIcon from "@material-ui/icons/SearchRounded";
import { makeStyles, TablePagination } from "@material-ui/core";
import AddRoundedIcon from "@material-ui/icons/AddRounded";
import { saveEmpId } from "../../features/editemp";
import { toast, ToastContainer } from "react-toastify";
import { isAuthenticate } from "../../auth/token";

function Employcontent() {
  const [page, setPage] = React.useState(0);
  const { token } = isAuthenticate();

  const [rowsPerPage, setRowsPerPage] = React.useState(3);
  const [employees, setEmployees] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const dispatch = useDispatch();
  const [departments, setDepartments] = React.useState([]);
  const [deptName, setDeptName] = useState("");
  const [message, setMessage] = useState("");
  const [empName, setEmpName] = useState("");
  const history = useHistory();
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
  const useStyles = makeStyles({
    table: {
      minWidth: 600,
    },
  });

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
  useEffect(async () => {
    let paging = "";
    if (deptName == "" && empName == "") {
      paging = `limit=${rowsPerPage}&page=${page + 1}`;
    } else {
      paging = "";
    }
    const dn = deptName ? `&department=${deptName}` : "";
    const ep = empName ? `&firstName=${empName}` : "";
    await fetch(
      `/admin/employee/?${paging}${dn}${ep}`,
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
          setTotal(0);
        } else {
          setEmployees(employees);
          setTotal(totalCount);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [rowsPerPage, page, deptName, empName]);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const classes = useStyles();
  const deleteEmployee = async (id) => {
    const res = await fetch(
      `/admin/employee/delete/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },
      }
    );
    res
      .json()
      .then((result) => {
        showSuccess(result.message);
      })
      .catch((error) => {
        console.log(error);
      });
    const Newemployees = employees.filter((i) => i._id !== id);
    setEmployees(Newemployees);
  };
  const showSuccess = (result) => {
    toast.info(result, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const editEmployee = (id) => {
    dispatch(saveEmpId(id));
    let path = `/editEmployee`;
    history.push(path);
  };
  const pagination = () => {
    if (deptName === "" && empName === "") {
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
    }
  };
  return (
    <div className="Employee">
      <div className="Employee__card">
        <div className="Employee__row">
          <div className="Employee__selectRow">
            <select
              onChange={(e) => setDeptName(e.target.value)}
              value={deptName}
              name="department"
              class="Employee__select"
              required
            >
              <option value="" selected>
                Please Select Department
              </option>
              {departments.map((department) => (
                <option value={department._id}>{department.deptName}</option>
              ))}
            </select>
            <div class="Employee__searchBox">
              <div class="Employee__searchField">
                <input
                  placeholder="Search By Employee Name"
                  className="Employee__searchip"
                  value={empName}
                  onChange={(e) => setEmpName(e.target.value)}
                />
                <SearchRoundedIcon className="Employee__icon" />
              </div>
            </div>
          </div>
          <div className="Employee__btn">
            <NavLink to="/addEmployee">
              <button className="Employee__addE">Add Employee</button>
            </NavLink>
          </div>
        </div>

        {/* <div className="Employee__table"> */}
        <TableContainer component={Paper}>
          <Table className={classes.table}>
            <TableHead className="Employee__tableHeader">
              <TableRow className="tr">
                <StyledTableCell align="center">ID</StyledTableCell>
                <StyledTableCell align="center">Employee Name</StyledTableCell>
                <StyledTableCell align="center">Department</StyledTableCell>
                <StyledTableCell align="center">Designation</StyledTableCell>
                <StyledTableCell align="center">Contact Number</StyledTableCell>
                <StyledTableCell align="center">Email ID</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {message || employees.length === 0 ? (
                <span>no employees</span>
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
                      {`${employee.firstName + " " + employee.lastName}`}
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
                              onClick={() => editEmployee(employee._id)}
                              className="Employee__formactionAdd"
                            >
                              <AddRoundedIcon />
                            </button>
                          </div>
                          <div>
                            <button
                              onClick={() => deleteEmployee(employee._id)}
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
        {/* </div> */}
      </div>
      <ToastContainer />
    </div>
  );
}

export default Employcontent;
