import { useState } from "react";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import "./index.css";

const Contact = () => {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Copy text and show notification
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
    }).catch(err => console.error("Failed to copy:", err));
  };

  return (
    <div className="contact">
      <div className="note">Please feel free to contact me about anything!</div>
      
      {/* Clickable Email */}
      <p>
        Email: 
        <span className="copyable incButton" onClick={() => copyToClipboard("27josephs@gmail.com")}>
          27josephs@gmail.com
        </span>
      </p>

      {/* Clickable Phone */}
      <p>
        Phone: 
        <span className="copyable incButton" onClick={() => copyToClipboard("7858442569")}>
          +1 (785) 844-2569
        </span>
      </p>

      {/* Social Icons */}
      <div className="social-icons">
        <a href="https://github.com/joeyShea" target="_blank" rel="noopener noreferrer">
          <FaGithub className="icon incButton" />
        </a>
        <a href="https://www.linkedin.com/in/joey-shea" target="_blank" rel="noopener noreferrer">
          <FaLinkedin className="icon incButton" />
        </a>
        <a href="https://www.instagram.com/joey.shea2/profilecard/?igsh=eWN0aXBic3p6ZmE3" target="_blank" rel="noopener noreferrer">
          <FaInstagram className="icon incButton" />
        </a>
      </div>

      {/* Subtle Notification */}
      {copiedText && <div className="copy-notification">Copied!</div>}
    </div>
  );
};

export default Contact;
