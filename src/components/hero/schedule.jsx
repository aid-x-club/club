import "./schedule.css";
import React, { useEffect } from "react";

const schedule = () => {
  useEffect(() => {
    const callback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("timelineAnimation");
          document
            .querySelectorAll(".container, .container-mobile")
            .forEach((container) =>
              container.classList.add("timelineAnimationContainer")
            );
        }
      });
    };

    const options = {
      threshold: 0.2,
    };
    const observer = new IntersectionObserver(callback, options);
    const divs = document.querySelectorAll("#timeline");
    divs.forEach((div) => observer.observe(div));
  });
  return (
    <React.Fragment>
      <div className="mainSchedule" id="schedule">
        <div className="parent-schedule">
          <div className="schedule-title">
            <img src="/images/rrr.webp" alt="arrow-logo" />
            Tech Domains
          </div>
          <div className="timeline" id="timeline">
            <div className="container" id="timeline-container">
              <h2 className="date">
                <div>
                  🤖
                  <div>
                    <div>AI</div> <div>&</div>
                  </div>
                </div>
              </h2>
              <h2 className="container-title">Artificial Intelligence & Machine Learning</h2>
              <p className="container-description">
                Master the art of building intelligent systems. Learn model building, predictive analytics, computer vision, and Natural Language Processing (NLP). Work on cutting-edge AI projects and develop skills in deep learning, neural networks, and AI applications across industries.
              </p>
              <span className="circle"></span>
            </div>
            <div className="container ">
              <h2 className="container-title">Data Science & Analytics</h2>
              <h1 className="date">
                <div>
                  📊
                  <div>
                    <div>Data</div> <div>Science</div>
                  </div>
                </div>
              </h1>
              <p className="container-description">
                Transform raw data into actionable insights. Master data cleaning, visualization, dashboard creation, and statistical modeling. Learn to work with big data tools, perform exploratory data analysis, and create data-driven solutions for real-world business problems.
              </p>
              <span className="circle"></span>
            </div>
            <div className="container ">
              <h1 className="date">
                <div>
                  🌐
                  <div>
                    <div>Web</div> <div>Dev</div>
                  </div>
                </div>
              </h1>
              <h2 className="container-title">Web & Mobile Development</h2>
              <p className="container-description">
                Build scalable web and mobile applications. Develop expertise in frontend frameworks (React, Vue, Angular), backend development (Node.js, Python), full-stack applications, REST APIs, and mobile app development. Create responsive, user-friendly applications.
              </p>

              <span className="circle"></span>
            </div>
            <div className="container ">
              <h2 className="container-title">Cloud & DevOps</h2>
              <h1 className="date">
                <div>
                  ☁️
                  <div>
                    <div>Cloud</div> <div>DevOps</div>
                  </div>
                </div>
              </h1>
              <p className="container-description">
                Master cloud deployment and infrastructure automation. Learn cloud platforms (AWS, Azure, GCP), CI/CD pipelines, Docker containerization, Kubernetes, and Infrastructure as Code. Build scalable, reliable systems with modern DevOps practices.
              </p>
              <span className="circle"></span>
            </div>

            <div className="container ">
              <h2 className="container-title">Cybersecurity</h2>
              <h1 className="date">
                <div>
                  🔒
                  <div>
                    <div>Cyber</div> <div>Security</div>
                  </div>
                </div>
              </h1>
              <p className="container-description">
                Secure the digital world. Gain expertise in security awareness, penetration testing, vulnerability assessment, security tools, and best practices. Learn to identify threats, implement defense mechanisms, and protect systems from cyber attacks.
              </p>
              <span className="circle"></span>
            </div>
            <div className="container ">
              <h2 className="container-title">IoT & Automation</h2>
              <h1 className="date">
                <div>
                  🔌
                  <div>
                    <div>IoT</div> <div>Hardware</div>
                  </div>
                </div>
              </h1>
              <p className="container-description">
                Connect the smart world. Work with sensors, embedded systems, and hardware-software integration. Build IoT solutions, automation systems, and smart applications. Learn microcontroller programming and real-time systems development.
              </p>
              <span className="circle"></span>
            </div>
            <div className="container ">
              <h2 className="container-title">UI/UX & Product Design</h2>
              <h1 className="date">
                <div>
                  🎨
                  <div>
                    <div>UI/UX</div> <div>Design</div>
                  </div>
                </div>
              </h1>
              <p className="container-description">
                Design exceptional user experiences. Master wireframing, prototyping, user experience design, and product design principles. Learn design tools, user research, and create interfaces that delight users and solve real problems.
              </p>
              <span className="circle"></span>
            </div>
          </div>
        </div>
      </div>
      <div className="mainSchedule" id="schedule">
        <div className="parent-schedule-mobile">
          <div className="schedule-title-mobile">
            <img src="/images/rrr.webp" alt="arrow-logo" />
            Tech Domains
          </div>
          <div className="timeline-mobile" id="timeline">
            <div className="container-mobile" id="timeline-container">
              <h2 className="container-title-mobile">Artificial Intelligence & Machine Learning</h2>{" "}
              <h2 className="date-mobile">
                <div>
                  🤖
                  <div>
                    <div>AI & ML</div>
                  </div>
                </div>
              </h2>
              <p className="container-description-mobile">
                Master model building, predictive analytics, computer vision, and NLP. Learn deep learning and neural networks for intelligent solutions.
              </p>
              <span className="circle-mobile"></span>
            </div>
            <div className="container-mobile" id="timeline-container">
              <h2 className="container-title-mobile">Data Science & Analytics</h2>
              <h1 className="date-mobile">
                {" "}
                <div>
                  📊
                  <div>
                    <div>Data Science</div>
                  </div>
                </div>
              </h1>
              <p className="container-description-mobile">
                Transform data into insights. Master data cleaning, visualization, dashboards, and statistical modeling for data-driven decisions.
              </p>
              <span className="circle-mobile "></span>
            </div>
            <div className="container-mobile ">
              <h2 className="container-title-mobile">Web & Mobile Development</h2>
              <h1 className="date-mobile">
                <div>
                  🌐
                  <div>
                    <div>Web & Mobile</div>
                  </div>
                </div>
              </h1>
              <p className="container-description-mobile">
                Build frontend, backend, and full-stack applications. Master APIs, responsive design, and mobile development.
              </p>
              <span className="circle-mobile"></span>
            </div>
            <div className="container-mobile">
              <h2 className="container-title-mobile">Cloud & DevOps</h2>
              <h1 className="date-mobile">
                <div>
                  ☁️
                  <div>
                    <div>Cloud & DevOps</div>
                  </div>
                </div>
              </h1>
              <p className="container-description-mobile">
                Master cloud platforms, CI/CD pipelines, Docker, Kubernetes, and infrastructure automation.
              </p>
              <span className="circle-mobile"></span>
            </div>
            <div className="container-mobile ">
              <h2 className="container-title-mobile">Cybersecurity</h2> 
              <h1 className="date-mobile">
                <div>
                  🔒
                  <div>
                    <div>Cybersecurity</div>
                  </div>
                </div>
              </h1>
              <p className="container-description-mobile">
                Learn security awareness, penetration testing, vulnerability assessment, and best practices.
              </p>
              <span className="circle-mobile"></span>
            </div>
            <div className="container-mobile ">
              <h2 className="container-title-mobile">IoT & Automation</h2>
              <h1 className="date-mobile">
                <div>
                  🔌
                  <div>
                    <div>IoT</div>
                  </div>
                </div>
              </h1>
              <p className="container-description-mobile">
                Work with sensors, embedded systems, and hardware-software integration for smart solutions.
              </p>
              <span className="circle-mobile"></span>
            </div>
            <div className="container-mobile ">
              <h2 className="container-title-mobile">UI/UX & Product Design</h2>
              <h1 className="date-mobile">
                <div>
                  🎨
                  <div>
                    <div>UI/UX Design</div>
                  </div>
                </div>
              </h1>
              <p className="container-description-mobile">
                Master wireframing, prototyping, UX design, and product design principles for exceptional experiences.
              </p>
              <span className="circle-mobile"></span>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default schedule;
