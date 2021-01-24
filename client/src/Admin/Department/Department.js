import React from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import Departmentcontent from "./Departmentcontent";
function Department() {
  return (
    <div>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <Departmentcontent />
      </div>
    </div>
  );
}

export default Department;
