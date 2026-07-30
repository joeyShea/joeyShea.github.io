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
          draggable={false}
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
            My fascination with technology led me to the{" "}
            <a href="https://raikes.unl.edu/" target="_blank" rel="noopener noreferrer">
              Raikes School
            </a>{" "}
            of Computer Science &amp; Management at UNL.
          </li>
          <li>Now entering my senior year (the last three flew by).</li>
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
