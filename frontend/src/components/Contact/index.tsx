import { useState } from "react";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import { FiCopy, FiCheck } from "react-icons/fi";
import "./index.css";

const EMAIL = "27josephs@gmail.com";

const socials = [
  { label: "GitHub", href: "https://github.com/joeyShea", Icon: FaGithub },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/joey-shea", Icon: FaLinkedin },
  { label: "Instagram", href: "https://www.instagram.com/joey.shea2", Icon: FaInstagram },
];

const Contact = () => {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard
      .writeText(EMAIL)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => console.error("Failed to copy:", err));
  };

  return (
    <div className="contact">
      <p className="contact-lead">
        Always happy to talk about software, internships, or a good project. Reach out!
      </p>

      <div className="contact-email-row">
        <button
          type="button"
          className="contact-email"
          onClick={copyEmail}
          aria-label={copied ? "Email address copied" : `Copy email address ${EMAIL}`}
        >
          {EMAIL}
        </button>
        <button
          type="button"
          className="contact-copy"
          onClick={copyEmail}
          aria-label={copied ? "Email address copied" : "Copy email address"}
        >
          {copied ? <FiCheck /> : <FiCopy />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>

      <div className="social-icons">
        {socials.map(({ label, href, Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="social-link"
          >
            <Icon aria-hidden="true" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default Contact;
