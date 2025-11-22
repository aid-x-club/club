import React, { useEffect } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import "./faqs.css";
import ReactGA from "react-ga";

const faqs = () => {
  const handleArrow = (element) => {
    ReactGA.event({
      category: "Button",
      action: "click",
      label: "FAQs",
    });
    const elementVisible = element.currentTarget.querySelector(
      ".faqs-content-description"
    );
    const arrow = element.currentTarget.querySelector(".faqs-arrow");

    elementVisible.classList.toggle("faq-visible");
    arrow.classList.toggle("arrow-transform");
  };

  const styles = {
    container: {
      position: "relative",
      zIndex: "-1",
      fontSize: "2.5vw",
      transition: "all 0.3s linear",
      cursor: "pointer",
    },
  };

  if (window.innerWidth <= 768) {
    styles.container = {
      ...styles.container,
      fontSize: "5vw",
    };
  }

  return (
    <React.Fragment>
      <div id="faqs" className="parent-faqs">
        <h1 className="faqs-title">
          <img src="/images/rrr.webp" alt="arrow-logo" />
          FAQs
        </h1>

        <div className="faqs-section">
          <div className="faqs-content" onClick={handleArrow}>
            <h1 className="faqs-content-title">What is AID-X Club?<ChevronRightIcon style={styles.container} className="faqs-arrow" /></h1>
            <p className="faqs-content-description">AID-X Club is a student-driven initiative for AI, Data Science, and modern technologies. We provide a platform for learning, building projects, and networking with peers and industry experts.</p>
          </div>

          <div className="faqs-content" onClick={handleArrow}>
            <h1 className="faqs-content-title">Who can join?<ChevronRightIcon style={styles.container} className="faqs-arrow" /></h1>
            <p className="faqs-content-description">All undergraduate and postgraduate students interested in our tech domains are welcome. No prerequisites required!</p>
          </div>

          <div className="faqs-content" onClick={handleArrow}>
            <h1 className="faqs-content-title">What activities does the club organize?<ChevronRightIcon style={styles.container} className="faqs-arrow" /></h1>
            <p className="faqs-content-description">We organize workshops, bootcamps, coding competitions, project showcases, guest lectures from industry experts, and hands-on project building across our seven tech domains.</p>
          </div>

          <div className="faqs-content" onClick={handleArrow}>
            <h1 className="faqs-content-title">Is there a membership fee?<ChevronRightIcon style={styles.container} className="faqs-arrow" /></h1>
            <p className="faqs-content-description">No, joining AID-X Club is completely free! We encourage all interested students to participate.</p>
          </div>

          <div className="faqs-content" onClick={handleArrow}>
            <h1 className="faqs-content-title">How do I stay updated?<ChevronRightIcon style={styles.container} className="faqs-arrow" /></h1>
            <p className="faqs-content-description">Follow us on Instagram @aid_x.club and LinkedIn. Fill out the "Join Club" form to subscribe to our newsletter.</p>
          </div>

          <div className="faqs-content" onClick={handleArrow}>
            <h1 className="faqs-content-title">What are the 7 Tech Domains?<ChevronRightIcon style={styles.container} className="faqs-arrow" /></h1>
            <p className="faqs-content-description">AI & Machine Learning, Data Science & Analytics, Web & Mobile Development, Cloud & DevOps, Cybersecurity, IoT & Automation, and UI/UX Design.</p>
          </div>

          <div className="faqs-content" onClick={handleArrow}>
            <h1 className="faqs-content-title">How do I participate in projects?<ChevronRightIcon style={styles.container} className="faqs-arrow" /></h1>
            <p className="faqs-content-description">Join the club and attend our events! We share information about ongoing projects that match your interests and skill level.</p>
          </div>

          <div className="faqs-content" onClick={handleArrow}>
            <h1 className="faqs-content-title">Can I become a coordinator?<ChevronRightIcon style={styles.container} className="faqs-arrow" /></h1>
            <p className="faqs-content-description">Yes! Active members with technical skills and leadership can become coordinators. Check our Team section for current coordinators.</p>
          </div>

          <div className="faqs-content" onClick={handleArrow}>
            <h1 className="faqs-content-title">What are the benefits?<ChevronRightIcon style={styles.container} className="faqs-arrow" /></h1>
            <p className="faqs-content-description">Practical knowledge, portfolio building, GitHub skills, networking, certificates, industry connections, and career opportunities!</p>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default faqs;
