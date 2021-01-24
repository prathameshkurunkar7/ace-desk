import React from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import Holidayscontent from "./Holidayscontent";
function Holidays() {
  return (
    <div>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <Holidayscontent />
      </div>
    </div>
  );
}

export default Holidays;
