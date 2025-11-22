import React, { useEffect } from "react";
import "./guidelines.css";

const guildelines = () => {
  useEffect(() => {
    document.title = "Guidelines";
  });
  return (
    <React.Fragment>
      <div className="parent-guidelines">
        <div className="guidelines-title">Club Guidelines & Code of Conduct</div>
        <div className="guidelines-container">
          <div className="guidelines-content">
            <div className="guidelines-1">
              1. All members must treat fellow members, coordinators, and guests with respect and professionalism. <br /> <br />
              2. Active participation in club activities is encouraged but not mandatory. Attend events that interest you. <br />
              <br />
              3. Technical knowledge sharing and collaborative learning are core values of our club. <br />
              <br />
              4. Projects should be original. Do not copy or plagiarize code or ideas from other members without proper attribution. <br />
              <br />
              5. Members must follow the university's code of conduct and maintain academic integrity in all club activities. <br />
              <br />
              6. Any form of harassment, discrimination, or inappropriate behavior will not be tolerated. <br />
              <br />
              7. Respect for diversity and inclusion is mandatory. We welcome members from all backgrounds and expertise levels. <br />
              <br />
            </div>
            <div className="guidelines-2">
              8. Club resources and equipment should be used responsibly and returned in good condition. <br />
              <br />
              9. Coordinators make decisions based on fairness and the best interest of the club community. <br />
              <br />
              10. Members are expected to communicate professionally in club channels and events. <br />
              <br />
              11. All club activities follow Vignan Institute of Technology and Science policies and guidelines. <br />
              <br />
              12. Feedback and suggestions for club improvement are always welcome. Reach out to coordinators with your ideas. <br />
              <br />
              13. Members should maintain confidentiality regarding internal club discussions and decisions. <br />
              <br />
              14. Violations of these guidelines may result in a warning or removal from the club. Serious violations will be escalated to university authorities. <br />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default guildelines;
