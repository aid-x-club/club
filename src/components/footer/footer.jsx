import React from "react";
import "./footer.css";
import { ReactComponent as Copyright } from "../../assets/copyright.svg";
const footer = () => {
  const handleCredits = () => {
    window.open("https://github.com/AI-Data-Excellence-Club", "_blank");
  };
  return (
    <React.Fragment>
      <div className="parent-footer">
        <p className="copyright">
          Copyrights
          <Copyright className="copyright-icon" />
          2025-2026 - {"All Rights Reserved."}
        </p>
        <p className="copyright">
          Credits <p onClick={handleCredits}>AID-X Club</p>
        </p>
      </div>
    </React.Fragment>
  );
};

export default footer;
