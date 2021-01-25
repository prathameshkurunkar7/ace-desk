import React, { useEffect, useState } from "react";
import "./EditProfileContent.css";
import { useHistory } from "react-router-dom";

import { toast, ToastContainer } from "react-toastify";
import { isAuthenticate } from "../../auth/token";

export default function EditProfileContent() {
  const [values, setValues] = useState({
    github: "",
    linkedin: "",
    twitter: "",
    about: "",
    photo: "",
  });
  const { token } = isAuthenticate();
  const history = useHistory();
  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };
  const handleChangephoto = (event) => {
    setValues({ ...values, photo: event.target.files[0] });
  };
  const Updateprofile = () => {
    const data = new FormData();
    data.append("github", values.github);
    data.append("linkedIn", values.linkedin);
    data.append("twitter", values.twitter);
    data.append("about", values.about);
    data.append("image", values.photo);

    return fetch(
      `/employee/profile/update`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
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
    Updateprofile().then((data) => {
      console.log(data.profileImage);
      if (data?.message) {
        showError(data.message);
      } else {
        showSuccess("profile successfully updated");
        let jwt = localStorage.getItem("jwt");

        jwt = JSON.parse(jwt);
        jwt.profileImage = data.profileImage;
        localStorage.setItem("jwt", JSON.stringify(jwt));
        setTimeout(function () {
          let path = `/profile`;
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
  const showSuccess = (result) => {
    toast.info(result, {
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
    <div className="updateProfile">
      <div className="updateProfile__card">
        <div className="updateProfile__header">
          <h1 className="updateProfile__heading">Update Profile</h1>
        </div>
        <div className="updateProfile__body">
          <form>
            <div className="updateProfile__row">
              <label className="updateProfile__label">
                GitHub URL<span className="updateProfile__star">*</span>
              </label>
              <input
                className="updateProfile__input"
                type="text"
                required
                autoFocus
                onChange={handleChange}
                name="github"
                value={values.github}
              />
            </div>

            <div className="updateProfile__row">
              <label className="updateProfile__label">
                LinkedIn URL<span className="updateProfile__star">*</span>
              </label>
              <input
                className="updateProfile__input"
                type="text"
                onChange={handleChange}
                name="linkedin"
                value={values.linkedin}
                required
              />
            </div>

            <div className="updateProfile__row">
              <label className="updateProfile__label">
                Twitter URL<span className="updateProfile__star">*</span>
              </label>
              <input
                onChange={handleChange}
                name="twitter"
                value={values.twitter}
                className="updateProfile__input"
                type="text"
                required
              />
            </div>

            <div className="updateProfile__row">
              <label className="updateProfile__label">
                About<span className="updateProfile__star">*</span>
              </label>
              <textarea
                onChange={handleChange}
                name="about"
                value={values.about}
                className="updateProfile__input"
                type="text"
                required
              />
            </div>

            <div className="updateProfile__row">
              <label className="updateProfile__label">
                Update Image<span className="updateProfile__star">*</span>
              </label>
              <input
                onChange={handleChangephoto}
                name="photo"
                className="updateProfile__upload"
                type="file"
                required
              />
            </div>

            <br />
            <div className="updateProfile__rowBtn">
              <button onClick={clickSubmit} className="updateProfile__btn">
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
