import React from "react";
import EmpDashboardContent from "./EmpDashboardContent";
import EmpNavbar from "../EmpNavbar/Navbar";
import EmpSidebar from "../EmpSidebar/EmpSidebar";
function EmpDashboard() {
  return (
    <div>
      <EmpNavbar />
      <div style={{ display: "flex" }}>
        <EmpSidebar />
        <EmpDashboardContent />
      </div>
    </div>
  );
}

export default EmpDashboard;
