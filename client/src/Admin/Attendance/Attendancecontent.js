/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
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
import "./Attendancecontent.css";
import { TablePagination } from "@material-ui/core";
import { isAuthenticate } from "../../auth/token";

export default function Attendancecontent() {
  const { token } = isAuthenticate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [newAttendees, setNewAttendees] = useState([{}]);
  const [total, setTotal] = useState(0);
  const [values, setValues] = useState("");
  const [message, setMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState(Date().toLocaleString());

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
  useEffect(async () => {
    const st = values ? `&status=${values}` : "";
    let paging = "";

    if (values === "") {
      paging = `&limit=${rowsPerPage}&page=${page + 1}`;
    } else {
      paging = "";
    }

    await fetch(
      `/admin/attendance/?workingDate=${new Date(
        selectedDate
      ).toISOString()}${st}${paging}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then(({ message, newAttendees, totalCount }) => {
        if (message) {
          setMessage(message);
          setTotal(0);
        } else {
          setNewAttendees(newAttendees);
          setTotal(totalCount);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [rowsPerPage, page, selectedDate, values]);

  const useStyles = makeStyles({
    table: {
      minWidth: 600,
    },
  });
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const classes = useStyles();

  const pagination = () => {
    if (values === "") {
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
    <div className="attendance">
      <div className="attendance__crd">
        <div className="attendance__row">
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justify="flex-start">
              <KeyboardDatePicker
                margin="normal"
                className="attendance__ip"
                id="date-picker-dialog"
                format="yyyy/MM/dd"
                required
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </Grid>
          </MuiPickersUtilsProvider>
          <div class="attendance__sltRow">
            <select
              value={values}
              onChange={(e) => setValues(e.target.value)}
              class="attendance__slt"
              required
              name="values"
            >
              <option value="" selected>
                All
              </option>
              <option value="Absent">Absent</option>
              <option value="Present">Present</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>
        </div>

        <div className="attendance__table">
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
              <TableHead className="attendance__theader">
                <TableRow>
                  <StyledTableCell align="center">
                    Employee Name
                  </StyledTableCell>
                  <StyledTableCell align="center">Status</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {message || newAttendees.length === 0 ? (
                  <span>no employees</span>
                ) : (
                  newAttendees.map((row) => (
                    <StyledTableRow className="attendance__trow">
                      <StyledTableCell
                        align="center"
                        component="th"
                        scope="row"
                      >
                        {row.firstName} {row.lastName}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {row.status}
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
    </div>
  );
}
