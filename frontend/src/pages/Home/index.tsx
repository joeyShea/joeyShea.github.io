import "./index.css"

// Components
import MenuButton from "../../components/MenuButton";

const Home = () => {
    const pages = [
      { name: "Home", path: "/" },
      { name: "About Me", path: "/aboutme" },
      { name: "Projects", path: "/projects" },
      { name: "Contact", path: "/contact" },
      { name: "Brah", path: "/education" },
    ];

    return (
      <>
        <h1 className="my-name">JOEY SHEA</h1>

        <MenuButton pages={pages}/>
      </>
    );
  };
  
export default Home;