import React, { useState, useEffect } from "react";
import "./AddEmployee.css";
import "date-fns";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import { useHistory } from "react-router-dom";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { toast, ToastContainer } from "react-toastify";
import { isAuthenticate } from "../../auth/token";

function AddEmployee() {
  const { token } = isAuthenticate();

  const history = useHistory();
  const [departments, setDepartments] = useState([]);
  const [dateOfBirth, setSelectedDateForDob] = useState(
    Date().toLocaleString()
  );

  const handleDateChangeForDob = (date) => {
    setSelectedDateForDob(date);
  };
  const [dateOfJoining, setSelectedDateForDoj] = useState(
    Date().toLocaleString()
  );

  const handleDateChangeForDoj = (date) => {
    setSelectedDateForDoj(date);
  };
  const [graduatingYear, setGraduatingYear] = useState(Date().toLocaleString());

  const handleDateChangeForgy = (date) => {
    setGraduatingYear(date);
  };
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

  const [values, setvalues] = useState({
    email: "",
    firstName: "",
    lastName: "",
    gender: "",
    bloodGroup: "A+",
    contactNumbersPersonal: "",
    contactNumbersWork: "",
    addressespermanentaddress: "",
    addressespermanentcity: "",
    addressespermanentstate: "",
    addressespermanentcountry: "",
    addressespermanentpincode: "",
    addressesresidentialaddress: "",
    addressesresidentialcity: "",
    addressesresidentialstate: "",
    addressesresidentialcountry: "",
    addressesresidentialpincode: "",
    designation: "Manager",
    department: "",
    workPreviousCompany: "",
    workExperience: "",
    educationInstituteName: "",
    educationQualificationTitle: "",
    salaryPerAnnum: "",
  });
  const {
    email,
    firstName,
    lastName,
    gender,
    bloodGroup,
    contactNumbersPersonal,
    contactNumbersWork,
    addressespermanentaddress,
    addressespermanentcity,
    addressespermanentstate,
    addressespermanentcountry,
    addressespermanentpincode,
    addressesresidentialaddress,
    addressesresidentialcity,
    addressesresidentialstate,
    addressesresidentialcountry,
    addressesresidentialpincode,
    designation,
    department,
    workPreviousCompany,
    workExperience,
    salaryPerAnnum,
    educationInstituteName,
    educationQualificationTitle,
  } = values;
  const handleChange = (event) => {
    setvalues({ ...values, [event.target.name]: event.target.value });
  };
  const Adduser = () => {
    const body = {
      firstName,
      lastName,
      gender,
      dateOfBirth,
      bloodGroup,
      dateOfJoining,
      contactNumbers: {
        personal: contactNumbersPersonal,
        work: contactNumbersWork,
      },
      addresses: {
        Permanent: {
          address: addressespermanentaddress,
          city: addressespermanentcity,
          state: addressespermanentstate,
          country: addressespermanentcountry,
          pincode: addressespermanentpincode,
        },
        Residential: {
          address: addressesresidentialaddress,
          city: addressesresidentialcity,
          state: addressesresidentialstate,
          country: addressesresidentialcountry,
          pincode: addressesresidentialpincode,
        },
      },
      work: {
        experience: workExperience,
        previousCompany: workPreviousCompany,
      },
      education: {
        instituteName: educationInstituteName,
        graduatingDate: graduatingYear,
        qualificationTitle: educationQualificationTitle,
      },
      email,
      designation,
      department,
      salaryPerAnnum,
    };
    return fetch(`/admin/employee/create`, {
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
    Adduser().then((data) => {
      if (data?.message) {
        setvalues({ ...values });
        showError(data.message);
      } else {
        showSuccess(
          "Employee created successfully,you will we redirected to dashboard"
        );
        setTimeout(function () {
          let path = `/AdminEmployee`;
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
    <div className="AddEmp">
      <div className="Empform__card">
        <div className="Empform__header">
          <h1 className="Empform__heading">Add Employee</h1>
        </div>
        <div className="Empform__body">
          <form>
            <hr className="Empform__hr" />
            <div className="Empform__header">
              <h3 className="Empform__heading">Personal Information</h3>
            </div>

            <div className="Empform__row">
              <label className="Empform__label">
                First Name<span className="Empform__star">*</span>
              </label>
              <input
                name="firstName"
                onChange={handleChange}
                className="Empform__input"
                type="text"
                value={values.firstName}
              />
              <label className="Empform__label">
                Last Name<span className="Empform__star">*</span>
              </label>
              <input
                name="lastName"
                onChange={handleChange}
                className="Empform__input"
                type="text"
                value={values.lastName}
              />
            </div>

            <div className="Empform__row">
              <label className="Empform__label">
                Date Of Birth<span className="Empform__star">*</span>
              </label>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container justify="flex-start">
                  <KeyboardDatePicker
                    margin="normal"
                    className="Empform__inputC"
                    id="date-picker-dialog"
                    format="MM/dd/yyyy"
                    value={dateOfBirth}
                    onChange={handleDateChangeForDob}
                    KeyboardButtonEmpps={{
                      "aria-label": "change date",
                    }}
                  />
                </Grid>
              </MuiPickersUtilsProvider>

              <label className="Empform__label">
                Gender<span className="Empform__star">*</span>
              </label>
              <div class="Empform__selectRow">
                <select
                  name="gender"
                  onChange={handleChange}
                  value={values.gender}
                  class="Empform__select"
                  required
                >
                  <option value="Gender" selected>
                    Gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <label className="Empform__label">
                Blood Group<span className="Empform__star">*</span>
              </label>
              <div class="Empform__selectRow">
                <select
                  name="bloodGroup"
                  onChange={handleChange}
                  value={values.bloodGroup}
                  class="Empform__select"
                  required
                >
                  <option value="A+" selected>
                    A+
                  </option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>

            <div className="Empform__row">
              <label className="Empform__label">
                Contact Number (Work)<span className="Empform__star">*</span>
              </label>
              <input
                className="Empform__input"
                type="text"
                name="contactNumbersWork"
                onChange={handleChange}
                value={values.contactNumbersWork}
              />
              <label className="Empform__label">
                Contact Number (Personal)
                <span className="Empform__star">*</span>
              </label>
              <input
                name="contactNumbersPersonal"
                onChange={handleChange}
                value={values.contactNumbersPersonal}
                className="Empform__input"
                type="text"
              />
            </div>

            <div className="Empform__rowEmail">
              <label className="Empform__label">
                Email ID<span className="Empform__star">*</span>
              </label>
              <input
                name="email"
                onChange={handleChange}
                value={values.email}
                className="Empform__inputB"
                type="text"
              />
            </div>

            <div className="Empform__rowAddress">
              <label className="Empform__label">
                Permanent Address<span className="Empform__star">*</span>
              </label>
              <input
                name="addressespermanentaddress"
                onChange={handleChange}
                value={values.addressespermanentaddress}
                className="Empform__inputB"
                type="text"
              />
            </div>

            <div className="Empform__row">
              <label className="Empform__label">
                Country<span className="Empform__star">*</span>
              </label>
              <input
                name="addressespermanentcountry"
                onChange={handleChange}
                value={values.addressespermanentcountry}
                className="Empform__input"
                type="text"
              />

              <label className="Empform__label">
                State<span className="Empform__star">*</span>
              </label>
              <input
                name="addressespermanentstate"
                onChange={handleChange}
                value={values.addressespermanentstate}
                className="Empform__input"
                type="text"
              />

              <label className="Empform__label">
                City<span className="Empform__star">*</span>
              </label>
              <input
                name="addressespermanentcity"
                onChange={handleChange}
                value={values.addressespermanentcity}
                className="Empform__input"
                type="text"
              />

              <label className="Empform__label">
                Pincode<span className="Empform__star">*</span>
              </label>
              <input
                name="addressespermanentpincode"
                onChange={handleChange}
                value={values.addressespermanentpincode}
                className="Empform__input"
                type="text"
              />
            </div>

            <div className="Empform__rowAddress">
              <label className="Empform__label">
                Residential Address<span className="Empform__star">*</span>
              </label>
              <input
                name="addressesresidentialaddress"
                onChange={handleChange}
                value={values.addressesresidentialaddress}
                className="Empform__inputB"
                type="text"
              />
            </div>

            <div className="Empform__row">
              <label className="Empform__label">
                Country<span className="Empform__star">*</span>
              </label>
              <input
                name="addressesresidentialcountry"
                onChange={handleChange}
                value={values.addressesresidentialcountry}
                className="Empform__input"
                type="text"
              />

              <label className="Empform__label">
                State<span className="Empform__star">*</span>
              </label>
              <input
                name="addressesresidentialstate"
                onChange={handleChange}
                value={values.addressesresidentialstate}
                className="Empform__input"
                type="text"
              />

              <label className="Empform__label">
                City<span className="Empform__star">*</span>
              </label>
              <input
                name="addressesresidentialcity"
                onChange={handleChange}
                value={values.addressesresidentialcity}
                className="Empform__input"
                type="text"
              />

              <label className="Empform__label">
                Pincode<span className="Empform__star">*</span>
              </label>
              <input
                name="addressesresidentialpincode"
                onChange={handleChange}
                value={values.addressesresidentialpincode}
                className="Empform__input"
                type="text"
              />
            </div>

            <hr className="Empform__hr" />
            <div className="Empform__header">
              <h3 className="Empform__heading">Joining Details</h3>
            </div>

            <div className="Empform__row">
              <label className="Empform__label">
                Date Of Joining<span className="Empform__star">*</span>
              </label>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container justify="flex-start">
                  <KeyboardDatePicker
                    margin="normal"
                    className="Empform__inputC"
                    id="date-picker-dialog"
                    format="MM/dd/yyyy"
                    value={dateOfJoining}
                    name="dateOfJoining"
                    onChange={handleDateChangeForDoj}
                    KeyboardButtonEmpps={{
                      "aria-label": "change date",
                    }}
                  />
                </Grid>
              </MuiPickersUtilsProvider>
            </div>

            <div className="Empform__row">
              <label className="Empform__label">
                Designation<span className="Empform__star">*</span>
              </label>
              <div class="Empform__selectRow">
                <select
                  value={values.designation}
                  name="designation"
                  onChange={handleChange}
                  class="Empform__select"
                  required
                >
                  <option value="Manager" selected>
                    Manager
                  </option>

                  <option value="General Manager">General Manager</option>
                  <option value="Executive">Executive</option>
                  <option value="President">President</option>
                  <option value="Project Manager">Project Manager</option>
                  <option value="Jr. Developer">Jr. Developer</option>
                  <option value="Sr. Developer">Sr. Developer</option>
                  <option value="Designer">Designer</option>
                  <option value="Marketing Head">Marketing Head</option>
                  <option value="HR Admin">HR Admin</option>
                  <option value="Assistant">Assistant</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <label className="Empform__label">
                Department<span className="Empform__star">*</span>
              </label>
              <div class="Empform__selectRow">
                <select
                  name="department"
                  onChange={handleChange}
                  value={values.department}
                  class="Empform__select"
                  required
                >
                  <option value=" " selected>
                    Department
                  </option>
                  {departments.length !== 0 ? (
                    departments.map((department) => (
                      <option value={department._id}>
                        {department.deptName}
                      </option>
                    ))
                  ) : (
                    <span>No Department</span>
                  )}
                </select>
              </div>
            </div>
            <div className="Empform__row">
              <label className="Empform__labelSal">
                Annual Salary<span className="Empform__star">*</span>
              </label>
              <input
                name="salaryPerAnnum"
                onChange={handleChange}
                value={values.salaryPerAnnum}
                className="Empform__inputSal"
                type="number"
                min="0"
              />
            </div>

            <hr className="Empform__hr" />
            <div className="Empform__header">
              <h3 className="Empform__heading">Work Experience</h3>
            </div>

            <div className="Empform__row">
              <label className="Empform__label">
                Previous Organisation Name
                <span className="Empform__star">*</span>
              </label>
              <input
                value={values.workPreviousCompany}
                name="workPreviousCompany"
                onChange={handleChange}
                className="Empform__input"
                type="text"
              />
              <label className="Empform__label">
                Work Experience<span className="Empform__star">*</span>
              </label>
              <input
                value={values.workExperience}
                name="workExperience"
                onChange={handleChange}
                className="Empform__input"
                type="number"
                min="0"
              />
            </div>

            <hr className="Empform__hr" />
            <div className="Empform__header">
              <h3 className="Empform__heading">Education</h3>
            </div>

            <div className="Empform__rowInst">
              <label className="Empform__label">
                Institute Name<span className="Empform__star">*</span>
              </label>
              <input
                value={values.educationInstituteName}
                name="educationInstituteName"
                onChange={handleChange}
                className="Empform__inputB"
                type="text"
              />
            </div>

            <div className="Empform__row">
              <label className="Empform__label">
                Qualification<span className="Empform__star">*</span>
              </label>
              <input
                value={values.educationQualificationTitle}
                name="educationQualificationTitle"
                onChange={handleChange}
                className="Empform__input"
                type="text"
              />
              <label className="Empform__label">
                Graduation Year<span className="Empform__star">*</span>
              </label>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid>
                  <KeyboardDatePicker
                    margin="normal"
                    className="Empform__inputCal"
                    id="date-picker-dialog"
                    format="MM/dd/yyyy"
                    value={graduatingYear}
                    onChange={handleDateChangeForgy}
                    KeyboardButtonEmpps={{
                      "aria-label": "change date",
                    }}
                  />
                </Grid>
              </MuiPickersUtilsProvider>
            </div>
            <div className="Empform__rowBtn">
              <button className="Empform__btn" onClick={clickSubmit}>
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

export default AddEmployee;
