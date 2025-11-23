import React, { useState } from "react";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import "./flip-card.css";
import ReactGA from "react-ga";

export const FlipCard = ({ data }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleLaunch = (e, target) => {
    e.stopPropagation();
    const rocket = document.querySelector(`#${target}`);
    if (rocket) rocket.classList.toggle("flip-card-launch");
  };

  const handleContactLink = (e, linkType, url) => {
    e.stopPropagation();
    e.preventDefault();
    
    handleLaunch(e, `launch-${data.id}-${linkType}`);
    
    setTimeout(() => {
      const win = window.open("about:blank", "_blank");
      if (win) win.location.href = url;
      else window.open(url, "_blank");
    }, 500);

    ReactGA.event({
      category: "Button",
      action: "click",
      label: `Contact Option - ${linkType}`,
    });
  };

  return (
    <div className="flip-card-wrapper">
      <div
        className={`flip-card ${isFlipped ? "flipped" : ""}`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front Side */}
        <div className="flip-card-front">
          <div className="flip-card-image-wrapper">
            <img
              src={data.image}
              alt={data.name}
              onError={(e) => {
                const fallbackOrder = [
                  `/images/s/${encodeURIComponent(data.name)}.jpg`,
                  `/images/s/${encodeURIComponent(data.name)}.png`,
                  "/images/default-coordinator.webp",
                ];
                const current = e.target.src || "";
                const next = fallbackOrder.find((p) => !current.endsWith(p));
                if (next) e.target.src = next;
              }}
            />
          </div>
          <div className="flip-card-content">
            <h2 className="flip-card-name">{data.name}</h2>
            <p className="flip-card-title">{data.title || "AID-X Coordinator"}</p>
            <div className="flip-card-toggle">
              <KeyboardDoubleArrowRightIcon className="flip-icon" />
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div className="flip-card-back">
          <div className="flip-card-content">
            <h2 className="flip-card-name">{data.name}</h2>
            <p className="flip-card-bio">{data.bio || data.title || "AID-X Coordinator"}</p>

            <div className="flip-card-social-links">
              {data.socialLinks?.github && (
                <a
                  href={data.socialLinks.github}
                  className="flip-card-link github-link"
                  onClick={(e) =>
                    handleContactLink(e, "github", data.socialLinks.github)
                  }
                  title="GitHub"
                >
                  <GitHubIcon className="link-icon" />
                  <span className="link-text">GitHub</span>
                  <span id={`launch-${data.id}-github`}>
                    <RocketLaunchIcon className="rocketLaunch" />
                  </span>
                </a>
              )}

              {data.socialLinks?.linkedin && (
                <a
                  href={data.socialLinks.linkedin}
                  className="flip-card-link linkedin-link"
                  onClick={(e) =>
                    handleContactLink(e, "linkedin", data.socialLinks.linkedin)
                  }
                  title="LinkedIn"
                >
                  <LinkedInIcon className="link-icon" />
                  <span className="link-text">LinkedIn</span>
                  <span id={`launch-${data.id}-linkedin`}>
                    <RocketLaunchIcon className="rocketLaunch" />
                  </span>
                </a>
              )}
            </div>

            <div className="flip-card-toggle back">
              <KeyboardDoubleArrowLeftIcon className="flip-icon" />
              <span className="back-text">Back</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
