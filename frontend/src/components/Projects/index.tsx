import { useState, useEffect } from "react";
import "./index.css";

type Project = {
  id: number;
  title: string;
  description: string;
  images?: string[];
  list?: string[];
};

const projects: Project[] = [
  {
    id: 1,
    title: "OurPact",
    description: "Semester-long Group Project for Innovation Processes Class.",
    images: [
        "/project_images/ourpact.png",
        "/project_images/ourpact.png",
        "/project_images/ourpact.png",
      ],
    list: [
        "Worked with a small group over 15 weeks to develop a concept application and business model",
        "Utilized customer profiles, prototyping, and market research",
        "The project culminated in a 10-minute pitch of our idea to a board of venture capitalists",
      ],
  },
  {
    id: 2,
    title: "Marketing Project",
    description: "A React-based weather application with live API data.",
    images: ["/images/weather.png",]
  },
  {
    id: 3,
    title: "Accounting Project",
    description: "A simple task manager built with Firebase for real-time updates.",
    images: ["/images/taskmanager.png"],
  },
  {
    id: 4,
    title: "Economics Project",
    description: "A personal portfolio showcasing my skills and projects.",
    images: ["/images/portfolio.png"],
  },
  {
    id: 5,
    title: "MIRA IQ",
    description: "A React-based weather application with live API data.",
    images: ["/images/weather.png"],
  },
  {
    id: 6,
    title: "MIRA Touch",
    description: "A simple task manager built with Firebase for real-time updates.",
    images: ["/images/taskmanager.png"],
  },
  {
    id: 7,
    title: "Statistics Project",
    description: "A simple task manager built with Firebase for real-time updates.",
    images:[ "/images/taskmanager.png"],
  },
  {
    id: 8,
    title: "Portfolio Websites",
    description: "A simple task manager built with Firebase for real-time updates.",
    images: ["/images/taskmanager.png"],
  },
  {
    id: 9,
    title: "NERTS! - Full Stack Application",
    description: "A simple task manager built with Firebase for real-time updates.",
    images: ["/images/taskmanager.png"],
  },
  {
    id: 10,
    title: "Machine Learning Project",
    description: "A simple task manager built with Firebase for real-time updates.",
    images: ["/images/taskmanager.png"],
  }
];

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = ""; // Re-enable scrolling
    }

    return () => {
      document.body.style.overflow = ""; // Clean up when unmounting
    };
  }, [selectedProject]);

  return (
    <div className="projects-section">
      <div className="projects-grid">
        {projects.map((project) => (
          <div 
            key={project.id} 
            className="project-box" 
            onClick={() => setSelectedProject(project)}
          >
            <h3>{project.title}</h3>
          </div>
        ))}
      </div>

      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedProject(null)}>✖</button>
            <h2>{selectedProject.title}</h2>
            <p>{selectedProject.description}</p>

            {selectedProject.list && (
            <ul>
                {selectedProject.list.map((item, index) => (
                <li key={index}>{item}</li>
                ))}
            </ul>
            )}

{selectedProject.images && (
              <div className="image-gallery">
                {selectedProject.images.map((imgSrc, index) => (
                  <img key={index} src={imgSrc} alt={`${selectedProject.title} ${index + 1}`} />
                ))}
              </div>
            )}  
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
