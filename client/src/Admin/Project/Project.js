import React from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import ProjectContent from "./ProjectContent";
function Project() {
  return (
    <div>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <ProjectContent />
      </div>
    </div>
  );
}

export default Project;
