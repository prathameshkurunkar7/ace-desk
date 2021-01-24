import React, { useState, useEffect } from "react";
import "./Departmentcontent.css";
import SearchRoundedIcon from "@material-ui/icons/SearchRounded";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import { TablePagination } from "@material-ui/core";
import { isAuthenticate } from "../../auth/token";
// import AddRoundedIcon from "@material-ui/icons/AddRounded";

function Departmentcontent() {
  const [deptName, setDeptName] = useState("");
  const [page, setPage] = React.useState(0);
  const [message, setMessage] = useState("");
  const [rowsPerPage, setRowsPerPage] = React.useState(3);
  const [departments, setDepartments] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const [searchdept, setSearchDept] = useState("");
  const { token } = isAuthenticate();

  useEffect(async () => {
    const s = searchdept ? `&deptName=${searchdept}` : "";
    await fetch(
      `/admin/department/?limit=${rowsPerPage}&page=${page + 1}${s}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then(({ departments, totalCount, message }) => {
        if (message) {
          setMessage(message);
          setTotal(0);
        } else {
          setDepartments(departments);
          setTotal(totalCount);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [rowsPerPage, page, deptName, searchdept]);
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
  const classes = useStyles();
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const AddDpt = (user) => {
    return fetch(
      `/admin/department/create`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
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
    AddDpt({ deptName }).then((data) => {
      if (data?.message) {
        showError(data.message);
      } else {
        setDeptName("");
        showSuccess("department added succesfully");
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

  const pagination = () => {
    if (searchdept === "")
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
  return (
    <div className="dept">
      <div className="dept__card">
        <div className="dept__header">
          <h1 className="dept__heading">Add Department</h1>
        </div>
        <div className="dept__body">
          <form>
            <div className="dept__row">
              <input
                className="dept__input"
                onChange={(e) => setDeptName(e.target.value)}
                type="text"
                required
                autoFocus
                placeholder="Enter Department Name"
                value={deptName}
              />
              <button onClick={clickSubmit} className="dept__btn">
                Add
              </button>
            </div>
          </form>
          <br />
          <hr className="hrline" />
        </div>
        <br />
        <div className="dept__body">
          <div className="dept__row">
            <div class="dept__selectRow">
              <div class="dept__searchBox">
                <div class="dept__searchField">
                  <input
                    type="text"
                    className="dept__searchip"
                    placeholder="Search By Department"
                    onChange={(e) => setSearchDept(e.target.value)}
                    value={searchdept}
                  />
                  <SearchRoundedIcon className="dept__icon" />
                </div>
              </div>
            </div>
          </div>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
              <TableHead className="deptable__header">
                <StyledTableRow>
                  <StyledTableCell align="center">
                    Department Name
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    Total Employee
                  </StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {message || departments.length === 0 ? (
                  <span>no departments</span>
                ) : (
                  departments.map((department) => (
                    <StyledTableRow
                      key={department._id}
                      className="deptable__row"
                    >
                      <StyledTableCell
                        align="center"
                        component="th"
                        scope="row"
                      >
                        {department.deptName}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {department.employeesCount}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {pagination()}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Departmentcontent;
