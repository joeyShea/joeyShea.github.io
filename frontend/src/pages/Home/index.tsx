import "./index.css";

// Components
import MenuButton from "../../components/MenuButton";
import About from "../../components/About";
import Contact from "../../components/Contact";
import Experience from "../../components/Experience";
import Education from "../../components/Education";
import Projects from "../../components/Projects";
import Hobbies from "../../components/Hobbies";
import SineWave from "../../components/SineWave";

type SectionDef = {
  id: string;
  label: string;
  kicker: string;
  Component: React.ComponentType;
};

const sections: SectionDef[] = [
  { id: "about", label: "About", kicker: "Who I am", Component: About },
  { id: "experience", label: "Experience", kicker: "Where I've worked", Component: Experience },
  { id: "projects", label: "Projects", kicker: "What I've built", Component: Projects },
  { id: "education", label: "Education", kicker: "What I study", Component: Education },
  { id: "hobbies", label: "Hobbies", kicker: "Off the clock", Component: Hobbies },
  { id: "contact", label: "Contact", kicker: "Say hello", Component: Contact },
];

const Home = () => {
  const pages = sections.map((s) => ({ name: s.label, path: s.id }));

  return (
    <>
      <div className="hero">
        <header className="head-section">
          <div className="home-info">
            <h1 className="my-name">JOEY <span>SHEA</span></h1>
            <h2 className="summary">
              Computer Science &amp; Data Science · The Raikes School, UNL
            </h2>
            <p className="hero-role">
              <span className="dot" aria-hidden="true"></span>
              Software Engineering Intern @ Garmin
            </p>
          </div>
          <MenuButton pages={pages} />
        </header>

        <SineWave />
      </div>

      <main>
        {sections.map((s, i) => {
          const { id, label, kicker, Component } = s;
          return (
            <section id={id} key={id} className="section" aria-labelledby={`${id}-title`}>
              <div className="section-head">
                <p className="eyebrow section-index">
                  <span className="section-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="section-kicker">{kicker}</span>
                </p>
                <h2 id={`${id}-title`} className="section-title">{label}</h2>
              </div>
              <Component />
            </section>
          );
        })}
      </main>
    </>
  );
};

export default Home;
