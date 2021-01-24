import React, { useState, useEffect } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import "date-fns";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import AddRoundedIcon from "@material-ui/icons/AddRounded";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import "./LeavesContent.css";
import { TablePagination } from "@material-ui/core";
import { toast, ToastContainer } from "react-toastify";
import { isAuthenticate } from "../../auth/token";

export default function LeaveContent() {
  const { token } = isAuthenticate();

  const [Leaves, setAppliedLeaves] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const [value, setValue] = useState("Pending");

  const [selectedDate, setSelectedDate] = React.useState(
    Date().toLocaleString()
  );

  const handleDateChange = (date) => {
    setSelectedDate(date);
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

  const useStyles = makeStyles({
    table: {
      minWidth: 600,
    },
  });
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
  const showError = (result) => {
    toast.dark(result, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  useEffect(async () => {
    await fetch(
      `/admin/leaves/?appliedLeaves.status=${value}&fields=appliedLeaves,empId`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then(({ leaves }) => {
        console.log(leaves);
        setAppliedLeaves(leaves);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [value]);
  const RejectEmployee = (appliedLeaveId, leaveId) => {
    const body = {
      appliedLeaveId,
      leaveId,
      action: "Rejected",
    };
    return fetch(`/admin/leaves/action`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",

        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        showSuccess("employee leave Rejected");
        const Newleaves = Leaves.filter((i) => i._id !== appliedLeaveId);
        setAppliedLeaves(Newleaves);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const AcceptedEmployee = (appliedLeaveId, leaveId) => {
    const body = {
      appliedLeaveId,
      leaveId,
      action: "Accepted",
    };
    return fetch(`/admin/leaves/action`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",

        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        showSuccess("employee leave Accepted");
        const Newleaves = Leaves.filter((i) => i._id !== appliedLeaveId);
        setAppliedLeaves(Newleaves);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const classes = useStyles();
  return (
    <div className="Leaves">
      <div className="Leaves__card">
        <div className="Leaves__row">
          <div class="Leaves__selectRow">
            <select
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
              class="Leaves__select"
              required
            >
              <option value="Pending" selected>
                Pending
              </option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="Leaves__table">
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
              <TableHead className="Leaves__theader">
                <TableRow>
                  <StyledTableCell align="center">
                    Employee Name
                  </StyledTableCell>
                  <StyledTableCell align="center">Date</StyledTableCell>
                  <StyledTableCell align="center">Description</StyledTableCell>
                  <StyledTableCell align="center">Status</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Leaves.length !== 0 ? (
                  Leaves.map((leave) => [
                    <StyledTableRow className="Leaves__trow">
                      <StyledTableCell
                        align="center"
                        component="th"
                        scope="row"
                      >
                        {leave.firstName} {leave.lastName}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {leave.leaveFrom.substring(0, 10)} to{" "}
                        {leave.leaveTo.substring(0, 10)}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {leave.leaveDescription}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {leave.status}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        {value === "Pending" ? (
                          <div className="Leaves__formaction">
                            <div>
                              <button
                                onClick={() => {
                                  AcceptedEmployee(leave._id, leave.leaveId);
                                }}
                                className="Leaves__formactionAdd"
                              >
                                <AddRoundedIcon />
                              </button>
                            </div>
                            <div>
                              <button
                                onClick={() => {
                                  RejectEmployee(leave._id, leave.leaveId);
                                }}
                                className="Leaves__formactionRem"
                              >
                                <CloseRoundedIcon />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <span>Not Applicable</span>
                        )}
                      </StyledTableCell>
                    </StyledTableRow>,
                  ])
                ) : (
                  <span>no data to show</span>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
