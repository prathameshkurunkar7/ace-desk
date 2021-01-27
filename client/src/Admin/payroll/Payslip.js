import React, { useEffect, useState } from "react";
import "./Payslip.css";
import "date-fns";
import { useHistory } from "react-router-dom";
import { savedPayrollId } from "../../features/generatepayroll";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { isAuthenticate } from "../../auth/token";

export default function Payslip() {
  const { token } = isAuthenticate();
  const history = useHistory();
  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
  ]
  const d = new Date(); 
  let thisMonthdate = `${monthNames[d.getMonth()]} ${d.getFullYear()}`
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
          Authorization: `Bearer ${token}`,
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
      `/admin/payroll/payslip/generate-pdf/${payslipInfo.payroll_id}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.message) {
          showError(data.message);
        } else {
          showSuccess("Pdf Generated Successfully");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const sendEmail = (e) => {
    e.preventDefault();
    return fetch(
      `/admin/payroll/payslip/send-mail/${payslipInfo.payroll_id}`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.message) {
          showError(data.message);
        } else {
          showSuccess("Mail Sent Successfully");
          setTimeout(function () {
            let path = `/AdminPayroll`;
            history.push(path);
          }, 2500);
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
      position: "top-left",
      autoClose: 2500,
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
        <h1>Payslip for {thisMonthdate.split(' ')[0]}</h1>
        <hr className="proform__hr" />
      </div>

      <div className="payslip__body">
        <form>
            <div style={{ float: "right" }}>
              <h4>Salary month:{thisMonthdate}</h4>
            </div>
            <div className="top__row">
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
                {Number(payslipInfo.allowanceshouseRent).toFixed(2)}
              </td>
              <td className="payslip__tableTd">
                EPF &nbsp; :&nbsp;&nbsp; &#8377; {Number(payslipInfo.deductionsepf).toFixed(2)}
              </td>
            </tr>

            <tr className="payslip__tableRow">
              <td className="payslip__tableTd">
                Dearness &nbsp; :&nbsp;&nbsp;&nbsp; &#8377;
                {Number(payslipInfo.allowancesdearness).toFixed(2)}
              </td>
              <td className="payslip__tableTd">
                Professional &nbsp; :&nbsp;&nbsp; &#8377;
                {Number(payslipInfo.deductionsprofessional).toFixed(2)}
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
                ESI &nbsp; :&nbsp;&nbsp; &#8377; {Number(payslipInfo.deductionsesi).toFixed(2)}
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
                Loan &nbsp; :&nbsp;&nbsp;&nbsp; &#8377;
                {payslipInfo.loan}
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
                Bonus &nbsp; :&nbsp;&nbsp; &#8377; {payslipInfo.bonus}
              </td>
            </tr>
          </table>

          <br />
          <br />
          <div className="payslip__netSalary">
            <h3 style={{fontWeight:"500"}}>
              Allowance Limit :
              &#8377;{Number(payslipInfo.allowanceLimit -
                values.phone -
                values.conveyance -
                values.performance -
                values.medical).toFixed(2)}
            </h3>
          </div>
          <div className="payslip__netSalary">
            <h2>Net Salary : &#8377;{payslipInfo.netSalary} </h2>
          </div>
          <br />
          <br />
          <div className="payslip__buttonDiv">
            <button onClick={addallowances} className="payslip__button">
              Save Changes
            </button>
            <button onClick={generatepdf} className="payslip__button">
              Generate PDF
            </button>
            <button onClick={sendEmail} className="payslip__button">
              Send Email
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
