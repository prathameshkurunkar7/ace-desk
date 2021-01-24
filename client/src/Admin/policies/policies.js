import React from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import Policiescontent from "./Policiescontent";
function Policies() {
  return (
    <div>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <Policiescontent />
      </div>
    </div>
  );
}
export default Policies;
