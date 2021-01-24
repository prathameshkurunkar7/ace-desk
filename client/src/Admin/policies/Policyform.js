import React, { useEffect, useState } from "react";
import "./Policyform.css";
import { useHistory } from "react-router-dom";

import { toast, ToastContainer } from "react-toastify";
import { isAuthenticate } from "../../auth/token";

export default function Policyform() {
  const history = useHistory();
  const { token } = isAuthenticate();

  const [departments, setDepartments] = React.useState([]);
  const [values, setValues] = useState({
    Policyfile: "",
    policyName: "",
    description: "",
    department: "",
  });
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
  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };
  const handleChangepdf = (event) => {
    setValues({ ...values, Policyfile: event.target.files[0] });
  };
  const AddPolicy = () => {
    const data = new FormData();
    data.append("file", values.Policyfile);
    data.append("policyName", values.policyName);
    data.append("description", values.description);
    data.append("department", values.department);
    return fetch(`/admin/policy/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
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
    AddPolicy().then((data) => {
      if (data?.message) {
        showError(data.message);
      } else {
        showSuccess("policy successfully added");
        setTimeout(function () {
          let path = `/AdminPolicies`;
          history.push(path);
        }, 3200);
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
    <div className="policiesform">
      <div className="policiesform__card">
        <div className="policiesform__header">
          <h1 className="policiesform__heading">Add Policy</h1>
        </div>
        <div className="policiesform__body">
          <form>
            <div className="policiesform__row">
              <label className="policiesform__label">
                Policy Name<span className="policiesform__star">*</span>
              </label>
              <input
                className="policiesform__input"
                type="text"
                required
                autoFocus
                name="policyName"
                onChange={handleChange}
                value={values.policyName}
              />
            </div>
            <div className="policiesform__row">
              <label className="policiesform__label">
                Description<span className="policiesform__star">*</span>
              </label>
              <textarea
                name="description"
                onChange={handleChange}
                value={values.description}
                className="policiesform__area"
                required
              ></textarea>
            </div>

            <div className="policiesform__row">
              <label className="policiesform__label">
                Department Name<span className="policiesform__star">*</span>
              </label>
              <div class="policiesform__selectRow">
                <select
                  onChange={handleChange}
                  value={values.department}
                  name="department"
                  class="policiesform__select"
                  required
                >
                  <option selected>Please Select</option>
                  {departments.map((department) => (
                    <option value={department._id}>
                      {department.deptName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="policiesform__row">
              <label className="policiesform__label">
                Upload Policy<span className="policiesform__star">*</span>
              </label>
              <input
                className="policiesform__upload"
                type="file"
                required
                onChange={handleChangepdf}
              />
            </div>
            <div className="policiesform__rowBtn">
              <button onClick={clickSubmit} className="policiesform__btn">
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
