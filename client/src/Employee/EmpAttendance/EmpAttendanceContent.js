import React from "react";
import "./EmpAttendanceContent.css";
import FingerprintIcon from "@material-ui/icons/Fingerprint";
import { toast, ToastContainer } from "react-toastify";
import { isAuthenticate } from "../../auth/token";

function EmpAttendanceContent() {
  const { token } = isAuthenticate();
  const applyLeaves = () => {
    const body = {
      status: "Present",
    };
    return fetch(
      `/employee/attendance/mark`,
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
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const clickSubmit = (event) => {
    event.preventDefault();
    applyLeaves().then((data) => {
      if (data?.message) {
        showError(data.message);
      } else {
        showSuccess("attendence marked");
      }
    });
  };
  const showError = (error) => {
    toast.info(error, {
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
  return (
    <div className="employee__attendance">
      {/* <div className="empAttendance__container"> */}
      <div className="empAttendance__card">
        <div className="empAttendance__desc">
          <h2 className="empAttendance__heading">Punch in for today</h2>
          <button onClick={clickSubmit} className="punch__btn">
            <FingerprintIcon style={{ fontSize: 120 }} />
          </button>
        </div>
      </div>
      {/* </div> */}
      <ToastContainer />
    </div>
  );
}

export default EmpAttendanceContent;
