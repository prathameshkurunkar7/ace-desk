import React, { useEffect, useState } from "react";
import "./Myprofilecontent.css";
import CallIcon from "@material-ui/icons/Call";
import EmailIcon from "@material-ui/icons/Email";
import CakeIcon from "@material-ui/icons/Cake";
import WcIcon from "@material-ui/icons/Wc";
import HomeIcon from "@material-ui/icons/Home";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import GitHubIcon from "@material-ui/icons/GitHub";
import TwitterIcon from "@material-ui/icons/Twitter";
import { Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { NavLink } from "react-router-dom";
import { isAuthenticate } from "../../auth/token";
function Myprofilecontent() {
  const { token } = isAuthenticate();
  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      "& > *": {
        margin: theme.spacing(1),
      },
    },
    large: {
      width: theme.spacing(25),
      height: theme.spacing(25),
    },
  }));
  const classes = useStyles();
  const [details, setDetails] = useState({
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
    designation: "",
    department: "",
    workPreviousCompany: "",
    workExperience: "",
    educationInstituteName: "",
    educationQualificationTitle: "",
    salaryPerAnnum: "",
    profileImage: "",
    github: "",
    linkedin: "",
    twitter: "",
  });

  useEffect(async () => {
    await fetch(`/employee/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setDetails({
          ...details,
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender,
          bloodGroup: data.bloodGroup,
          contactNumbersPersonal: data.contactNumbers.personal,
          contactNumbersWork: data.contactNumbers.work,
          email: data.userAuth.email,
          addressespermanentaddress: data.addresses.Permanent.address,
          addressespermanentcity: data.addresses.Permanent.city,
          addressespermanentcountry: data.addresses.Permanent.country,
          addressespermanentpincode: data.addresses.Permanent.pincode,
          addressespermanentstate: data.addresses.Permanent.state,
          addressesresidentialaddress: data.addresses.Residential.address,
          addressesresidentialcity: data.addresses.Residential.city,
          addressesresidentialcountry: data.addresses.Residential.country,
          addressesresidentialpincode: data.addresses.Residential.pincode,
          addressesresidentialstate: data.addresses.Residential.state,
          designation: data.designation,
          department: data.department.deptName,
          workPreviousCompany: data.work.previousCompany,
          workExperience: data.work.experience,
          educationInstituteName: data.education.instituteName,
          educationQualificationTitle: data.education.qualificationTitle,
          salaryPerAnnum: data.payroll.salaryPerAnnum,
          dateOfBirth: new Date(data.dateOfBirth)
            .toISOString()
            .substring(0, 10),
          about: data.about,
          profileImage: data.profileImage,
          github: data.socialHandles.github,
          linkedin: data.socialHandles.linkedIn,
          twitter: data.socialHandles.twitter,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <div className="myprofile">
      <div className="profile__container">
        <div className="profile__cardLeft">
          <div className="profile__cardLeftup">
            <div className="profile__desc">
              <div className="img__cover">
                <a href="">
                  <Avatar
                    className={classes.large}
                    alt="profile image"
                    src={details.profileImage}
                  />
                </a>
              </div>
              <h1>
                {details.firstName} {details.lastName}
              </h1>
              <br />
              <h3> {details.designation} </h3>
              <medium>{details.department}</medium>
              <br />
              <br />
              <div className="">
                <h3>Employee ID :</h3>
                <medium>{details.employeeSerialId}</medium>
              </div>
              <br />
              <div className="edit__profile">
                <NavLink to="/editProfile">
                  <button className="edit__profileBtn">Edit Profile</button>
                </NavLink>
              </div>
            </div>
          </div>
          <br /> <br />
          <div className="profile__info">
            <hr className="profile__hr" />
            <br />
            <div className="profile__title">
              <CallIcon />
              <label className="profile__label">Phone :&nbsp;&nbsp;</label>
              {details.contactNumbersPersonal}
            </div>
            <br />

            <div className="profile__title">
              <EmailIcon />
              <label className="profile__label">Email: &nbsp;&nbsp;</label>
              {details.email}
            </div>
            <br />

            <div className="profile__title">
              <CakeIcon />
              <label className="profile__label">Birthday :&nbsp;&nbsp;</label>
              {details.dateOfBirth}
            </div>
            <br />

            <div className="profile__title">
              <WcIcon />
              <label className="profile__label">Gender :&nbsp;&nbsp;</label>
              {details.gender}
            </div>
            <br />

            <div className="profile__title">
              <HomeIcon />
              <label className="profile__label">Address: &nbsp;&nbsp;</label>
              {details.addressespermanentaddress}{" "}
              {details.addressespermanentcity}{" "}
              {details.addressespermanentcountry}{" "}
              {details.addressespermanentpincode}
            </div>
            <br />
          </div>
        </div>

        <div className="profile__cardRight">
          <div className="profile__details">
            <br />
            <h2>About</h2>
            <p className="profile__text">{details.about}</p>
            <h3>
              <LinkedInIcon />
              {details.linkedin}
            </h3>
            <h3>
              <GitHubIcon />
              {details.github}
            </h3>
            <h3>
              <TwitterIcon />
              {details.twitter}
            </h3>{" "}
            <br />
            <br />
            <hr className="profile__hr" />
          </div>

          <div className="profile__details">
            <h2>Work Experience</h2>
            <br />
            <p className="profile__text">
              I have experience of working in {details.workPreviousCompany} for
              about {details.workExperience} years
            </p>
            <hr className="profile__hr" />
          </div>

          <div className="profile__details">
            <h2>Education</h2>
            <p className="profile__text">
              Graduation Degree:&nbsp;&nbsp;{" "}
              {details.educationQualificationTitle}
            </p>

            <p className="profile__text">
              Institute Name:&nbsp;&nbsp; {details.educationInstituteName}
            </p>

            <br />
            <p className="profile__text"></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Myprofilecontent;
