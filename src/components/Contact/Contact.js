import "./Contact.scss";

import Icon from "../Icon/Icon.js";
import { profile } from "../../data/resume";
import { copyEmail, openLink } from "../../utils/actions";

const Contact = () => {
  return (
    <section id="contact" className="section contact">
      <div className="section__inner contact__inner reveal">
        <p className="section__eyebrow">what's next?</p>
        <h2 className="contact__title">
          Let's build something <span className="gradient-text">great</span> together.
        </h2>
        <p className="contact__text">
          Whether it's a role, a project or just a chat about tech, fitness or travel — my inbox is always open.
        </p>

        <div className="contact__email">
          <a href={`mailto:${profile.email}`} className="contact__address">
            {profile.email}
          </a>
          <button className="contact__copy" onClick={copyEmail} aria-label="Copy email address">
            <Icon name="copy" size={18} />
          </button>
        </div>

        <div className="contact__actions">
          <a className="btn btn--primary" href={`mailto:${profile.email}`}>
            <Icon name="mail" size={18} /> Say hello
          </a>
          <button className="btn" onClick={() => openLink(profile.linkedin)}>
            <Icon name="linkedin" size={18} /> LinkedIn
          </button>
          <button className="btn" onClick={() => openLink(profile.github)}>
            <Icon name="github" size={18} /> GitHub
          </button>
          <a className="btn btn--orange" href={profile.resumePdf} download>
            <Icon name="download" size={18} /> Resume PDF
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
