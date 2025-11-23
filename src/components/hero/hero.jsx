import "./hero.css";
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ReactGA from "react-ga";
import KeyboardDoubleArrowRightSharpIcon from "@mui/icons-material/KeyboardDoubleArrowRightSharp";
import VanillaTilt from "vanilla-tilt";
import Agenda from "./agenda";
import Schedule from "./schedule";
import Sponsors from "./sponsors";
import CoreSkillsModal from "./CoreSkillsModal";
import { Footer } from "../";
import { useAuth } from "../../context/AuthContext";
import { ReactComponent as Calender } from "../../assets/calender.svg";
import { ReactComponent as Info } from "../../assets/info.svg";
import { ReactComponent as Location } from "../../assets/location.svg";
import { ReactComponent as ArrowRightWhite } from "../../assets/arrow-right-white.svg";
import { ReactComponent as ArrowRightBlack } from "../../assets/arrow-right-black.svg";

const hero = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showCoreSkillsModal, setShowCoreSkillsModal] = useState(false);

  const handleRegisterClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("JOIN CLUB clicked - isAuthenticated:", isAuthenticated);
    ReactGA.event({
      category: "Button",
      action: "click",
      label: "join_club",
    });
    if (isAuthenticated) {
      console.log("Navigating to /events");
      navigate("/events");
    } else {
      console.log("Navigating to /login");
      navigate("/login");
    }
  };
  const handleCardClicks = (card) => {
    ReactGA.event({
      category: "Button",
      action: "click",
      label: `${card}`,
    });
    window.open(`${card}`, "_self");
  };
  const handleComingSoon = () => {
    ReactGA.event({
      category: "Button",
      action: "click",
      label: "Coming Soon",
    });
    alert("Coming Soon!");
  };
  const handleCoreSkills = () => {
    ReactGA.event({
      category: "Button",
      action: "click",
      label: "Core Skills",
    });
    setShowCoreSkillsModal(true);
  };
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const handleCountdown = () => {
    // Club website doesn't need countdown
  };

  useEffect(() => {
    const tilt = VanillaTilt.init(
      document.querySelectorAll(".anim"),
      {
        max: 10,
        speed: 400,
      },
      []
    );
    // No countdown needed for club website
    return () => {
      // cleanup
    };
  }, []);
  return (
    <React.Fragment>
      <div className="parent_hero">
        {/* <div className="progress_bar"></div> */}
        <div className=" tag-hero-mobile">
          <img
            src="/images/s/Vignan_logo.png"
            alt="vignan logo"
            width="40vw"
            className="hero-srm-logo"
          />
          <div className="tag">
            <div>
              <div>AID-X</div>
              <span>Club</span>
            </div>
            AI & Data Excellence
          </div>
        </div>

        {/* ----------------------- Page 1 ------------------------- */}
        <section className="column">
          <div className="left_side">
            <div className="curve"></div>

            <div className="title1">
              <span className="hackathon"> {"AID-X Club"}</span>
              <br />
              <p className="description">
                AI & Data Excellence Club
                <span> - Learn. Build. Excel. </span>
                A student-driven initiative for innovation, technical growth,
                <br /> and community-based learning in cutting-edge technologies
              </p>
            </div>

            <div className="register_now" onClick={handleRegisterClick} style={{ cursor: 'pointer' }}>
              <div>
                <span>JOIN CLUB </span>
              </div>
              <div>
                {" "}
                <KeyboardDoubleArrowRightSharpIcon style={{ fontSize: 35 }} />
              </div>
            </div>
            <div className="countdown-main">
              <div className="countdown anim">
                <div className="day-card anim">
                  <h3 className="day">15+</h3>
                  <h3>Tech Domains</h3>
                </div>
                <div className="sep">•</div>
                <div className="hour-card anim">
                  <h3 className="hours">200+</h3>
                  <h3>Members</h3>
                </div>
                <div className="sep">•</div>
                <div className="min-card anim">
                  <h3 className="minutes">32+</h3>
                  <h3>Projects</h3>
                </div>
                <div className="sep">•</div>
                <div className="sec-card anim">
                  <h3 className="seconds">∞</h3>
                  <h3>Growth</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="right_side">
            {/* -------------------------- Column 1 * ---------------------------------- */}

            <div className="col1 animated-div">
              <h3 className="text">
                <div>
                  <div>
                    <div>Learn</div> <div></div>{" "}
                  </div>{" "}
                  Build
                </div>
                <Calender className="calender-icon" />
              </h3>
              <p
                className="text2"
                onClick={handleComingSoon}
              >
                Activities <ArrowRightWhite className="arrow-right-icon" />
              </p>
              <p className="text3" onClick={() => {
                if (isAuthenticated) {
                  navigate("/events");
                } else {
                  navigate("/login");
                }
              }}>
                Events <ArrowRightWhite className="arrow-right-icon" />
              </p>
            </div>
            {/* -------------------------- Column 2 * ---------------------------------- */}
            <div className="col2 animated-div">
              <h3 className="text4">
                About Club <Info className="info-icon" />
              </h3>
              <p className="text5" onClick={() => handleCardClicks("/about")}>
                Our Mission
                <ArrowRightWhite className="arrow-right-icon" />
              </p>
              <p className="text6" onClick={() => handleCardClicks("#contact")}>
                Club Coordinators
                <ArrowRightWhite className="arrow-right-icon" />
              </p>
            </div>
            {/* -------------------------- Column 3 * ---------------------------------- */}
            <div className="col3 animated-div">
              <div className="flex justify-items-start">
                <h3 className="text7">Tech Domains</h3>
              </div>
              <p className="text8" onClick={handleCoreSkills}>
                Core Skills <ArrowRightBlack className="arrow-right-icon" />
              </p>
              <p className="text9" onClick={() => handleCardClicks("#schedule")}>
                Specializations <ArrowRightBlack className="arrow-right-icon" />
              </p>
            </div>
            {/* -------------------------- Column 4  ---------------------------------- */}
            <div
              className="col4 animated-div"
              onClick={() =>
                window.open("https://www.google.com/maps/search/Vignan+Institute+of+Technology+and+Science+Hyderabad")
              }
            >
              <h3 className="text10">
                Location <Location className="location-icon" />
              </h3>
              <div className="flex flex-col ">
                <p className="text-white pt-[2vh] text-[1vw] venue-text-mobile">
                  Vignan Institute of Technology & Science, Hyderabad
                </p>
                <div className="round"></div>
              </div>
            </div>
            {/* -------------------------- Column 5  ---------------------------------- */}
            <div className="col5 "></div>
            {/* -------------------------- Column 6  ---------------------------------- */}
            <div className="col6 animated-div">
              <h3 className="text13">
                Department
                <div className="flex justify-center items-center gap-1"></div>
              </h3>
              <div className="flex items-start justify-between flex-col">
                <p className="text14">Artificial Intelligence & Data Science</p>
                <p className="text15">VITS, Hyderabad</p>
                <div className="round2"></div>
              </div>
            </div>
          </div>
        </section>
        {/* -------------------------- Page 2 -------------------------- */}
      </div>
      <Agenda />
      <div className="bg-sep"></div>
      <Schedule />
      <div className="bg-sep"></div>
      <Sponsors />
      <Footer />
      <CoreSkillsModal isOpen={showCoreSkillsModal} onClose={() => setShowCoreSkillsModal(false)} />
    </React.Fragment>
  );
};

export default hero;
