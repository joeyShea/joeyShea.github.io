import "./index.css";
import Me from "../../assets/images/profile.webp";

const strengths = ["Harmony", "Intellection", "Analytical", "Relator", "Futuristic"];

const About = () => {
  return (
    <div className="about">
      <div className="about-photo">
        <img
          className="me-photo"
          src={Me}
          alt="Portrait of Joey Shea"
          width={800}
          height={800}
          decoding="async"
        />
      </div>

      <div className="about-body">
        <p className="about-lead">
          I'm a Computer Science &amp; Data Science student at the Raikes School and a
          SWE intern at Garmin. I like turning my ideas into real, working software.
        </p>

        <ul className="about-facts">
          <li>
            Grew up in a{" "}
            <a href="https://en.wikipedia.org/wiki/Wamego,_Kansas" target="_blank" rel="noopener noreferrer">
              small town
            </a>{" "}
            in Kansas.
          </li>
          <li>
            A fascination with technology led me to the{" "}
            <a href="https://raikes.unl.edu/" target="_blank" rel="noopener noreferrer">
              Raikes School
            </a>{" "}
            of Computer Science &amp; Management at UNL.
          </li>
          <li>Now entering my senior year, building agentic and LLM-powered tools on my capstone and on the side.</li>
          <li>Happiest contributing to real projects and learning as I go.</li>
        </ul>

        <div className="about-block">
          <p className="eyebrow">CliftonStrengths</p>
          <div className="tech-row">
            {strengths.map((s) => (
              <span key={s} className="tech-chip strength-chip">{s}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
