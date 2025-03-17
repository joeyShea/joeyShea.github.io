import { useState, useEffect } from "react";
import "./index.css";

type Project = {
  id: number;
  title: string;
  description: string;
  images?: string[];
  list?: string[];
  technologies?: { name: string; logo: string }[];
  category: string;
};

const projects: Project[] = [
  {
    id: 1,
    title: "NERTS!",
    description: "Full-stack web application developed with a team of four",
    list: [
      "Designed and wireframed application with Figma",
      "Created accessable and user-friendly frontend with React",
      "Added backend multiplayer functionality with Node.js and Socket.io",
    ],
    technologies: [
      { name: "Figma", logo: "/icons/figma.svg" },
      { name: "React", logo: "/icons/react.svg" },
      { name: "Node.js", logo: "/icons/node.svg" },
      { name: "HTML", logo: "/icons/html.svg" },
      { name: "CSS", logo: "/icons/css.svg" },
      { name: "Socket", logo: "/icons/socketio.svg" },
      { name: "Git", logo: "/icons/git.svg" },
    ],
    category: "Software Engineering"
  },
  {
    id: 2,
    title: "OurPact",
    description: "Semester-long Group Project for Innovation Processes Class.",
    images: ["/project_images/ourpact.png", "/project_images/ourpact2.png"],
    list: [
      "Worked with a small group over 15 weeks to develop a concept application and business model",
      "Utilized customer profiles, prototyping, and market research",
      "The project culminated in a 10-minute pitch of our idea to a board of venture capitalists",
    ],
    technologies: [
      { name: "Figma", logo: "/icons/figma.svg" }
    ],
    category: "Software Engineering"
  },
  {
    id: 3,
    title: "Sports Modeling",
    description: "Semester-long group project for Machine Learning Class",
    list: [
      "Worked with a team to gather historical data about NBA statistics",
      "In the process of building a machine learning model to predict future outcomes"
    ],
    technologies: [
      { name: "Python", logo: "/icons/python.svg" },
      { name: "Pytorch", logo: "/icons/pytorch.svg" },
      { name: "Git", logo: "/icons/git.svg" },
    ],
    category: "Statistics & ML"
  },
  {
    id: 4,
    title: "Data Analysis",
    description: "Semester-long Pair Project for Statistics Class",
    list: [
      "Worked with a partner to collect data about campus gym usage",
      "Conducted a survey to gather qualitative data for corroboration",
      "Created a report about our findings with matplotlib visuals"
    ],
    technologies: [
      { name: "Python", logo: "/icons/python.svg" },
      { name: "Excel", logo: "/icons/excel.svg" }
    ],
    category: "Statistics & ML"
  },
  {
    id: 5,
    title: "Clarify",
    description: "Semester-long Group Project for Marketing Class",
    list: [
      "Worked with a small group over 15 weeks to develop a concept product and business model.",
      "Utilized customer profiles, market research, and marketing strategies."
    ],
    technologies: [
      { name: "Figma", logo: "/icons/figma.svg" },
      { name: "Canva", logo: "/icons/canva.svg" },
    ],
    category: "Business"
  },
  {
    id: 6,
    title: "Roblox vs. EA",
    description: "Semester-long Group Project for Accounting Class",
    list: [
      "Performed an in-depth analysis of the financial statements of two companies",
      "Compiled a comprehensive report comparing the two",
    ],
    technologies: [
      { name: "Excel", logo: "/icons/excel.svg" }
    ],
    category: "Business"
  },
  {
    id: 7,
    title: "Opportunity Atlas",
    description: "Semester-long Group Project for Economics Class",
    list: [
      "Analyzed large-scale, real-world data about income in the United States.",
    ],
    technologies: [
      { name: "Python", logo: "/icons/python.svg" },
      { name: "R", logo: "/icons/r.svg" },
    ],
    category: "Business"
  },
  {
    id: 8,
    title: "Portfolio Websites",
    description: "Created multiple portfolio websites",
    list: [
      "Developed multiple static portfolio websites for myself and others",
      "Used both vanilla HTML/CSS/JS and React, hosted on Github Pages",
    ],
    technologies: [
      { name: "React", logo: "/icons/react.svg" },
      { name: "Github", logo: "/icons/github.svg" },
    ],
    category: "Software Engineering"
  }
];

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<Project>(projects[0]);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  // Group projects by category
  const groupedProjects = projects.reduce((acc, project) => {
    if (!acc[project.category]) {
      acc[project.category] = [];
    }
    acc[project.category].push(project);
    return acc;
  }, {} as Record<string, Project[]>);

  const handleImageClick = (image: string) => {
    setExpandedImage(image);
  };

  useEffect(() => {
    if (expandedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [expandedImage]);
  
  const closeModal = () => {
    setExpandedImage(null);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };
  
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="projects-section">
      <div className="projects-selector">
        {Object.entries(groupedProjects).map(([category, projects]) => (
          <div key={category} className="category">
            <div className="category-title">{category}</div>
            {projects.map((project) => (
              <div
                key={project.id}
                className={`project-title ${selectedProject.id === project.id ? "active" : ""}`}
                onClick={() => setSelectedProject(project)}
              >
                {project.title}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="project-details">
        <h2>{selectedProject.title}</h2>
        <p>{selectedProject.description}</p>
        {selectedProject.list && (
          <ul>
            {selectedProject.list.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}
        <div className="tech-list">
          {selectedProject.technologies?.map((tech, index) => (
            <div key={index} className="tech-box">
              <img src={tech.logo} alt={tech.name} />
              <span>{tech.name}</span>
            </div>
          ))}
        </div>
        {/* Image Gallery */}
        {selectedProject.images && selectedProject.images.length > 0 && (
          <>
            <h2>Images:</h2>
            <div className="image-gallery">
              {selectedProject.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Project ${selectedProject.title} image ${index + 1}`}
                  className="image-preview"
                  onClick={() => handleImageClick(image)}
                />
              ))}
            </div>
          </>
        )}

        {/* Full-screen Image Modal */}
        {expandedImage && (
        <div className="image-modal" onClick={closeModal}>
            <img src={expandedImage} alt="Expanded preview" className="expanded-image" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
