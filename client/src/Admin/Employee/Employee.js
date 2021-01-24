import React from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import Employcontent from "./Employcontent";
function Employee() {
  return (
    <div>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <Employcontent />
      </div>
    </div>
  );
}

export default Employee;
