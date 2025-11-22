import React, { useEffect } from "react";
import ReactGA from "react-ga";
import "./about.css";

const about = () => {
  const handleWebClicks = (webLink) => {
    ReactGA.event({
      category: "Button",
      action: "click",
      label: webLink,
    });
    window.open(webLink);
  };
  useEffect(() => {
    document.title = "About Us";
    const observer = new IntersectionObserver(
      (entryies) => {
        entryies.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.id == "about-left")
              entry.target.classList.add("aboutScrollAnimateLeft");
            if (entry.target.id == "about-right")
              entry.target.classList.add("aboutScrollAnimateRight");
          }
        });
      },
      {
        threshold: 1,
      }
    );
    const divs = document.querySelectorAll(
      ".foundation-title,.foundation-description,.about-srmvec-title,.about-srmvec-description,.about-csi-title,.about-csi-description,.about-whitehatians-title,.about-whitehatians-description"
    );
    divs.forEach((div) => observer.observe(div));
  });

  return (
    <React.Fragment>
      <div id="about" className="parent-about">
        <h1 className="about-title">About Us</h1>
        <div className="foundation">
          <div className="foundation-title " id="about-right">
            <img
              src="/images/srm.webp"
              alt="vignan logo"
              className="about-srm-logo"
            />
            Vignan Institute of Technology and Science
            <img
              src="/images/srmvec.webp"
              alt="vignan logo"
              className="about-srmvec-logo"
            />
          </div>
          <div className="foundation-description" id="about-left">
            Vignan Institute of Technology and Science (VITS), located in Hyderabad, is a premier engineering institution committed to providing quality education and fostering innovation. The institute is dedicated to developing skilled professionals equipped with cutting-edge technical knowledge and practical expertise. With a focus on Artificial Intelligence and Data Science, VITS provides a platform for students to excel in modern technologies and contribute to technological advancement.
          </div>
        </div>

        <div className="srmvec">
          <div
            className="about-srmvec-title "
            id="about-left"
            onClick={() => handleWebClicks("https://www.vignan.ac.in")}
          >
            <img
              className="about-srmvec-logo"
              src="/images/srmvec.webp"
              alt="vignan logo"
            />
            About Vignan Institute
          </div>
          <div className="about-srmvec-description" id="about-right">
            Vignan Institute of Technology and Science is a modern engineering institution recognized for its commitment to academic excellence and innovation. The institute features state-of-the-art infrastructure, experienced faculty, and industry-aligned curriculum. The Department of Artificial Intelligence & Data Science is at the forefront of technological education, providing students with hands-on experience in AI, machine learning, data science, and emerging technologies that shape the future of the tech industry.
          </div>
        </div>
        <div className="csi">
          <div
            className="about-csi-title"
            id="about-right"
            onClick={() => handleWebClicks("https://www.vignan.ac.in")}
          >
            <img
              className="about-csi-logo"
              src="/images/csi1.webp"
              alt="vignan logo"
            />
            Our Activities
          </div>
          <div className="about-csi-description" id="about-left">
            AID-X Club organizes a diverse range of activities including technical workshops and bootcamps, hackathons and coding competitions, project showcases, guest lectures from industry experts, community learning sessions, GitHub and open-source awareness programs, and certification courses. Members participate in hands-on project building, team collaborations, industry exposures, and recognition programs. We focus on seven key technology domains: AI & Machine Learning, Data Science & Analytics, Web Development, Cloud & DevOps, Cybersecurity, IoT & Automation, and UI/UX Design.
          </div>
        </div>
        <div className="whitehatians">
          <div
            className="about-whitehatians-title"
            id="about-left"
            onClick={() => handleWebClicks("https://www.srmvalliammai.ac.in")}
          >
            <img
              className="about-whitehatians-logo"
              src="/images/whitehatians.webp"
              alt="whitehatians logo"
            />
            Student Benefits
          </div>
          <div className="about-whitehatians-description" id="about-right">
            AID-X Club members gain access to practical technical knowledge through hands-on sessions, develop project portfolios useful for internships and placements, learn GitHub and version control workflows, develop teamwork & communication skills, access mentors & industry experts, earn certificates and recognition, and become eligible for coordinator roles in future events. We provide a supportive community where students can learn from peers, build meaningful projects, and prepare for successful tech careers.
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default about;
