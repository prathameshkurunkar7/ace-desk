import React, { useState } from "react";
import "./ELnBContent.css";
import { toast, ToastContainer } from "react-toastify";
import { isAuthenticate } from "../../auth/token";

export default function ELnBContent() {
  const { token } = isAuthenticate();

  const [values, setValues] = useState({
    paymentRequest: "Loan",
    amount: "",
    description: "",
  });
  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };
  const Addloan = () => {
    const body = {
      paymentRequest: values.paymentRequest,
      amount: values.amount,
      description: values.description,
    };
    return fetch(
      `/employee/payroll/apply-loan-bonus/`,
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
    Addloan().then((data) => {
      if (data?.message) {
        showError(data.message);
      } else {
        showSuccess("request applied");
        setValues({
          paymentRequest: "",
          amount: "",
          description: "",
        });
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
    <div className="lbform">
      <div className="lbform__card">
        <div className="lbform__header">
          <h1 className="lbform__heading">Apply Loan or Bonus</h1>
        </div>
        <div className="lbform__body">
          <form>
            <div className="lbform__row">
              <label className="lbform__label">
                Amount<span className="lbform__star"> *</span>
              </label>
              <input
                className="lbform__input"
                type="number"
                autoFocus
                min="1"
                name="amount"
                value={values.amount}
                onChange={handleChange}
              />
            </div>
            <div className="lbform__row">
              <label className="lbform__label">
                Loan or Bonus<span className="lbform__star"> *</span>
              </label>
              <div class="lbform__selectRow">
                <select
                  name="paymentRequest"
                  value={values.paymentRequest}
                  onChange={handleChange}
                  class="lbform__select"
                >
                  <option value="Loan">Loan</option>
                  <option value="Bonus">Bonus</option>
                </select>
              </div>
            </div>
            <div className="lbform__row">
              <label className="lbform__label">
                Reason<span className="lbform__star"> *</span>
              </label>
              <input
                name="description"
                value={values.description}
                onChange={handleChange}
                className="lbform__input"
                type="text"
                autoFocus
              />
            </div>
            <div className="lbform__btrow">
              <button onClick={clickSubmit} className="lbform__btn">
                SUBMIT
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
