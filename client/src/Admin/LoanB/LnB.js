import React from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import LnBContent from "./LnBContent";
function LnB() {
  return (
    <div>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <LnBContent />
      </div>
    </div>
  );
}

export default LnB;
