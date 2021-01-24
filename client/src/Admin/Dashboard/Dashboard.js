import React from "react";
import DashboardContent from "./DashboardContent";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
function Dashboard() {
  return (
    <div>
      <Navbar />

      <div style={{ display: "flex" }}>
        <Sidebar />
        <DashboardContent />
      </div>
    </div>
  );
}

export default Dashboard;
