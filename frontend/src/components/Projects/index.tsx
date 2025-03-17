import { useState } from "react";
import "./index.css";

type Project = {
  id: number;
  title: string;
  description: string;
  images?: string[];
  list?: string[];
  technologies?: { name: string; logo: string }[];
};

const projects: Project[] = [
  {
    id: 1,
    title: "OurPact",
    description: "Semester-long Group Project for Innovation Processes Class.",
    images: ["/project_images/ourpact.png", "/project_images/ourpact2.png"],
    list: [
      "Worked with a small group over 15 weeks to develop a concept application and business model",
      "Utilized customer profiles, prototyping, and market research",
      "The project culminated in a 10-minute pitch of our idea to a board of venture capitalists",
    ],
    technologies: [
      { name: "Figma", logo: "/icons/figma.svg" },
      { name: "React", logo: "/icons/js.svg" },
    ],
  },
  {
    id: 2,
    title: "Clarify",
    description: "Semester-long Group Project for Marketing Class",
    images: ["/project_images/clarify.png"],
    list: [
      "Worked with a small group over 15 weeks to develop a concept product and business model.",
      "Utilized customer profiles, market research, and marketing strategies."
    ],
    technologies: [
      { name: "Python", logo: "/icons/js.svg" },
      { name: "Flask", logo: "/icons/js.svg" },
    ],
  },
];

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<Project>(projects[0]);

  return (
    <div className="projects-section">
      <div className="projects-selector">
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
      </div>
    </div>
  );
};

export default Projects;
