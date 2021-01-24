import React from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import LeavesContent from "./LeavesContent";
function Leaves() {
  return (
    <div>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <LeavesContent />
      </div>
    </div>
  );
}

export default Leaves;
