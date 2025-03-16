import "./index.css"

// Components
import MenuButton from "../../components/MenuButton";

const Home = () => {
    const pages = [
      { name: "About Me", path: "/about" },
      { name: "Education", path: "/education" },
      { name: "Projects", path: "/projects" },
      { name: "Contact", path: "/contact" },
    ];

    return (
      <>
      <div className="home-info">
        <h1 className="my-name">JOEY <span>SHEA</span></h1>
        <h2 className="summary">Computer & Data Science Student at the Raikes School of UNL</h2>
      </div>
        <MenuButton pages={pages}/>
      </>
    );
  };
  
export default Home;