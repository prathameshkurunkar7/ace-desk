import React from "react";
import EmpNavbar from "../EmpNavbar/Navbar";
import EmpSidebar from "../EmpSidebar/EmpSidebar";
import ELnBContent from "./ELnBContent";
function ELnB() {
  return (
    <div>
      <EmpNavbar />
      <div style={{ display: "flex" }}>
        <EmpSidebar />
        <ELnBContent />
      </div>
    </div>
  );
}

export default ELnB;
