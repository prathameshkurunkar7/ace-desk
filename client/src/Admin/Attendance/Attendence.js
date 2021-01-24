import React from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import Attendancecontent from "./Attendancecontent";
function Attendence() {
  return (
    <div>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <Attendancecontent />
      </div>
    </div>
  );
}

export default Attendence;
