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
        <h1 className="my-name">JOEY SHEA</h1>
        <MenuButton pages={pages}/>
      </>
    );
  };
  
export default Home;