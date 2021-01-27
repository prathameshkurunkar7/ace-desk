import React, { useState, useEffect } from "react";
import "./AddEmployee.css";
import "date-fns";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { useHistory } from "react-router-dom";

import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { savedEmpId } from "../../features/editemp";
import { isAuthenticate } from "../../auth/token";
function EditEmployee() {
  const _id = useSelector(savedEmpId);
  const { token } = isAuthenticate();

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
  const history = useHistory();

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
    bloodGroup: "",
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
    salaryPerAnnum,
  } = values;
  useEffect(async () => {
    await fetch(`/admin/employee/${_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((employee) => {
        setvalues({
          ...values,
          firstName: employee.firstName,
          lastName: employee.lastName,
          gender: employee.gender,
          bloodGroup: employee.bloodGroup,
          contactNumbersPersonal: employee.contactNumbers.personal,
          contactNumbersWork: employee.contactNumbers.work,
          email: employee.userAuth.email,
          addressespermanentaddress: employee.addresses.Permanent.address,
          addressespermanentcity: employee.addresses.Permanent.city,
          addressespermanentcountry: employee.addresses.Permanent.country,
          addressespermanentpincode: employee.addresses.Permanent.pincode,
          addressespermanentstate: employee.addresses.Permanent.state,
          addressesresidentialaddress: employee.addresses.Residential.address,
          addressesresidentialcity: employee.addresses.Residential.city,
          addressesresidentialcountry: employee.addresses.Residential.country,
          addressesresidentialpincode: employee.addresses.Residential.pincode,
          addressesresidentialstate: employee.addresses.Residential.state,
          designation: employee.designation,
          department: employee.department._id,
          workPreviousCompany: employee.work.previousCompany,
          workExperience: employee.work.experience,
          educationInstituteName: employee.education.instituteName,
          educationQualificationTitle: employee.education.qualificationTitle,
          salaryPerAnnum: employee.payroll.salaryPerAnnum,
        });
        setSelectedDateForDob(employee.dateOfBirth);
        setSelectedDateForDoj(employee.dateOfJoining);
        setGraduatingYear(employee.education.graduatingDate);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleChange = (event) => {
    setvalues({ ...values, [event.target.name]: event.target.value });
  };
  const Edituser = () => {
    const body = {
      "contactNumbers.work": contactNumbersWork,
      "contactNumbers.personal": contactNumbersPersonal,
      "addresses.Permanent.pincode": addressespermanentpincode,
      "addresses.Permanent.address": addressespermanentaddress,
      "addresses.Permanent.city": addressespermanentcity,
      "addresses.Permanent.state": addressespermanentstate,
      "addresses.Permanent.country": addressespermanentcountry,
      "addresses.Residential.pincode": addressesresidentialpincode,
      "addresses.Residential.address": addressesresidentialaddress,
      "addresses.Residential.city": addressesresidentialcity,
      "addresses.Residential.state": addressesresidentialstate,
      "addresses.Residential.country": addressesresidentialcountry,
      designation,
      department,
    };
    return fetch(
      `/admin/employee/update/${_id}`,
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
      .catch((error) => {
        console.log(error);
      });
  };
  const clickSubmit = (event) => {
    event.preventDefault();
    Edituser().then((data) => {
      if (data?.message) {
        setvalues({ ...values });
        showError(data.message);
      } else {
        showSuccess(
          "Employee updated successfully,you will we redirected to dashboard"
        );
        setTimeout(function () {
          let path = `/AdminEmployee`;
          history.push(path);
        }, 2500);
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
    <div className="AddEmp">
      <div className="Empform__card">
        <div className="Empform__header">
          <h1>Edit Employee</h1>
        </div>
        <div className="Empform__body">
          <form>
            <hr className="Empform__hr" />
            <div className="Empform__header">
              <h4>Personal information</h4>
            </div>

            <div className="Empform__row">
              <label className="Empform__label">
                First Name<span className="Empform__star"> *</span>
              </label>
              <input
                name="firstName"
                onChange={handleChange}
                className="Empform__input"
                type="text"
                value={values.firstName}
                disabled
              />
              <label className="Empform__label">
                Last Name<span className="Empform__star"> *</span>
              </label>
              <input
                name="lastName"
                onChange={handleChange}
                className="Empform__input"
                type="text"
                value={values.lastName}
                disabled
              />
            </div>

            <div className="Empform__row">
              <label className="Empform__label">
                Date of birth<span className="Empform__star"> *</span>
              </label>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container justify="space-evenly">
                  <KeyboardDatePicker
                    margin="normal"
                    className="Empform__input"
                    id="date-picker-dialog"
                    format="MM/dd/yyyy"
                    value={dateOfBirth}
                    onChange={handleDateChangeForDob}
                    KeyboardButtonEmpps={{
                      "aria-label": "change date",
                    }}
                    readOnly
                  />
                </Grid>
              </MuiPickersUtilsProvider>

              <label className="Empform__label">
                Gender<span className="Empform__star"> *</span>
              </label>
              <div class="Empform__selectRow">
                <select
                  name="gender"
                  onChange={handleChange}
                  value={values.gender}
                  class="Empform__select"
                  required
                  disabled
                >
                  <option value="Gender" selected>
                    Gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <label className="Empform__label">
                Blood Group<span className="Empform__star"> *</span>
              </label>
              <div class="Empform__selectRow">
                <select
                  name="bloodGroup"
                  onChange={handleChange}
                  value={values.bloodGroup}
                  class="Empform__select"
                  required
                  disabled
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
                Contact number (work)<span className="Empform__star"> *</span>
              </label>
              <input
                className="Empform__input"
                type="text"
                name="contactNumbersWork"
                onChange={handleChange}
                value={values.contactNumbersWork}
              />
              <label className="Empform__label">
                Contact number (personal)
                <span className="Empform__star"> *</span>
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
                Email ID<span className="Empform__star"> *</span>
              </label>
              <input
                name="email"
                onChange={handleChange}
                value={values.email}
                className="Empform__inputEmail"
                type="text"
                disabled
              />
            </div>

            <div className="Empform__rowAddress">
              <label className="Empform__label">
                Permanent address<span className="Empform__star"> *</span>
              </label>
              <input
                name="addressespermanentaddress"
                onChange={handleChange}
                value={values.addressespermanentaddress}
                className="Empform__inputAddress"
                type="text"
              />
            </div>

            <div className="Empform__row">
              <label className="Empform__label">
                Country<span className="Empform__star"> *</span>
              </label>
              <input
                name="addressespermanentcountry"
                onChange={handleChange}
                value={values.addressespermanentcountry}
                className="Empform__input"
                type="text"
              />

              <label className="Empform__label">
                State<span className="Empform__star"> *</span>
              </label>
              <input
                name="addressespermanentstate"
                onChange={handleChange}
                value={values.addressespermanentstate}
                className="Empform__input"
                type="text"
              />

              <label className="Empform__label">
                City<span className="Empform__star"> *</span>
              </label>
              <input
                name="addressespermanentcity"
                onChange={handleChange}
                value={values.addressespermanentcity}
                className="Empform__input"
                type="text"
              />

              <label className="Empform__label">
                Pin code<span className="Empform__star"> *</span>
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
                Residential address<span className="Empform__star"> *</span>
              </label>
              <input
                name="addressesresidentialaddress"
                onChange={handleChange}
                value={values.addressesresidentialaddress}
                className="Empform__inputAddress"
                type="text"
              />
            </div>

            <div className="Empform__row">
              <label className="Empform__label">
                Country<span className="Empform__star"> *</span>
              </label>
              <input
                name="addressesresidentialcountry"
                onChange={handleChange}
                value={values.addressesresidentialcountry}
                className="Empform__input"
                type="text"
              />

              <label className="Empform__label">
                State<span className="Empform__star"> *</span>
              </label>
              <input
                name="addressesresidentialstate"
                onChange={handleChange}
                value={values.addressesresidentialstate}
                className="Empform__input"
                type="text"
              />

              <label className="Empform__label">
                City<span className="Empform__star"> *</span>
              </label>
              <input
                name="addressesresidentialcity"
                onChange={handleChange}
                value={values.addressesresidentialcity}
                className="Empform__input"
                type="text"
              />

              <label className="Empform__label">
                Pin code<span className="Empform__star"> *</span>
              </label>
              <input
                name="addressesresidentialpincode"
                onChange={handleChange}
                value={values.addressesresidentialpincode}
                className="Empform__input"
                type="text"
              />
            </div>

            {/* <div className="Empform__row">
                <label className="Empform__label">
                  Social handles<span className="Empform__star"> *</span>
                </label>
                <input
                  name="socialhandlesgithub"
                  onChange={handleChange("socialhandlesgithub")}
                  value={values.socialHandles.github}
                  className="Empform__input"
                  type="text"
                />
                <input
                  name="socialhandleslinkdin"
                  onChange={handleChange("socialhandleslinkdin")}
                  value={values.socialHandles.linkedIn}
                  className="Empform__input"
                  type="text"
                />
                <input
                  name="socialhandlestwitter"
                  onChange={handleChange("socialhandlestwitter")}
                  value={values.socialHandles.twitter}
                  className="Empform__input"
                  type="text"
                />
              </div> */}

            <hr className="Empform__hr" />
            <div className="Empform__header">
              <h4>Joining details</h4>
            </div>

            <div className="Empform__row">
              <label className="Empform__label">
                Date of joining<span className="Empform__star"> *</span>
              </label>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container justify="space-around">
                  <KeyboardDatePicker
                    margin="normal"
                    className="Empform__input"
                    id="date-picker-dialog"
                    format="MM/dd/yyyy"
                    value={dateOfJoining}
                    name="dateOfJoining"
                    onChange={handleDateChangeForDoj}
                    KeyboardButtonEmpps={{
                      "aria-label": "change date",
                    }}
                    disableFuture
                    readOnly
                  />
                </Grid>
              </MuiPickersUtilsProvider>
              <div className="Empform__rowSalary">
                <label className="Empform__label">
                  Annual Salary<span className="Empform__star"> *</span>
                </label>
                <input
                  name="salaryPerAnnum"
                  onChange={handleChange}
                  value={values.salaryPerAnnum}
                  className="Empform__input"
                  type="text"
                  disabled
                />
              </div>
            </div>

            <div className="Empform__row">
              <label className="Empform__label">
                Designation<span className="Empform__star"> *</span>
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
                  <option value="General Manager">General manager</option>
                  <option value="Executive">Executive</option>
                  <option value="President">President</option>
                  <option value="Empject manager">Empject manager</option>
                  <option value="Developer">Developer</option>
                  <option value="Designer">Designer</option>
                  <option value="Marketing head">Marketing head</option>
                  <option value="HR">HR</option>
                  <option value="Captain">Captain</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <label className="Empform__label">
                Department<span className="Empform__star"> *</span>
              </label>
              <div class="Empform__selectRow">
                <select
                  name="department"
                  onChange={handleChange}
                  value={values.department}
                  class="Empform__select"
                  required
                >
                  {departments.length !== 0 ? (
                    departments.map((department) => (
                      <option value={department._id}>
                        {department.deptName}
                      </option>
                    ))
                  ) : (
                    <span>no department</span>
                  )}
                </select>
              </div>
            </div>

            <hr className="Empform__hr" />
            <div className="Empform__header">
              <h4>Work experience</h4>
            </div>

            <div className="Empform__row">
              <label className="Empform__label">
                Previous organisation name
                <span className="Empform__star"> *</span>
              </label>
              <input
                value={values.workPreviousCompany}
                name="workPreviousCompany"
                onChange={handleChange}
                className="Empform__input"
                type="text"
              />
              <label className="Empform__label">
                Work experience<span className="Empform__star"> *</span>
              </label>
              <input
                value={values.workExperience}
                name="workExperience"
                onChange={handleChange}
                className="Empform__input"
                type="number"
              />
            </div>

            <hr className="Empform__hr" />
            <div className="Empform__header">
              <h4>Education</h4>
            </div>

            <div className="Empform__rowInst">
              <label className="Empform__label">
                Institute Name<span className="Empform__star"> *</span>
              </label>
              <input
                value={values.educationInstituteName}
                name="educationInstituteName"
                onChange={handleChange}
                className="Empform__inputInst"
                type="text"
                disabled
              />
            </div>

            <div className="Empform__row">
              <label className="Empform__label">
                Qualification<span className="Empform__star"> *</span>
              </label>
              <input
                value={values.educationQualificationTitle}
                name="educationQualificationTitle"
                onChange={handleChange}
                className="Empform__input"
                type="text"
                disabled
              />
              <label className="Empform__label">
                Graduation year<span className="Empform__star"> *</span>
              </label>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container justify="space-evenly">
                  <KeyboardDatePicker
                    margin="normal"
                    className="Empform__input"
                    id="date-picker-dialog"
                    format="dd/MM/yyyy"
                    value={graduatingYear}
                    onChange={handleDateChangeForgy}
                    KeyboardButtonEmpps={{
                      "aria-label": "change date",
                    }}
                    readOnly
                  />
                </Grid>
              </MuiPickersUtilsProvider>
            </div>

            <div className="Empform__row"></div>
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

export default EditEmployee;
