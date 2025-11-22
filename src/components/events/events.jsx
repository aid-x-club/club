import React, { useEffect } from "react";
import "./events.css";
import ReactGA from "react-ga";

const events = () => {
  useEffect(() => {
    document.title = "Club Activities";
  });
  const handleStage = (stage) => {
    ReactGA.event({
      category: "Button",
      action: "click",
      label: `Activity-${stage}`,
    });
    if (stage == "1") {
      document.querySelector("#line-progress").style.width = "0%";
      document.querySelectorAll(".section-content").forEach((s) => s.classList.remove("active"));
      document.querySelector(".stage1-content").classList.add("active");
    }
    if (stage == "2") {
      document.querySelector("#line-progress").style.width = "33%";
      document.querySelectorAll(".section-content").forEach((s) => s.classList.remove("active"));
      document.querySelector(".stage2-content").classList.add("active");
    }
    if (stage == "3") {
      document.querySelector("#line-progress").style.width = "66%";
      document.querySelectorAll(".section-content").forEach((s) => s.classList.remove("active"));
      document.querySelector(".stage3-content").classList.add("active");
    }
    if (stage == "4") {
      document.querySelector("#line-progress").style.width = "100%";
      document.querySelectorAll(".section-content").forEach((s) => s.classList.remove("active"));
      document.querySelector(".stage4-content").classList.add("active");
    }
  };
  return (
    <React.Fragment>
      <div className="parent-events">
        <div className="events-progress-bar">
          <ul>
            <li onClick={() => handleStage("1")}>Workshops</li>
            <li onClick={() => handleStage("2")}>Competitions</li>
            <li onClick={() => handleStage("3")}>Projects</li>
            <li onClick={() => handleStage("4")}>Certifications</li>
          </ul>
          <div id="line">
            <div id="line-progress"></div>
          </div>
        </div>

        <div className="events-container">
          <div className="section-content stage1-content active">
            <div className="section-format">
              <h1>Technical Workshops & Bootcamps</h1>
              <p>
                 We conduct regular technical workshops covering our seven tech domains.<br /> <br />
                 Topics include AI/ML, Data Science, Web Development, Cloud & DevOps, Cybersecurity, IoT, and UI/UX Design.<br /> <br />
                 Workshops are led by experienced coordinators and industry professionals.<br /> <br />
                 Hands-on bootcamps provide practical experience with real-world tools and technologies.<br /> <br />
                 Check our Instagram @aid_x.club for upcoming workshop announcements!
              </p>
            </div>
          </div>

          <div className="section-content stage2-content">
            <div className="section-format">
              <h1>Coding Competitions & Challenges</h1>
              <p>
                 We organize regular coding competitions to test and improve your skills.<br /> <br />
                 Competitions cover various difficulty levels - beginner to advanced.<br /> <br />
                 Problems are based on real-world scenarios and industry requirements.<br /> <br />
                 Winners are recognized and awarded certificates of achievement.<br /> <br />
                 Team and individual competitions help build community and friendly competition!
              </p>
            </div>
          </div>

          <div className="section-content stage3-content">
            <div className="section-format">
              <h1>Project Showcases & Guest Lectures</h1>
              <p>
                 Members showcase their projects and learn from each other's work.<br /> <br />
                 Project demos help you understand practical applications of theoretical concepts.<br /> <br />
                 Industry experts conduct guest lectures sharing insights and best practices.<br /> <br />
                 Learn about current industry trends and career opportunities.<br /> <br />
                 Q&A sessions provide direct interaction with professionals!
              </p>
            </div>
          </div>

          <div className="section-content stage4-content">
            <div className="section-format">
              <h1>Certificates & Recognition</h1>
              <p>
                 Members who actively participate receive certificates of completion.<br /> <br />
                 Recognition programs highlight top contributors and project builders.<br /> <br />
                 Certificates include dates, topics, and participation details.<br /> <br />
                 Active members and coordinators get annual recognition awards.<br /> <br />
                 Building a portfolio? Our certificates showcase your technical growth!
              </p>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default events;
