import React, { useState } from "react";
import "./Signin.css";
import { Redirect } from "react-router-dom";
import { ReactComponent as Logo } from "../img/undraw_Data_re_80ws.svg";
import PersonIcon from "@material-ui/icons/Person";
import LockIcon from "@material-ui/icons/Lock";
import { authenticate } from "../auth/token";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Signin() {
  const [values, setvalues] = useState({
    email: "",
    password: "",
    redirectTouser: false,
    redirectToadmin: false,
  });
  const { email, password, redirectTouser, redirectToadmin } = values;
  const handleChange = (name) => (event) => {
    setvalues({ ...values, error: false, [name]: event.target.value });
  };
  const Signinuser = (user) => {
    return fetch(`/register/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
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
    Signinuser({ email, password }).then((data) => {
      console.log(data);
      if (data?.message) {
        setvalues({ ...values });
        showError(data.message);
      } else if (data.role === "HR") {
        showSuccess(
          "succesfully signed in,you will we redirected to Dashboard"
        );
        setTimeout(function () {
          authenticate(data, () => {
            setvalues({
              ...values,
              redirectToadmin: true,
            });
          });
        }, 3200);
      } else {
        showSuccess(
          "succesfully signed in,you will we redirected to Dashboard"
        );
        setTimeout(function () {
          authenticate(data, () => {
            setvalues({
              ...values,
              redirectTouser: true,
            });
          });
        }, 3200);
      }
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
  const UserRedirect = () => {
    if (redirectTouser) {
      return <Redirect to="/EmpDashboard" />;
    }
  };
  const AdminRedirect = () => {
    if (redirectToadmin) {
      return <Redirect to="/AdminDashboard" />;
    }
  };

  const SignInForm = () => {
    return (
      <div className="signin">
        <div className="signin__container">
          <header className="signin__homeTitle">
            <p>AceDesk</p>
          </header>
          <div className="signin__formContainer">
            <div className="signin__formDiv">
              <form action="#" className="signin__form">
                <h2 className="signin__title">Sign In</h2>
                <div className="signin__inputField">
                  <PersonIcon className="signin__icon" />
                  <input
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={values.email}
                    onChange={handleChange("email")}
                  />
                </div>
                <div className="signin__inputField">
                  <LockIcon className="signin__icon" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={values.password}
                    onChange={handleChange("password")}
                  />
                </div>
                <button onClick={clickSubmit} className="signin__btn ">
                  Login
                </button>
              </form>
            </div>
          </div>
          <div className="signin__panelContainer">
            <div className="signin__panel">
              <div className="signin__panelContent">
                <p style={{ fontSize: "1.2rem" }}>
                  A Web Application for safer, simpler and sustainable HR
                  management system.
                </p>
              </div>
              <Logo className="signin__panelImage" />
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div>
      {SignInForm()}
      {UserRedirect()}
      {AdminRedirect()}
      <ToastContainer />
    </div>
  );
}

export default Signin;