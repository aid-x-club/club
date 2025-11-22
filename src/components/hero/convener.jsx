import React from "react";
import "./convener.css";
const convener = () => {
  return (
    <React.Fragment>
      <div className="parent-convener">
        <div className="convener-title">
          <img src="/images/rrr.webp" alt="" className="convener-logo" />
          <h1 className="convener-title-name">HOD</h1>
        </div>

        <div className="convener-container">
          <div className="convener-card">
            <img
              src="/images/s/hod.jpg"
              alt="Dr. V. Srinivas"
              className="convener-card-image"
            />
            <h1 className="convener-name">Dr. V. Srinivas</h1>
            <h1 className="convener-position">
              Head of Department, Artificial Intelligence and Data Science
            </h1>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default convener;
