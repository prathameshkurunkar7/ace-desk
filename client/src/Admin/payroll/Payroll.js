import React from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import Payrollcontent from "./Payrollcontent";
function Payroll() {
  return (
    <div>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <Payrollcontent />
      </div>
    </div>
  );
}

export default Payroll;
