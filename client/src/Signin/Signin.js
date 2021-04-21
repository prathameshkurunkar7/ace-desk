import React, { useState } from "react";
import { ReactComponent as Logo } from "../img/undraw_Data_re_80ws.svg";
import { authenticate } from "../auth/token";
import { toast, ToastContainer } from "react-toastify";
import { useHistory } from "react-router-dom";
import { Button } from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import LockIcon from "@material-ui/icons/Lock";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import "./Signin.css";

function Signin() {
  const history = useHistory();
  const [modalIsOpen, setIsOpen] = useState(true);
  const [values, setvalues] = useState({
    email: "",
    password: "",
    redirectTouser: false,
    redirectToadmin: false,
  });
  const { email, password } = values;
  const handleChange = (name) => (event) => {
    setvalues({ ...values, [name]: event.target.value });
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
      if (data?.message) {
        showError(data.message);
      } else if (data.role === "Employee") {
        authenticate(data);
        showSuccess(
          "Succesfully signed in,you will be redirected to Dashboard"
        );
        setTimeout(function () {
          history.push("/EmpDashboard");
        }, 2500);
      } else {
        authenticate(data);
        showSuccess(
          "Succesfully signed in,you will be redirected to Dashboard"
        );
        setTimeout(function () {
          history.push("/AdminDashboard");
        }, 2500);
      }
    });
  };
  const showSuccess = (success) => {
    toast.info(success, {
      position: "top-left",
      autoClose: 2300,
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

  function closeModal() {
    setIsOpen(false);
  }

  const customStyles = {
    content: {
      top: "10%",
      left: "75%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
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
                  Sign In
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

      <ToastContainer />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <p>Email: &nbsp; admin77@gmail.com</p>
        <p>Password: &nbsp; 0B248CB2</p>
        <Button onClick={closeModal}>close</Button>
      </Modal>
    </div>
  );
}

export default Signin;