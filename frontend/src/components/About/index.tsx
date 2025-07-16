import "./index.css";
import Me from "../../assets/images/profile.png"

const About = () => {
    return (
        <>  
        <div className="about">
            <img className="me-photo" src={Me} alt="A photo of me!" />
            <ul className="text">
                <li>I grew up in a <a href="https://en.wikipedia.org/wiki/Wamego,_Kansas" target="_blank">small town</a> in Kansas</li>
                <li>My facination with technology led me to the <a href="https://raikes.unl.edu/" target="_blank">Raikes School</a> of Computer Science and Management at UNL</li>
                <li>I'm now entering my Junior year, and am very enthusiastic to continue my coursework and internship</li>
                <li>I love to learn and contribute to real projects</li>
                
                <br></br><b>Clifton-Strengths:</b><br></br> Harmony · Intellection · Analytical · Relator · Futuristic
            </ul>
        </div>
        </>
    )
};

export default About;