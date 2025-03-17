import "./index.css"
import raikes from "../../assets/images/dslogo.png"

const Education = () => {
    return (
    <>
        <div className="education">
            <div className="raikes">
                <img src={raikes} alt="Raikes school logo" />
                <div className="text">
                    <h3>Jeffrey S. Raikes School of Computer Science and Management</h3>
                    <p>- The Raikes School is an interdisciplinary program at the University of Nebraska-Lincoln. <br></br>
                        - It offers a unique curriculum that combines advanced computer science and business management 
                        courses. <br></br>
                        - I've been exposed to many important 
                        business topics, as well as leadership and teamwork exercises.</p>
                </div>
            </div>
        </div>
    </>
    )
};

export default Education;