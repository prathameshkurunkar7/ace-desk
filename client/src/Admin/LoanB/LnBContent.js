import React, { useEffect, useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { NavLink } from "react-router-dom";
import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import "./LnBContent.css";
import { toast, ToastContainer } from "react-toastify";
import { isAuthenticate } from "../../auth/token";

export default function LnBContent() {
  const { token } = isAuthenticate();

  const [page, setPage] = React.useState(0);
  const [value, setValue] = useState("Pending");
  const [payrolls, setPayrolls] = useState([]);
  const [total, setTotal] = useState(0);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
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
    await fetch(
      `/admin/payroll/get-loan-bonus/?${status}.status=${value}&fields=empId,${status}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then(({ payrolls, totalCount, message }) => {
        if (message) {
          setMessage(message);
          setTotal(0);
        } else {
          setPayrolls(payrolls);
          setTotal(totalCount);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [status, value]);
  const classes = useStyles();
  const RejectEmployee = (id, amount, desc) => {
    let body = {
      paymentRequest: "",
      amount: amount,
      description: desc,
      status: "Rejected",
    };
    if (status === "loan") {
      body.paymentRequest = "Loan";
    } else {
      body.paymentRequest = "Bonus";
    }
    return fetch(
      `/admin/payroll/sanction-loan-bonus/${id}`,
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
        showSuccess("employee bonus Accepted");
        const Newpayroll = payrolls.filter((i) => i.empId._id !== id);
        setPayrolls(Newpayroll);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const AcceptedEmployee = (id, amount, desc) => {
    let body = {
      paymentRequest: "",
      amount: amount,
      description: desc,
      status: "Accepted",
    };
    if (status === "loan") {
      body.paymentRequest = "Loan";
    } else {
      body.paymentRequest = "Bonus";
    }
    return fetch(
      `/admin/payroll/sanction-loan-bonus/${id}`,
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
        showSuccess("employee bonus Accepted");
        const Newpayroll = payrolls.filter((i) => i.empId._id !== id);
        setPayrolls(Newpayroll);
      })
      .catch((error) => {
        console.log(error);
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
  return (
    <div className="adminlb">
      <div className="adminlb__card">
        <div className="adminlb__row">
          <div class="adminlb__selectRow">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              class="adminlb__select"
              required
            >
              <option selected value="loan">
                Loans
              </option>
              <option value="bonus">Bonus</option>
            </select>
          </div>
          <div class="adminlb__selectRow1">
            <select
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
              class="adminlb__select"
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
        <div>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
              <TableHead className="adminlb__theader">
                <TableRow>
                  <StyledTableCell align="center">
                    Employee Name
                  </StyledTableCell>
                  <StyledTableCell align="center">Amount</StyledTableCell>
                  <StyledTableCell align="center">
                    Loan or Bonus
                  </StyledTableCell>
                  <StyledTableCell align="center">Reason</StyledTableCell>
                  <StyledTableCell align="center">Action</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {message || payrolls.length === 0 ? (
                  <span>no employees</span>
                ) : (
                  payrolls.map((row, index) => (
                    <StyledTableRow key={row._id} className="adminlb__trow">
                      <StyledTableCell align="center">
                        {row.empId.firstName} {row.empId.lastName}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row[`${status}`].amount}
                      </StyledTableCell>
                      <StyledTableCell align="center">{status}</StyledTableCell>
                      <StyledTableCell align="center">
                        {row[`${status}`].description}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {value === "Pending" ? (
                          <div className="adminlb__action">
                            <div>
                              <button
                                onClick={() => {
                                  AcceptedEmployee(
                                    row.empId._id,
                                    row[`${status}`].amount,
                                    row[`${status}`].description
                                  );
                                }}
                                className="adminlb__add"
                              >
                                <CheckRoundedIcon />
                              </button>
                            </div>
                            <div>
                              <button
                                onClick={() => {
                                  RejectEmployee(
                                    row.empId._id,
                                    row[`${status}`].amount,
                                    row[`${status}`].description
                                  );
                                }}
                                className="adminlb__rem"
                              >
                                <CloseRoundedIcon />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <span>Not Applicable</span>
                        )}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
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
