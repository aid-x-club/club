import React from "react";
import "./convener.css";
const coordinators = () => {
  return (
    <React.Fragment>
      <div className="parent-convener">
        <div className="convener-title">
          <img src="/images/rrr.webp" alt="" className="convener-logo" />
          <h1 className="convener-title-name">Faculty Coordinator</h1>
        </div>

        <div className="convener-container" style={{justifyContent: "center"}}>
          <div className="convener-card">
            <img
              src="/images/s/faculty_coordinator.jpg"
              alt="Mr. Sai Lalith Prasad"
              className="convener-card-image"
            />
            <h1 className="convener-name">Mr. Sai Lalith Prasad</h1>
            <h1 className="convener-position">
              Assistant Professor, Department of Artificial Intelligence & Data Science
            </h1>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default coordinators;
