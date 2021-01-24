import React from "react";
import EmpNavbar from "../EmpNavbar/Navbar";
import EmpSidebar from "../EmpSidebar/EmpSidebar";
import EmpLeavesContent from "./EmpLeavesContent";
function EmpLeaves() {
  return (
    <div>
      <EmpNavbar />
      <div style={{ display: "flex" }}>
        <EmpSidebar />
        <EmpLeavesContent />
      </div>
    </div>
  );
}

export default EmpLeaves;
