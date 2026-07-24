import "./index.css";
import raikes from "../../assets/images/dslogo.webp";

const honors = [
  "Chancellor's Scholarship",
  "Dean's List — 6 semesters",
  "Mortar Board (Black Masque)",
  "Public Anthropology Essay Award",
];

const Education = () => {
  return (
    <div className="education">
      <div className="edu-card">
        <div className="edu-header">
          <div className="edu-logo">
            <img src={raikes} alt="Raikes School logo" width={520} height={468} decoding="async" />
          </div>
          <div className="edu-headings">
            <h3 className="edu-school">University of Nebraska–Lincoln</h3>
            <p className="edu-program">Jeffrey S. Raikes School of Computer Science &amp; Management</p>
            <div className="edu-facts">
              <span className="chip">B.S. Computer Science &amp; Data Science</span>
              <span className="chip">Minors: Mathematics &amp; Business</span>
              <span className="chip chip-accent">GPA 3.99</span>
              <span className="chip">Expected May 2027</span>
            </div>
          </div>
        </div>

        <ul className="edu-points">
          <li>
            The Raikes School is a selective (~40 students/year) interdisciplinary program that pairs
            advanced computer science with business, leadership, and team-based design studios.
          </li>
          <li>
            Coursework spans software engineering, machine learning, statistics, and economics — plus
            hands-on business and product work.
          </li>
        </ul>

        <div className="edu-honors">
          <p className="eyebrow">Honors &amp; awards</p>
          <div className="tech-row">
            {honors.map((h) => (
              <span key={h} className="tech-chip">{h}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="download-buttons">
        <a href="/documents/js_resume.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
          View resume
        </a>
        <a href="/documents/js_transcript.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
          View transcript
        </a>
      </div>
    </div>
  );
};

export default Education;
