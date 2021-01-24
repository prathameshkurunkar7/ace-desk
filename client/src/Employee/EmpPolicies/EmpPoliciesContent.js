import React, { useEffect, useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import VisibilityRoundedIcon from "@material-ui/icons/VisibilityRounded";
import { TablePagination } from "@material-ui/core";
import SearchRoundedIcon from "@material-ui/icons/SearchRounded";
import "./EmpPoliciesContent.css";
import { isAuthenticate } from "../../auth/token";

function EmpPoliciesContent() {
  const { token } = isAuthenticate();
  const [page, setPage] = useState(0);
  const [policyName, setPolicyName] = useState("");
  const [deptName, setDeptName] = useState("");
  const [departments, setDepartments] = useState([]);
  const [message, setMessage] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [Policies, setPolicies] = useState([]);
  const [total, setTotal] = useState(0);

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

  function createData(pname, desc, dept, actionB) {
    return { pname, desc, dept, actionB };
  }

  const rows = [
    createData(
      "Permission Policy",
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
      "IT"
    ),
  ];

  const useStyles = makeStyles({
    table: {
      minWidth: 600,
    },
  });

  const classes = useStyles();
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
    if (deptName === "" && policyName === "" && message === "") {
      paging = `limit=${rowsPerPage}&page=${page + 1}`;
    } else {
      paging = "";
    }
    const pn = policyName ? `&policyName=${policyName}` : "";
    const dn = deptName ? `&department=${deptName}` : "";

    await fetch(
      `/admin/policy/?${paging}${pn}${dn}`
    )
      .then((response) => response.json())
      .then(({ policies, totalCount, message }) => {
        if (message) {
          setTotal(0);
          setMessage(message);
        } else {
          setPolicies(policies);
          setTotal(totalCount);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [rowsPerPage, page, policyName, deptName]);

  const pagination = () => {
    if (deptName === "" && policyName === "") {
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
    <div className="policies">
      <div className="policies__card">
        <div className="policies__row">
          <div className="policies__selecteRow">
            <select
              onChange={(e) => setDeptName(e.target.value)}
              value={deptName}
              name="department"
              class="policies__select"
              required
            >
              <option value="" selected>
                Please Select Department
              </option>
              {departments.map((department) => (
                <option value={department._id}>{department.deptName}</option>
              ))}
            </select>

            <div class="policies__searchBox">
              <div class="policies__searchField">
                <input
                  value={policyName}
                  onChange={(e) => setPolicyName(e.target.value)}
                  placeholder="Search by Policy name"
                  className="policies__searchip"
                />
                <SearchRoundedIcon className="policies__icon" />
              </div>
            </div>
          </div>
        </div>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="customized table">
            <TableHead className="policies__theader">
              <TableRow>
                <StyledTableCell align="center">Policy Name</StyledTableCell>
                <StyledTableCell align="center">Description</StyledTableCell>
                <StyledTableCell align="center">Department</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {message || Policies.length === 0 ? (
                <span>no policies</span>
              ) : (
                Policies.map((policy) => (
                  <StyledTableRow key={policy._id} className="policies__trow">
                    <StyledTableCell align="center">
                      {policy.policyName}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {policy.description}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {policy.department["deptName"]}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {
                        <div className="policies__action">
                          <div>
                            <button
                              onClick={() => window.open(policy.policyFile)}
                              className="policies__view"
                            >
                              <VisibilityRoundedIcon />
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
      </div>
    </div>
  );
}

export default EmpPoliciesContent;
