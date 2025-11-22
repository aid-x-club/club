import React from "react";
import PhoneBluetoothSpeakerIcon from "@mui/icons-material/PhoneBluetoothSpeaker";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import "./contact.css";
import ReactGA from "react-ga";

const contact = () => {
  const coordinators = [
    // Row 1
    {
      id: 1,
      name: "Chandrika Sruthi",
      phone: "9381616343",
      email: "chandrikasruthimanepalli@gmail.com",
      github: "https://github.com/chinna3206/",
      linkedin: "https://www.linkedin.com/in/chandrikasruthi",
      image: "/images/s/Manepalli Chandrika sruthi.jpg",
    },
    {
      id: 2,
      name: "Srikanth Reddy",
      phone: "7382020763",
      email: "srikanthreddyybokka@gmail.com",
      github: "https://github.com/Srikanth2448",
      linkedin: "https://www.linkedin.com/in/srikanth-reddy-1499b6278",
      image: "/images/s/Srikanth.jpg",
    },
    {
      id: 3,
      name: "Deepna",
      phone: "6302338657",
      email: "kummarik.deepna@gmail.com",
      github: "https://github.com/deepnashalivahana",
      linkedin: "https://www.linkedin.com/in/deepna-kummari-210758339",
      image: "/images/s/Deepna.jpg",
    },
    {
      id: 4,
      name: "Obadya Sinjin",
      phone: "7993308484",
      email: "sinjinobadya@gmail.com",
      github: "https://github.com/obadyasinjin",
      linkedin: "https://www.linkedin.com/in/osinjin?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      image: "/images/s/Obadya Sinjin.jpg",
    },
    // Row 2
    {
      id: 5,
      name: "Shubham Gundu",
      phone: "8698846796",
      email: "shubhamvasantgundu@gmail.com",
      github: "https://GitHub.com/theshubhamgundu",
      linkedin: "https://www.linkedin.com/in/shubhamgundu",
      image: "/images/s/shubham.webp",
    },
    {
      id: 6,
      name: "Anil Chiranjeeth",
      phone: "8328576119",
      email: "anilmarneni30@gmail.com",
      github: "https://github.com/AnilMarneni",
      linkedin: "https://www.linkedin.com/in/anil-marneni",
      image: "/images/s/anil.jpg",
    },
    {
      id: 7,
      name: "Jhansi Laxmi",
      phone: "8522026756",
      email: "jhansilaxmi3006@gmail.com",
      github: "https://github.com/Jhansi473006",
      linkedin: "https://www.linkedin.com/in/jhansi-laxmi-nadiminti",
      image: "/images/s/JHANSI LAXMI NADIMINTI.jpg",
    },
    {
      id: 8,
      name: "Pravallika",
      phone: "9542579350",
      email: "bhavapravallika05@gmail.com",
      github: "https://github.com/BhavaPravallika",
      linkedin: "https://www.linkedin.com/in/bhava-pravallika",
      image: "/images/s/Bhava Pravallika.jpg",
    },
    // Row 3
    {
      id: 9,
      name: "Deekshitha",
      phone: "6301534516",
      email: "Kndeekshitha07@gmail.com",
      github: "https://github.com/deekshitha-chowdary",
      linkedin: "https://www.linkedin.com/in/deekshitha-chowdary-a68542326?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      image: "/images/s/deekshitha.jpg",
    },
    {
      id: 10,
      name: "Hamsika",
      phone: "9440801653",
      email: "hamsikavalaboju@gmail.com",
      github: "https://github.com/hamsikavalaboju",
      linkedin: "https://www.linkedin.com/in/hamsika-valaboju-b8a607387/",
      image: "/images/s/hamsika.jpg",
    },
    {
      id: 11,
      name: "Prajith Reddy",
      phone: "9951257340",
      email: "prajithbinnu@gmail.com",
      github: "https://github.com/prajith48",
      linkedin: "https://www.linkedin.com/in/konakalla-prajith-reddy-7367192b4?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      image: "/images/s/Prajith reddy.jpg",
    },
    {
      id: 12,
      name: "Shashanth",
      phone: "9553532525",
      email: "samalashashanth@gmail.com",
      github: "https://github.com/ShashanthSamala",
      linkedin: "https://www.linkedin.com/in/samala-shashanth-87962a283?utm_source=share_via&utm_content=profile&utm_medium=member_android",
      image: "/images/s/Shashanth.jpg",
    },
  ];

  const handlecontactOptions = (card) => {
    document.querySelector(card).classList.toggle("contact-card-flip");
  };

  const handleLaunch = (target) => {
    ReactGA.event({
      category: "Button",
      action: "click",
      label: "Contact Option",
    });
    const rocket = document.querySelector(`#${target}`);
    if (rocket) rocket.classList.toggle("contact-card-launch");
  };

  const handleContactLink = (coordinatorId, linkType, url) => {
    handleLaunch(`launch-${coordinatorId}-${linkType}`);
    setTimeout(() => {
      window.open(url, "_blank");
    }, 500);
  };
  return (
    <React.Fragment>
      <div id="contact" className="parent-contact">
        <div className="contact-title">
          <img src="/images/rrr.webp" alt="arrow-logo" />
          Student Coordinators
        </div>
        <div className="parent-container">
          {coordinators.map((coordinator) => (
            <div key={coordinator.id}>
              <div className="contact-container">
                <div
                  className={`contact-card contact-card-${coordinator.id}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="contact-card-front">
                    <img
                      src={
                        coordinator.image ||
                        `/images/s/${encodeURIComponent(coordinator.name)}.webp`
                      }
                      alt={coordinator.name}
                      onError={(e) => {
                        // try common alternate extensions before falling back to default
                        const fallbackOrder = [
                          `/images/s/${encodeURIComponent(coordinator.name)}.jpg`,
                          `/images/s/${encodeURIComponent(coordinator.name)}.png`,
                          "/images/default-coordinator.webp",
                        ];
                        const current = e.target.src || "";
                        const next = fallbackOrder.find((p) => !current.endsWith(p));
                        if (next) e.target.src = next;
                      }}
                    />
                    <div className="contact-card-details">
                      <h1 className="contact-card-name">{coordinator.name}</h1>
                      <h2 className="contact-card-description">
                        AID-X Coordinator
                      </h2>
                      <h3
                        className="contact-card-options front-options"
                        onClick={() =>
                          handlecontactOptions(
                            `.contact-card-${coordinator.id}`
                          )
                        }
                        aria-label={`Open contact options for ${coordinator.name}`}
                      >
                        <KeyboardDoubleArrowRightIcon
                          style={{
                            width: "20px",
                            height: "20px",
                          }}
                        />
                      </h3>
                    </div>
                  </div>
                  <div className={`contact-card-back-${coordinator.id}`}>
                    <div className="contact-card-details">
                      <h1 className="contact-card-name">{coordinator.name}</h1>
                      <h2 className="contact-card-description">
                        <a
                          className="contact-card-email contact-link"
                          href={`mailto:${coordinator.email}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            // open a blank window synchronously so the browser treats
                            // the later navigation as user-initiated (prevents popup blocking)
                            const win = window.open("about:blank", "_blank");
                            handleLaunch(`launch-${coordinator.id}-email`);
                            setTimeout(() => {
                              if (win) win.location.href = `mailto:${coordinator.email}`;
                              else window.location.href = `mailto:${coordinator.email}`;
                            }, 450);
                          }}
                        >
                          <EmailRoundedIcon
                            className="email"
                            style={{ width: "30px", height: "30px" }}
                          />
                          {coordinator.email}
                          <span id={`launch-${coordinator.id}-email`}>
                            <RocketLaunchIcon
                              className="rocketLaunch"
                              style={{ width: "18px", height: "18px" }}
                            />
                          </span>
                        </a>

                        <a
                          className="contact-card-github contact-link"
                          href={coordinator.github}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            const win = window.open("about:blank", "_blank");
                            handleLaunch(`launch-${coordinator.id}-github`);
                            setTimeout(() => {
                              if (win) win.location.href = coordinator.github;
                              else window.open(coordinator.github, "_blank");
                            }, 450);
                          }}
                        >
                          <GitHubIcon
                            className="github"
                            style={{ width: "30px", height: "30px" }}
                          />
                          GitHub
                          <span id={`launch-${coordinator.id}-github`}>
                            <RocketLaunchIcon
                              className="rocketLaunch"
                              style={{ width: "18px", height: "18px" }}
                            />
                          </span>
                        </a>

                        <a
                          className="contact-card-linkedin contact-link"
                          href={coordinator.linkedin}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            const win = window.open("about:blank", "_blank");
                            handleLaunch(`launch-${coordinator.id}-linkedin`);
                            setTimeout(() => {
                              if (win) win.location.href = coordinator.linkedin;
                              else window.open(coordinator.linkedin, "_blank");
                            }, 450);
                          }}
                        >
                          <LinkedInIcon
                            className="linkedin"
                            style={{ width: "30px", height: "30px" }}
                          />
                          LinkedIn
                          <span id={`launch-${coordinator.id}-linkedin`}>
                            <RocketLaunchIcon
                              className="rocketLaunch"
                              style={{ width: "18px", height: "18px" }}
                            />
                          </span>
                        </a>
                      </h2>
                      <h3
                        className="contact-card-options"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlecontactOptions(`.contact-card-${coordinator.id}`);
                        }}
                      >
                        <KeyboardDoubleArrowLeftIcon
                          style={{
                            width: "20px",
                            height: "20px",
                          }}
                        />
                        Back
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
};

export default contact;
