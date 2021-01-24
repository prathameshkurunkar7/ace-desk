import React from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import Myprofilecontent from "./Myprofilecontent";
function Myprofile() {
  return (
    <div>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <Myprofilecontent />
      </div>
    </div>
  );
}

export default Myprofile;
