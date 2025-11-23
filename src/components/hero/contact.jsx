import React from "react";
import { FlipCard } from "./flip-card";
import "./contact.css";

const contact = () => {
  const coordinators = [
    // Row 1
    {
      id: 1,
      name: "Chandrika Sruthi",
      title: "AID-X Coordinator",
      bio: "Full-stack developer passionate about building innovative solutions",
      image: "/images/s/Manepalli Chandrika sruthi.jpg",
      socialLinks: {
        email: "chandrikasruthimanepalli@gmail.com",
        github: "https://github.com/chinna3206/",
        linkedin: "https://www.linkedin.com/in/chandrikasruthi",
      },
    },
    {
      id: 2,
      name: "Srikanth Reddy",
      title: "AID-X Coordinator",
      bio: "Tech enthusiast with expertise in web development",
      image: "/images/s/Srikanth.jpg",
      socialLinks: {
        email: "srikanthreddyybokka@gmail.com",
        github: "https://github.com/Srikanth2448",
        linkedin: "https://www.linkedin.com/in/srikanth-reddy-1499b6278",
      },
    },
    {
      id: 3,
      name: "Deepna Kummari",
      title: "AID-X Coordinator",
      bio: "Dedicated to fostering innovation and collaboration",
      image: "/images/s/Deepna.jpg",
      socialLinks: {
        email: "kummarik.deepna@gmail.com",
        github: "https://github.com/deepnashalivahana",
        linkedin: "https://www.linkedin.com/in/deepna-kummari-210758339",
      },
    },
    {
      id: 4,
      name: "Obadya Sinjin",
      title: "AID-X Coordinator",
      bio: "Creative problem-solver and community builder",
      image: "/images/s/Obadya Sinjin.jpg",
      socialLinks: {
        email: "sinjinobadya@gmail.com",
        github: "https://github.com/obadyasinjin",
        linkedin: "https://www.linkedin.com/in/osinjin?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      },
    },
    // Row 2
    {
      id: 5,
      name: "Shubham Gundu",
      title: "AID-X Coordinator",
      bio: "Open-source advocate and software engineer",
      image: "/images/s/shubham.webp",
      socialLinks: {
        email: "shubhamvasantgundu@gmail.com",
        github: "https://GitHub.com/theshubhamgundu",
        linkedin: "https://www.linkedin.com/in/shubhamgundu",
      },
    },
    {
      id: 6,
      name: "Anil Chiranjeeth",
      title: "AID-X Coordinator",
      bio: "Full-stack developer with a passion for mentoring",
      image: "/images/s/anil.jpg",
      socialLinks: {
        email: "anilmarneni30@gmail.com",
        github: "https://github.com/AnilMarneni",
        linkedin: "https://www.linkedin.com/in/anil-marneni",
      },
    },
    {
      id: 7,
      name: "Jhansi Laxmi",
      title: "AID-X Coordinator",
      bio: "Backend specialist and aspiring tech leader",
      image: "/images/s/JHANSI LAXMI NADIMINTI.jpg",
      socialLinks: {
        email: "jhansilaxmi3006@gmail.com",
        github: "https://github.com/Jhansi473006",
        linkedin: "https://www.linkedin.com/in/jhansi-laxmi-nadiminti",
      },
    },
    {
      id: 8,
      name: " Bhava Pravallika",
      title: "AID-X Coordinator",
      bio: "Frontend expert with eye for design",
      image: "/images/s/Bhava Pravallika.jpg",
      socialLinks: {
        email: "bhavapravallika05@gmail.com",
        github: "https://github.com/BhavaPravallika",
        linkedin: "https://www.linkedin.com/in/bhava-pravallika",
      },
    },
    // Row 3
    {
      id: 9,
      name: "Deekshitha",
      title: "AID-X Coordinator",
      bio: "Cloud enthusiast and DevOps practitioner",
      image: "/images/s/deekshitha.jpg",
      socialLinks: {
        email: "Kndeekshitha07@gmail.com",
        github: "https://github.com/deekshitha-chowdary",
        linkedin: "https://www.linkedin.com/in/deekshitha-chowdary-a68542326?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      },
    },
    {
      id: 10,
      name: "Hamsika",
      title: "AID-X Coordinator",
      bio: "Data-driven developer passionate about AI/ML",
      image: "/images/s/hamsika.jpg",
      socialLinks: {
        email: "hamsikavalaboju@gmail.com",
        github: "https://github.com/hamsikavalaboju",
        linkedin: "https://www.linkedin.com/in/hamsika-valaboju-b8a607387/",
      },
    },
    {
      id: 11,
      name: "Prajith Reddy",
      title: "AID-X Coordinator",
      bio: "Mobile app developer and tech speaker",
      image: "/images/s/Prajith reddy.jpg",
      socialLinks: {
        email: "prajithbinnu@gmail.com",
        github: "https://github.com/prajith48",
        linkedin: "https://www.linkedin.com/in/konakalla-prajith-reddy-7367192b4?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      },
    },
    {
      id: 12,
      name: "Shashanth",
      title: "AID-X Coordinator",
      bio: "Systems engineer with interest in cybersecurity",
      image: "/images/s/Shashanth.jpg",
      socialLinks: {
        email: "samalashashanth@gmail.com",
        github: "https://github.com/ShashanthSamala",
        linkedin: "https://www.linkedin.com/in/samala-shashanth-87962a283?utm_source=share_via&utm_content=profile&utm_medium=member_android",
      },
    },
  ];

  return (
    <React.Fragment>
      <div id="contact" className="parent-contact">
        <div className="contact-title">
          <img src="/images/rrr.webp" alt="arrow-logo" />
          Student Coordinators
        </div>
        <div className="parent-container">
          {coordinators.map((coordinator) => (
            <FlipCard key={coordinator.id} data={coordinator} />
          ))}
        </div>
      </div>
    </React.Fragment>
  );
};

export default contact;
