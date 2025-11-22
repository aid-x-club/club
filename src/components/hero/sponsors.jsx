import React from "react";
import { ReactComponent as LaunchLink } from "../../assets/link-launch.svg";
import "./sponsors.css";
import Contact from "./contact";
import Convener from "./convener";
import Coordinators from "./coordinators";
const sponsors = () => {
  return (
    <React.Fragment>
      <div id="faqs" className="parent-sponsors">
        <h1 className="sponsors-title">
          Collaborations
          <img src="/images/rrr.webp" alt="arrow-logo" />
        </h1>
        <div className="sponsors-container">
          <div className="sponsors-border">
            <div style={{display: "flex", alignItems: "center", justifyContent: "center", minWidth: "200px", padding: "10px"}}>
              <img src="/images/edumoon.svg" alt="EduMoon Logo" style={{height: "120px", width: "auto", objectFit: "contain"}} />
            </div>
            <div className="sponsors-container-sub">
              <h1 className="sponsor-title">
                <a href="https://www.edumoon.in/" target="_blank">
                  EduMoon
                </a>
              </h1>
              <p className="collaboration-description">
                This collaboration aims to enhance students’ skills, career readiness, and innovation through clubs, training programs, events, and mentorship offered jointly by EduMoon and Vignan.
              </p>
            </div>{" "}
            <LaunchLink className="link-launch-icon" />
          </div>
        </div>

        <div className="collaboration-details">
          <h2 className="collaboration-header">Objectives of the Collaboration</h2>
          <div className="objectives-container">
            <div className="objective-card">
              <h3>🎯 Platform for Innovation</h3>
              <p>Establish and operate the AI AND DATA EXCELLENCE CLUB (AID-X), providing students a platform to explore technology, innovation, and project-based learning.</p>
            </div>
            <div className="objective-card">
              <h3>🛠️ Hands-On Experience</h3>
              <p>Conduct technical workshops, hackathons, expert talks, and innovation challenges to foster hands-on experience and creativity.</p>
            </div>
            <div className="objective-card">
              <h3>🤖 AI-Powered Learning</h3>
              <p>Provide students access to AI-powered mock interviews and learning tools through EduMoon's partnership with Reaidy.AI.</p>
            </div>
            <div className="objective-card">
              <h3>🌐 Community Building</h3>
              <p>Build a cross-university student community where learners can share ideas, collaborate on projects, and find potential co-founders or teammates for entrepreneurial and technical ventures.</p>
            </div>
            <div className="objective-card">
              <h3>💼 Career Development</h3>
              <p>Create a structured bridge between students, professionals, and industries through internship discovery, career guidance, and skill development initiatives led by EduMoon.</p>
            </div>
          </div>
        </div>

        <Convener />
        <Coordinators />
        <Contact />
      </div>
    </React.Fragment>
  );
};

export default sponsors;
