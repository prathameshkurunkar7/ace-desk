import React, { useEffect, useState } from "react";
import "./Payslip.css";
import "date-fns";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { TableBody } from "@material-ui/core";
import { savedPayrollId } from "../../features/generatepayroll";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { isAuthenticate } from "../../auth/token";

export default function Payslip() {
  const { token } = isAuthenticate();

  const [values, setValues] = useState({
    phone: 0,
    conveyance: 0,
    medical: 0,
    performance: 0,
  });
  const _id = useSelector(savedPayrollId);
  const [payslipInfo, setPayslipInfo] = useState({
    allowanceLimit: "",
    basicSalary: "",
    allowancesdearness: "",
    allowanceshouseRent: "",
    deductionsepf: "",
    deductionsesi: "",
    deductionsprofessional: "",
    deductionstds: "",
    empIdfirstName: "",
    empIdlastName: "",
    empId_id: "",
    grossSalary: "",
    netSalary: "",
    salaryPerMonth: "",
    totalDeductions: "",
    payroll_id: "",
    bonus: "",
    loan: "",
    firstName: "",
    lastName: "",
    empSerialId: "",
    designation: "",
  });
  const [selectedDate, setSelectedDate] = React.useState(
    Date().toLocaleString()
  );

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  useEffect(async () => {
    const body = {
      empId: _id,
    };
    await fetch(
      `/admin/payroll/payslip/create/`,
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
      .then((response) => response.json())
      .then(({ payroll }) => {
        console.log(payroll);
        setPayslipInfo({
          ...payslipInfo,
          allowanceLimit: payroll.allowanceLimit,
          basicSalary: payroll.basicSalary,
          allowancesdearness: payroll.allowances.dearness,
          allowanceshouseRent: payroll.allowances.houseRent,
          deductionsepf: payroll.deductions.epf,
          deductionsesi: payroll.deductions.esi,
          deductionsprofessional: payroll.deductions.professional,
          deductionstds: payroll.deductions.tds,
          empIdfirstName: payroll.empId.firstName,
          empIdlastName: payroll.empId.lastName,
          empId_id: payroll.empId._id,
          grossSalary: payroll.grossSalary,
          netSalary: payroll.netSalary,
          salaryPerMonth: payroll.salaryPerMonth,
          totalDeductions: payroll.totalDeductions,
          payroll_id: payroll._id,
          bonus: payroll.bonus,
          loan: payroll.loan,
          firstName: payroll.empId.firstName,
          lastName: payroll.empId.lastName,
          empSerialId: payroll.empId.employeeSerialId,
          designation: payroll.empId.designation,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const addallowances = (e) => {
    e.preventDefault();
    const body = {
      phone: values.phone,
      conveyance: values.conveyance,
      medical: values.medical,
      performance: values.performance,
    };
    return fetch(
      `/admin/payroll/payslip/save-changes/${payslipInfo.payroll_id}`,
      {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.message) {
          showError(data.message);
        } else {
          showSuccess("allowances added succesfully");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const generatepdf = (e) => {
    e.preventDefault();
    return fetch(
      `/admin/payroll/payslip/generate-pdf/${payslipInfo.payroll_id}`
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.message) {
          showError(data.message);
        } else {
          showSuccess("pdf generated successfully");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const sendEmail = (e) => {
    e.preventDefault();
    return fetch(
      `/admin/payroll/payslip/send-mail/${payslipInfo.payroll_id}`
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.message) {
          showError(data.message);
        } else {
          showSuccess("mail sent successfully");
        }
      })
      .catch((error) => {
        console.log(error);
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
  return (
    <div className="payslip__card">
      <div className="payslip__header">
        <p>XYZ pvt. ltd. 221-B Baker Street, Marylebone, London. </p>
        <h1>Payslip for the month of </h1>
        <hr className="proform__hr" />
      </div>

      <div className="payslip__body">
        <form>
          <div className="top__row">
            <div>
              <div className="payslip__details">
                <h4>Salary month:</h4>
              </div>
            </div>
            <div className="payslip__data">
              <h4>
                {payslipInfo.firstName} {payslipInfo.lastName}
              </h4>
              <p>
                {payslipInfo.designation} <br /> {payslipInfo.empSerialId}
              </p>
            </div>
          </div>
          <table className="payslip__table">
            <tr>
              <th className="payslip__tableHead">Earnings</th>
              <th className="payslip__tableHead">Deductions</th>
            </tr>

            <tr className="payslip__tableRow">
              <td className="payslip__tableTd">
                Basic salary &nbsp; :&nbsp;&nbsp;&nbsp; &#8377;
                {payslipInfo.basicSalary}
              </td>
              <td className="payslip__tableTd">
                TDS &nbsp; :&nbsp;&nbsp; &#8377;
                {payslipInfo.deductionstds}
              </td>
            </tr>
            <tr className="payslip__tableRow">
              <td className="payslip__tableTd">
                House Rent &nbsp; :&nbsp;&nbsp;&nbsp; &#8377;
                {payslipInfo.allowanceshouseRent}
              </td>
              <td className="payslip__tableTd">
                EPF &nbsp; :&nbsp;&nbsp; &#8377; {payslipInfo.deductionsepf}
              </td>
            </tr>

            <tr className="payslip__tableRow">
              <td className="payslip__tableTd">
                Dearness &nbsp; :&nbsp;&nbsp;&nbsp; &#8377;
                {payslipInfo.allowancesdearness}
              </td>
              <td className="payslip__tableTd">
                Professional &nbsp; :&nbsp;&nbsp; &#8377;
                {payslipInfo.deductionsprofessional}
              </td>
            </tr>

            <tr className="payslip__tableRow">
              <td className="payslip__tableTd">
                Phone &nbsp; :&nbsp;&nbsp;&nbsp;
                <input
                  className="payslip__input"
                  onChange={(e) => {
                    setValues({ ...values, phone: e.target.value });
                  }}
                  type="number"
                />
              </td>
              <td className="payslip__tableTd">
                ESI &nbsp; :&nbsp;&nbsp; &#8377; {payslipInfo.deductionsesi}
              </td>
            </tr>

            <tr className="payslip__tableRow">
              <td className="payslip__tableTd">
                Conveyance &nbsp; :&nbsp;&nbsp;&nbsp;
                <input
                  onChange={(e) => {
                    setValues({ ...values, conveyance: e.target.value });
                  }}
                  className="payslip__input"
                  type="number"
                />
              </td>
              <td className="payslip__tableTd">
                Bonus &nbsp; :&nbsp;&nbsp; &#8377; {payslipInfo.bonus}
              </td>
            </tr>

            <tr className="payslip__tableRow">
              <td className="payslip__tableTd">
                Medical &nbsp; :&nbsp;&nbsp;&nbsp;
                <input
                  onChange={(e) => {
                    setValues({ ...values, medical: e.target.value });
                  }}
                  className="payslip__input"
                  type="number"
                />
              </td>
              <td className="payslip__tableTd"></td>
            </tr>

            <tr className="payslip__tableRow">
              <td className="payslip__tableTd">
                Performance &nbsp; :&nbsp;&nbsp;&nbsp;
                <input
                  onChange={(e) => {
                    setValues({ ...values, performance: e.target.value });
                  }}
                  className="payslip__input"
                  type="number"
                />
              </td>
              <td className="payslip__tableTd"></td>
            </tr>
            <tr className="payslip__tableRow">
              <td className="payslip__tableTd">
                Loan &nbsp; :&nbsp;&nbsp;&nbsp; &#8377;
                {payslipInfo.loan}
              </td>
            </tr>
          </table>

          <br />
          <br />
          <div className="payslip__netSalary">
            <h2>
              Allowance Limit :
              {payslipInfo.allowanceLimit -
                values.phone -
                values.conveyance -
                values.performance -
                values.medical}
            </h2>
          </div>
          <div className="payslip__netSalary">
            <h2>Net Salary : {payslipInfo.netSalary} </h2>
          </div>
          <br />
          <br />
          <div className="payslip__buttonDiv">
            <button onClick={addallowances} className="payslip__button">
              Save changes
            </button>
            <button onClick={generatepdf} className="payslip__button">
              Generate pdf
            </button>
            <button onClick={sendEmail} className="payslip__button">
              Send email
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
