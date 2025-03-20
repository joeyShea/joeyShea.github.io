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
                    <ul>
                        <li>The Raikes School is an interdisciplinary program at the University of Nebraska-Lincoln</li>
                        <li>It offers a unique curriculum that combines advanced computer science and business management 
                        courses</li>
                        <li>I've been exposed to many important 
                        business topics, as well as leadership and teamwork exercises</li>
                    </ul>
                </div>
            </div>

            {/* Download Buttons */}
            <div className="download-buttons">
            <a href="/documents/js_transcript.pdf" target="_blank" className="download-btn incButton">View Transcript</a>
            <a href="/documents/js_resume.pdf" target="_blank" className="download-btn incButton">View Resume</a>
            </div>
        </div>
    </>
    )
};

export default Education;