import "./Hero.scss";

import { useEffect, useRef, useState } from "react";

import masonImg from "../../assets/images/MasonPicture.jpg";
import Icon from "../Icon/Icon.js";
import ParticleField from "./ParticleField.js";
import { profile, stats } from "../../data/resume";
import { openLink, ottawaTime, prefersReducedMotion, scrollToId } from "../../utils/actions";

const Typewriter = ({ words }) => {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index % words.length];
    if (prefersReducedMotion()) {
      setText(word);
      return;
    }
    let delay = deleting ? 40 : 85;
    if (!deleting && text === word) delay = 1800;
    const timer = setTimeout(() => {
      if (!deleting && text === word) setDeleting(true);
      else if (deleting && text === "") {
        setDeleting(false);
        setIndex((i) => i + 1);
      } else setText(word.slice(0, text.length + (deleting ? -1 : 1)));
    }, delay);
    return () => clearTimeout(timer);
  }, [text, deleting, index, words]);

  return (
    <span className="typewriter" aria-label={words.join(", ")}>
      <span aria-hidden="true">{text}</span>
      <span className="typewriter__caret" aria-hidden="true" />
    </span>
  );
};

const CountUp = ({ value, prefix = "", suffix = "" }) => {
  const ref = useRef(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    let frame;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      if (prefersReducedMotion()) return setDisplay(value);
      const start = performance.now();
      const step = (now) => {
        const t = Math.min((now - start) / 1600, 1);
        setDisplay(Math.round(value * (1 - Math.pow(1 - t, 3))));
        if (t < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
};

const Hero = () => {
  const [time, setTime] = useState(ottawaTime());

  useEffect(() => {
    const timer = setInterval(() => setTime(ottawaTime()), 15000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="hero">
      <ParticleField />
      <div className="hero__inner">
        <div className="hero__content">
          <p className="hero__hello">
            <span className="hero__wave" role="img" aria-label="waving hand">👋</span> HI! I'm
          </p>
          <h1 className="hero__name gradient-text">{profile.name}</h1>
          <p className="hero__role">
            <span className="hero__prompt">&gt;</span> <Typewriter words={profile.roles} />
          </p>
          <p className="hero__summary">
            I turn client and product requirements into clean, working software — directly involved in{" "}
            <strong>500+ client initiatives</strong> and <strong>$100M+ in sales</strong>.
          </p>

          <div className="hero__cta">
            <button className="btn btn--primary" onClick={() => scrollToId("projects")}>
              View my work <Icon name="arrowRight" size={18} />
            </button>
            <a className="btn" href={profile.resumePdf} download>
              <Icon name="download" size={18} /> Resume
            </a>
            <button className="btn btn--orange" onClick={() => scrollToId("contact")}>
              <Icon name="mail" size={18} /> Contact
            </button>
          </div>

          <div className="hero__socials">
            <button onClick={() => openLink(profile.linkedin)} aria-label="LinkedIn">
              <Icon name="linkedin" size={22} />
            </button>
            <button onClick={() => openLink(profile.github)} aria-label="GitHub">
              <Icon name="github" size={22} />
            </button>
            <span className="hero__meta">
              <Icon name="pin" size={16} /> {profile.location}
            </span>
            <span className="hero__meta">
              <Icon name="clock" size={16} /> {time} local
            </span>
          </div>
        </div>

        <div className="hero__photo-wrap">
          <div className="hero__ring" />
          <img className="hero__photo" src={masonImg} alt="Mason Clarke" />
          <span className="hero__badge">
            <span className="hero__pulse" /> Currently @ Plusgrade
          </span>
        </div>
      </div>

      <div className="hero__stats">
        {stats.map((s) => (
          <div className="hero__stat" key={s.label}>
            <span className="hero__stat-value">
              <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} />
            </span>
            <span className="hero__stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      <button className="hero__scroll" onClick={() => scrollToId("about")} aria-label="Scroll to about">
        <span />
      </button>
    </section>
  );
};

export default Hero;
