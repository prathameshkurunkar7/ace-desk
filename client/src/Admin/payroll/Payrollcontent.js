import React, { useEffect, useState } from "react";
import "./Payrollcontent.css";
import { NavLink } from "react-router-dom";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import SearchIcon from "@material-ui/icons/Search";
import { TablePagination } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { savePayrollId } from "../../features/generatepayroll";
import { useHistory } from "react-router-dom";
import SearchRoundedIcon from "@material-ui/icons/SearchRounded";
import { isAuthenticate } from "../../auth/token";

function Payrollcontent() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [payrolls, setPayrolls] = useState([]);
  const [total, setTotal] = useState(0);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const [departments, setDepartments] = React.useState([]);
  const [deptName, setDeptName] = useState("");
  const [empName, setEmpName] = useState("");
  const history = useHistory();
  const { token } = isAuthenticate();

  const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
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
    if (deptName === "" && empName === "") {
      paging = `limit=${rowsPerPage}&page=${page + 1}`;
    } else {
      paging = "";
    }
    const dn = deptName ? `&department=${deptName}` : "";
    const ep = empName ? `&firstName=${empName}` : "";
    await fetch(
      `/admin/payroll/?${paging}${dn}${ep}`,
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
  }, [rowsPerPage, page, empName, deptName]);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
  const generatePayslip = (id) => {
    dispatch(savePayrollId(id));
    let path = `/payslip`;
    history.push(path);
  };
  return (
    <div className="payroll">
      <div className="payroll__firstDiv">
        <div className="payroll__selectRow">
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

          <div class="payroll__searchBox">
            <div class="payroll__searchField">
              <input
                placeholder="Search By Employee Name"
                className="payroll__searchip"
                value={empName}
                onChange={(e) => setEmpName(e.target.value)}
              />
              <SearchRoundedIcon className="payroll__icon" />
            </div>
          </div>
        </div>
        <div>
          <br /> <br />
          <TableContainer component={Paper}>
            <Table className="customized__payrollTable">
              <TableHead className="payroll__thead">
                <TableRow>
                  <StyledTableCell align="center">Employee Id</StyledTableCell>
                  <StyledTableCell align="center">
                    Employee Name
                  </StyledTableCell>
                  <StyledTableCell align="center">Department</StyledTableCell>
                  <StyledTableCell align="center">Designation</StyledTableCell>
                  <StyledTableCell align="center">
                    Annual salary
                  </StyledTableCell>
                  <StyledTableCell align="center">Payslip</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {message || payrolls.length === 0 ? (
                  <span>no employees</span>
                ) : (
                  payrolls.map((payroll) => (
                    <StyledTableRow key={payroll._id} className="payroll__trow">
                      <StyledTableCell align="center">
                        {payroll.employeeSerialId}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {payroll.firstName} {payroll.lastName}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {payroll.department.deptName
                          ? payroll.department.deptName
                          : ""}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {payroll.designation}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {payroll.payroll.salaryPerAnnum}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <div className="payroll__btnDiv">
                          <button
                            className="payroll__Btn"
                            onClick={() => generatePayslip(payroll._id)}
                          >
                            Generate payslip
                          </button>
                        </div>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        {pagination()}
      </div>
    </div>
  );
}

export default Payrollcontent;
