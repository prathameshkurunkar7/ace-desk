import React, { useState } from "react";
import "./Holidayscontent.css";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker } from "react-date-range";
import { toast, ToastContainer } from "react-toastify";
import { isAuthenticate } from "../../auth/token";

function Holidayscontent() {
  const { token } = isAuthenticate();

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [dayDescription, setDayName] = useState("");
  const [dayType, setDayType] = useState("");

  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  };

  function handleSelect(ranges) {
    setStartDate(ranges.selection.startDate);
    setEndDate(ranges.selection.endDate);
  }

  function getDates() {
    var dates = [],
      currentDate = startDate,
      addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
      };
    while (currentDate <= endDate) {
      dates.push(currentDate);
      currentDate = addDays.call(currentDate, 1);
    }
    return dates;
  }
  let dates = getDates();
  const updatedDates = dates.map((date) => {
    return {
      date: date.toISOString().substring(0, 10),
      dayType,
      dayDescription,
    };
  });

  const Addholidays = (daysSchedule) => {
    const body = {
      daysSchedule: daysSchedule,
    };
    return fetch(`/admin/schedule/create`, {
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
    Addholidays(updatedDates).then((data) => {
      if (data?.message) {
        showError(data.message);
      } else {
        showSuccess("Schedule succesfully Planned");
      }
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
    <div className="holiday">
      <div className="holiday__card">
        <div className="holiday__row">
          <input
            className="holiday__input"
            placeholder="Enter Description"
            value={dayDescription}
            onChange={(e) => {
              setDayName(e.target.value);
            }}
          />
        </div>
        <div className="holiday__row">
          <div className="holiday__selectRow">
            <select
              onChange={(e) => {
                setDayType(e.target.value);
              }}
              value={dayType}
              required
              className="holiday__select"
            >
              <option value="" selected>
                Please Select Occasion
              </option>
              <option value="Event" selected>
                Event
              </option>

              <option value="Holiday" selected>
                Holiday
              </option>

              <option value="Business" selected>
                Business
              </option>
            </select>
          </div>
        </div>

        <div className="holiday__dp">
          <DateRangePicker ranges={[selectionRange]} onChange={handleSelect} />
        </div>
        <div className="holiday__row">
          <button className="holiday__btn" onClick={clickSubmit}>
            SUBMIT
          </button>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Holidayscontent;
