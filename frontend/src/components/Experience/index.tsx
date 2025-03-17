import "./index.css";

const Experience = () => {
    const experiences = [
        {
          title: "Software Intern",
          company: "Virtual Incision Corporation",
          date: "May 2024 - March 2025",
          points: [
            "Replicated a physical system to aid in training scenarios",
            "Followed protocol to test surgical robot hardware and mobile app APIs",
          ],
          technologies: [
            { name: "JS", logo: "/icons/js.svg" },
            { name: "HTML", logo: "/icons/html.svg" },
            { name: "CSS", logo: "/icons/css.svg" }
          ],
        },
        {
          title: "Teaching Assistant",
          company: "Raikes School Summer Camp",
          date: "July 2024",
          points: [
            "Taught and supervised 50+ high school seniors for two weeks for a Computer Science summer camp",
            "Taught beginner/advanced programming lessons daily",
            "Led campers through company tours, leadership and teamwork exercises, and other activities",
          ],
          technologies: [
            { name: "Python", logo: "/icons/python.svg" },
            { name: "Java", logo: "/icons/java.svg" },
          ],
        },
      ];
      

  return (
<div className="experience">
  <div className="experience-list">
    {experiences.map((exp, index) => (
      <div key={index} className="experience-item">
        <div className="timeline-line"></div>
        <div className="experience-content">
          <h3 className="title">{exp.title}</h3>
          <p className="company">{exp.company}</p>
          <p className="date">{exp.date}</p>
          <ul>
            {exp.points.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </div>

        {/* Technology Stack Inside the Box */}
        <div className="tech-stack">
            {exp.technologies.map((tech, i) => (
                <div key={i} className="tech-box">
                <img src={tech.logo} alt={tech.name} className="tech-logo" />
                <span className="tech-name">{tech.name}</span>
                </div>
            ))}
        </div>
      </div>
    ))}
  </div>
</div>

  );
};

export default Experience;
