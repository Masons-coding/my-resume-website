import "./Footer.scss";

import Icon from "../Icon/Icon.js";
import { profile } from "../../data/resume";
import { openLink } from "../../utils/actions";

const Footer = () => {
  return (
    <footer className="footer-container">
      <h2 className="footer-message">Thank you!</h2>
      <div className="footer-github-container">
        <p className="footer-text">This was made using React, JavaScript, HTML and SCSS — and a little Python.</p>
        <button className="footer-github" onClick={() => openLink(profile.repo)} aria-label="Website source on GitHub">
          <Icon name="github" size={28} />
        </button>
      </div>
      <p className="footer-hint">
        Psst… try <kbd>Ctrl</kbd>+<kbd>K</kbd>, the terminal, or the Konami code (↑↑↓↓←→←→BA).
      </p>
      <p className="footer-copy">© {new Date().getFullYear()} {profile.name}</p>
    </footer>
  );
};

export default Footer;
