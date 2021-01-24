import React, { useState } from "react";
import "./EmpLeavesContent.css";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker } from "react-date-range";
import { toast, ToastContainer } from "react-toastify";
import { isAuthenticate } from "../../auth/token";

function EmpLeavesContent() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [dayDescription, setDayName] = useState("");
  const [dayType, setDayType] = useState("");

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  };
  const { token } = isAuthenticate();
  function handleSelect(ranges) {
    setStartDate(ranges.selection.startDate);
    setEndDate(ranges.selection.endDate);
  }

  const applyLeaves = () => {
    const body = {
      leaveFrom: startDate,
      leaveTo: endDate,
      leaveDescription: dayDescription,
    };
    return fetch(`/employee/leaves/apply`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
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
        showSuccess("leave applied");
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
    <div className="EmpLeaves">
      <div className="EmpLeaves__card">
        <div className="EmpLeaves__row">
          <input
            className="EmpLeaves__input"
            placeholder="Enter your reason within 20 words"
            value={dayDescription}
            onChange={(e) => {
              setDayName(e.target.value);
            }}
          />
        </div>

        <div className="EmpLeaves__dp">
          <DateRangePicker ranges={[selectionRange]} onChange={handleSelect} />
        </div>
        <div className="EmpLeaves__row">
          <button className="EmpLeaves__btn" onClick={clickSubmit}>
            SUBMIT
          </button>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default EmpLeavesContent;
