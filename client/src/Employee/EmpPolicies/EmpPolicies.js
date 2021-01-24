import React from "react";
import EmpNavbar from "../EmpNavbar/Navbar";
import EmpSidebar from "../EmpSidebar/EmpSidebar";
import EmpPoliciesContent from "./EmpPoliciesContent";
function EmpPolicies() {
  return (
    <div>
      <EmpNavbar />
      <div style={{ display: "flex" }}>
        <EmpSidebar />
        <EmpPoliciesContent />
      </div>
    </div>
  );
}

export default EmpPolicies;
