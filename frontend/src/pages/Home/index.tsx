import "./index.css"

// Components
import MenuButton from "../../components/MenuButton";
import About from "../../components/About";
import Contact from "../../components/Contact";
import Experience from "../../components/Experience";
import Education from "../../components/Education";
import Projects from "../../components/Projects";
import SineWave from "../../components/SineWave";

const Home = () => {
  const pages = [
    { name: "About Me", path: "about" },
    { name: "Experience", path: "experience" },
    { name: "Education", path: "education" },
    { name: "Projects", path: "projects" },
    { name: "Contact", path: "contact" },
  ];

    return (
      <>
        <div className="banner">
          🚧 This is a new portfolio, it's a work in progress! 🚧
        </div>

        <div className="head-section">
          <div className="home-info">
            <h1 className="my-name">JOEY <span>SHEA</span></h1>
            <h2 className="summary">Computer & Data Science Student at the Raikes School of UNL</h2>
          </div>
          <MenuButton pages={pages}/>
        </div>
        <SineWave/>

        <div className="spacer"></div>

        <section id="about">About</section>
        <About/>
        <section id="experience">Experience</section>
        <Experience/>
        <section id="education">Education</section>
        <Education/>
        <section id="projects">Projects</section>
        <Projects/>
        <section id="contact">Contact</section>
        <Contact/>
      </>
    );
  };
  
export default Home;