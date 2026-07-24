import "./index.css";

type Experience = {
  title: string;
  company: string;
  location: string;
  date: string;
  current?: boolean;
  points: string[];
  tech: string[];
};

const TECH_ICONS: Record<string, string> = {
  Python: "/icons/python.svg",
  React: "/icons/react.svg",
  TypeScript: "/icons/ts.svg",
  JavaScript: "/icons/js.svg",
  HTML: "/icons/html.svg",
  CSS: "/icons/css.svg",
  Java: "/icons/java.svg",
};

const experiences: Experience[] = [
  {
    title: "Software Engineering Intern",
    company: "Garmin",
    location: "Olathe, KS",
    date: "May 2026 – Present",
    current: true,
    points: [
      "Built a cloud-infrastructure reconciliation engine that identifies orphaned resources across the platform and improves overall visibility.",
      "Refactored OpenStack provider layer into a structured, typed API, replacing raw SDK object usage to improve reliability for Temporal-based workflows.",
    ],
    tech: ["Temporal", "Spring Boot", "Python", "Pydantic"],
  },
  {
    title: "RAIK 183H Teaching Assistant",
    company: "University of Nebraska–Lincoln",
    location: "Lincoln, NE",
    date: "Present",
    current: true,
    points: [
      "Support instruction of programming fundamentals in Java for first-year computer science students.",
    ],
    tech: ["Java"],
  },
  {
    title: "Software Engineering Intern",
    company: "Hudl",
    location: "Lincoln, NE",
    date: "May 2025 – Sept 2025",
    points: [
      "Developed and deployed features across web and mobile — user data-control functionality, action logging, and bug fixes.",
      "Worked in Agile: weekly sprint ceremonies, frequent code reviews, and business-unit reviews.",
    ],
    tech: ["React", "TypeScript", "Snowplow"],
  },
  {
    title: "Software Intern",
    company: "Virtual Incision",
    location: "Lincoln, NE",
    date: "May 2024 – April 2025",
    points: [
      "Built a web app for testing and prototyping surgical-console UI.",
      "Tested surgical-robot hardware and mobile APIs, helping resolve critical issues before product launch.",
    ],
    tech: ["JavaScript", "HTML", "CSS"],
  },
  {
    title: "Teaching Assistant",
    company: "Raikes School Summer Camp",
    location: "Lincoln, NE",
    date: "2024 – 2025",
    points: [
      "Taught and assisted 50+ high-school students with Java and Python lessons.",
      "Led company tours, leadership and teamwork exercises, and daily camp activities.",
    ],
    tech: ["Python", "Java"],
  },
];

const Experience = () => {
  return (
    <div className="experience">
      <ol className="exp-list">
        {experiences.map((exp, index) => (
          <li key={index} className={`exp-item ${exp.current ? "current" : ""}`}>
            <div className="exp-card">
              <div className="exp-head">
                <div>
                  <h3 className="exp-title">{exp.title}</h3>
                  <p className="exp-company">
                    {exp.company}
                    <span className="exp-loc"> · {exp.location}</span>
                  </p>
                </div>
                <div className="exp-date-wrap">
                  {exp.current && <span className="exp-current">Current</span>}
                  <span className="exp-date">{exp.date}</span>
                </div>
              </div>

              <ul className="exp-points">
                {exp.points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>

              <div className="tech-row exp-tech">
                {exp.tech.map((name) => (
                  <span key={name} className="tech-chip">
                    {TECH_ICONS[name] && <img src={TECH_ICONS[name]} alt="" aria-hidden="true" />}
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Experience;
