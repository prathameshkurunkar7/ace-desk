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
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import VisibilityRoundedIcon from "@material-ui/icons/VisibilityRounded";
import { TablePagination } from "@material-ui/core";
import SearchRoundedIcon from "@material-ui/icons/SearchRounded";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "./Policiescontent.css";
import { savePolId } from "../../features/editpol";
import { isAuthenticate } from "../../auth/token";

function Policiescontent() {
  const [page, setPage] = React.useState(0);
  const [policyName, setPolicyName] = useState("");
  const [deptName, setDeptName] = useState("");
  const [departments, setDepartments] = React.useState([]);
  const [message, setMessage] = useState("");
  const [rowsPerPage, setRowsPerPage] = React.useState(3);
  const [Policies, setPolicies] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const dispatch = useDispatch();
  const history = useHistory();
  const { token } = isAuthenticate();

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
    if (deptName === "" && policyName === "") {
      paging = `limit=${rowsPerPage}&page=${page + 1}`;
    } else {
      paging = "";
    }
    const pn = policyName ? `&policyName=${policyName}` : "";
    const dn = deptName ? `&department=${deptName}` : "";

    await fetch(
      `/admin/policy/?${paging}${pn}${dn}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then(({ policies, totalCount, message }) => {
        if (message) {
          setMessage(message);
          setTotal(0);
        } else {
          setPolicies(policies);
          setTotal(totalCount);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [rowsPerPage, page, policyName, deptName]);
  const deletePolicy = async (policyId) => {
    const res = await fetch(
      `/admin/policy/delete/${policyId}`,
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
        showSuccess("policy succesfully deleted");
      })
      .catch((error) => {
        console.log(error);
      });
    const Newpolicies = Policies.filter((i) => i._id !== policyId);
    setPolicies(Newpolicies);
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
  const editPolicy = (id) => {
    dispatch(savePolId(id));
    let path = `/editPolicy`;
    history.push(path);
  };
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
          <div className="policies__selectRow">
            <select
              onChange={(e) => setDeptName(e.target.value)}
              value={deptName}
              name="department"
              class="policies__selectF"
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
                  className="policies__searchipt"
                />
                <SearchRoundedIcon className="policies__icon" />
              </div>
            </div>
          </div>
          <div className="policies__btn">
            <NavLink to="/addPolicy">
              <button className="policies__addPolicy">Add Policy</button>
            </NavLink>
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
                          <div>
                            <button
                              onClick={() => editPolicy(policy._id)}
                              className="policies__edit"
                            >
                              <EditRoundedIcon />
                            </button>
                          </div>
                          <div>
                            <button
                              onClick={() => deletePolicy(policy._id)}
                              className="policies__del"
                            >
                              <DeleteRoundedIcon />
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
      <ToastContainer />
    </div>
  );
}

export default Policiescontent;
