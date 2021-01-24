import React from "react";
import EmpNavbar from "../EmpNavbar/Navbar";
import EmpSidebar from "../EmpSidebar/EmpSidebar";
import EmpAttendanceContent from "./EmpAttendanceContent";
function EmpAttendance() {
  return (
    <div>
      <EmpNavbar />
      <div style={{ display: "flex" }}>
        <EmpSidebar />
        <EmpAttendanceContent />
      </div>
    </div>
  );
}

export default EmpAttendance;
