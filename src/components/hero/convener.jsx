import React from "react";
import "./convener.css";
const convener = () => {
  return (
    <React.Fragment>
      <div className="parent-convener">
        <div className="convener-title">
          <img src="/images/rrr.webp" alt="" className="convener-logo" />
          <h1 className="convener-title-name">Convener</h1>
        </div>

        <div className="convener-container">
          <div className="convener-card">
            <img
              className="convener-card-image"
              src="\images\hod.jpg"
              alt="V. Srinivas - HOD AI & DS"
            />
            <h1 className="convener-name"> Dr.V . Srinivas </h1>
            <h1 className="convener-position">
              Head Of Department - Artificial Intelligence and Data Science{" "}
            </h1>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default convener;
