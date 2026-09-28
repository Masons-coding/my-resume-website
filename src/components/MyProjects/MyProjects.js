import "./MyProjects.scss";

import { useEffect, useRef, useState } from "react";

import cleanEarthLogo from "../../assets/images/Clean-Earth-Logo.svg";
import weatherLogo from "../../assets/images/weather-icon.svg";
import masonLogo from "../../assets/images/Mason-logo.svg";
import Icon from "../Icon/Icon.js";
import CsLab from "./CsLab.js";
import { otherWork, projects } from "../../data/resume";
import { openLink, prefersReducedMotion } from "../../utils/actions";

const logos = { "clean-earth": cleanEarthLogo, weather: weatherLogo, mc: masonLogo };


// Card that tilts toward the cursor and shows a moving spotlight
const TiltCard = ({ children, accent }) => {
  const ref = useRef(null);

  const onMove = (e) => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    el.style.setProperty("--rx", `${(0.5 - y) * 10}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * 10}deg`);
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
  };

  const onLeave = () => {
    ref.current.style.setProperty("--rx", "0deg");
    ref.current.style.setProperty("--ry", "0deg");
  };

  return (
    <article ref={ref} className="project" style={{ "--accent": accent }} onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
    </article>
  );
};

const ProjectModal = ({ project, onClose }) => {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (project && !dialog.open) dialog.showModal();
    if (!project && dialog.open) dialog.close();
  }, [project]);

  return (
    <dialog
      ref={ref}
      className="modal"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="modal-title"
    >
      {project && (
        <div className="modal__body" style={{ "--accent": project.accent }}>
          <button className="modal__close" onClick={onClose} aria-label="Close">
            <Icon name="close" />
          </button>
          {project.icon ? (
            <span className="modal__icon" aria-hidden="true">
              {project.icon}
            </span>
          ) : (
            <img className="modal__logo" src={logos[project.logo]} alt="" />
          )}
          <h3 id="modal-title" className="modal__title">
            {project.name}
          </h3>
          <p className="modal__tagline">{project.tagline}</p>
          <p className="modal__desc">{project.description}</p>
          <h4 className="modal__subtitle">Highlights</h4>
          <ul className="modal__list">
            {project.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
          <h4 className="modal__subtitle">Tech stack</h4>
          <div className="tag-list">
            {project.stack.map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </div>
          <div className="modal__actions">
            {project.live && (
              <button className="btn btn--primary" onClick={() => openLink(project.live)}>
                {project.liveLabel} <Icon name="external" size={16} />
              </button>
            )}
            {project.repos.map((r) => (
              <button key={r.url} className="btn" onClick={() => openLink(r.url)}>
                <Icon name="github" size={16} /> {r.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </dialog>
  );
};

// Recreation of the promo countdown clocks I build at work (demo only — no partner code).
const CountdownDemo = () => {
  const [left, setLeft] = useState(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const end = new Date(now);
      end.setHours(24, 0, 0, 0);
      setLeft(Math.floor((end - now) / 1000));
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  if (left === null) return null;
  const parts = [Math.floor(left / 3600), Math.floor((left % 3600) / 60), left % 60];

  return (
    <div className="countdown" aria-label="Countdown demo">
      <p className="countdown__label">✈️ Upgrade offer ends in</p>
      <div className="countdown__clock">
        {parts.map((n, i) => (
          <span key={i} className="countdown__unit">
            <b>{String(n).padStart(2, "0")}</b>
            <small>{["hrs", "min", "sec"][i]}</small>
          </span>
        ))}
      </div>
    </div>
  );
};

const MyProjects = () => {
  const [selected, setSelected] = useState(null);

  return (
    <section id="projects" className="section projects">
      <div className="section__inner">
        <p className="section__eyebrow reveal">things I've built</p>
        <h2 className="section__title reveal">Projects</h2>

        <div className="projects__grid">
          {projects.map((p) => (
            <div key={p.id} className="reveal">
              <TiltCard accent={p.accent}>
                <div className="project__top">
                  <button
                    className="project__logo"
                    onClick={() => (p.live ? openLink(p.live) : setSelected(p))}
                    aria-label={p.live ? `${p.liveLabel}: ${p.name}` : `Details: ${p.name}`}
                  >
                    <img src={logos[p.logo]} alt="" />
                  </button>
                  {p.id === "weather" && <span className="project__badge">🐍 Python in your browser</span>}
                  {p.id === "clean-earth" && <span className="project__badge">● Live</span>}
                </div>
                <h3 className="project__name">{p.name}</h3>
                <p className="project__tagline">{p.tagline}</p>
                <p className="project__desc">{p.description}</p>
                <div className="tag-list">
                  {p.stack.slice(0, 5).map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                  {p.stack.length > 5 && <span className="tag">+{p.stack.length - 5}</span>}
                </div>
                <div className="project__actions">
                  {p.live && (
                    <button className="btn btn--primary btn--small" onClick={() => openLink(p.live)}>
                      {p.liveLabel} <Icon name="external" size={14} />
                    </button>
                  )}
                  {p.repos.map((r) => (
                    <button
                      key={r.url}
                      className="btn btn--small"
                      onClick={() => openLink(r.url)}
                      aria-label={`${p.name} ${r.label} on GitHub`}
                    >
                      <Icon name="github" size={14} /> {r.label}
                    </button>
                  ))}
                  <button className="project__more" onClick={() => setSelected(p)}>
                    <Icon name="info" size={16} /> Details
                  </button>
                </div>
              </TiltCard>
            </div>
          ))}
        </div>

        <CsLab onDetails={setSelected} />

        <h3 className="projects__subhead reveal">Professional & hackathon work</h3>
        <p className="projects__note reveal">Proprietary or event projects — described here, code not public.</p>
        <div className="projects__other">
          {otherWork.map((w) => (
            <article key={w.id} className="work card reveal">
              <div className="work__head">
                <span className="work__badge">{w.badge}</span>
                <span className="work__impact">{w.impact}</span>
              </div>
              <h4 className="work__name">{w.name}</h4>
              <p className="work__org">{w.org}</p>
              <p className="work__desc">{w.description}</p>
              {w.demo === "countdown" && <CountdownDemo />}
              <div className="tag-list">
                {w.stack.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  );
};

export default MyProjects;
