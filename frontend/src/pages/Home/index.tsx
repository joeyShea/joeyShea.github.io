import "./index.css"

// Components
import MenuButton from "../../components/MenuButton";

const Home = () => {
  const pages = [
    { name: "About Me", path: "about" },
    { name: "Education", path: "education" },
    { name: "Projects", path: "projects" },
    { name: "Contact", path: "contact" },
  ];

    return (
      <>
        <div className="banner">
          🚧 I'm in the process of completely recreating my portfolio! 🚧
        </div>

        <div className="head-section">
          <div className="home-info">
            <h1 className="my-name">JOEY <span>SHEA</span></h1>
            <h2 className="summary">Computer & Data Science Student at the Raikes School of UNL</h2>
          </div>
          <MenuButton pages={pages}/>
        </div>

        <section id="about">About</section>
        <section id="education">Education</section>
        <section id="projects">Projects</section>
        <section id="contact">Contact</section>
      </>
    );
  };
  
export default Home;