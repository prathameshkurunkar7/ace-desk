export const authenticate = (data) => {
  if (typeof window != "undefined") {
    localStorage.setItem("jwt", JSON.stringify(data));
  }
};

export const signout = () => {
  if (typeof window != "undefined") {
    localStorage.removeItem("jwt");
  }
  // return fetch(`http://localhost:3001/api/signout`, {
  //   method: "GET",
  // })
  //   .then((response) => {
  //     console.log("signout", response);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
};
export const isAuthenticate = () => {
  if (typeof window == "undefined") {
    return false;
  }
  if (localStorage.getItem("jwt")) {
    return JSON.parse(localStorage.getItem("jwt"));
  } else return false;
};
