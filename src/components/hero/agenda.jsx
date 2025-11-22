import React, { useEffect, useRef, useState } from "react";
import Lottie from "lottie-react";
import "./agenda.css";
import animationData from "../../assets/mic.json";

const section2 = () => {
  useEffect(() => {
    const callback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (entry.target.id == "agenda-left")
            entry.target.classList.add("agendaScrollAnimateLeft");
          if (entry.target.id == "agenda-right")
            entry.target.classList.add("agendaScrollAnimateRight");
        }
      });
    };

    const options = {
      threshold: 0.5,
    };
    const observer = new IntersectionObserver(callback, options);
    const divs = document.querySelectorAll(
      ".about-vision-title,.about-vision-description,.about-mission-title,.about-mission-description"
    );
    divs.forEach((div) => observer.observe(div));
  });

  const ref = useRef();
  return (
    <React.Fragment>
      <div className="section2">
        <div className="agenda" id="agenda">
          <div className="title2">
            <img src="/images/rrr.webp" alt="arrow-logo" />
            <h1 className="title-name">Agenda</h1>
          </div>
          <div className="agenda-text">
            <div className="agenda-lottie-animation">
              <Lottie
                animationData={animationData}
                lottieRef={ref}
                style={{
                  width: "40vw",
                  height: "50vh",
                  scale: "1.3",
                  // background: "red",
                }}
                loop={false}
                onMouseEnter={() => {
                  ref.current.stop();
                  ref.current.setSpeed(0.5);
                  ref.current.play();
                }}
                onMouseLeave={() => ref.current.goToAndStop(1000)}
              />
            </div>
          <div className="agenda-des">
            The AID-X Club (AI & Data Excellence Club) is a student-driven initiative under the Department of Artificial Intelligence & Data Science. We act as the central hub for project building, technical exploration, workshops, hackathons, and student collaboration. Our mission is to empower students to learn, build, and showcase meaningful projects while gaining real-world skills in cutting-edge technologies.
          </div>
          </div>
        </div>
        <div className="parent-vision">
          <div className="vision">
            <div className="about-vision-title " id="agenda-left">
              <img
                src="/images/vision.webp"
                alt="vision-image"
                width="300px"
                className="about-vision-image"
              />
              Vision
            </div>
            <div className="about-vision-description" id="agenda-right">
              To create a strong tech ecosystem inside the college where every student learns by doing, builds practical projects, collaborates with peers, participates in events, and develops industry-ready skills in Artificial Intelligence, Data Science, Web Development, Machine Learning, Cloud & DevOps, Cybersecurity, IoT, and UI/UX Design.
            </div>
          </div>
          <div className="mission">
            <div className="about-mission-title" id="agenda-right">
              <img
                src="/images/target.webp"
                alt="mission-image"
                width={"250px"}
                className="about-mission-image"
              />
              Mission
            </div>
            <div className="about-mission-description" id="agenda-left">
              To empower students to learn, build, and showcase meaningful projects while gaining real-world skills in cutting-edge technologies such as AI, Data Science, Web Development, Machine Learning, and more. We promote project-based learning, conduct workshops and bootcamps, encourage research & innovation, bridge students with industry experts, and build a portfolio-driven culture within our college community.
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default section2;
