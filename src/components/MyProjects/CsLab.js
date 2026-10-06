import "./CsLab.scss";

import { useState } from "react";

import Icon from "../Icon/Icon.js";
import { websites } from "../../data/resume";
import { openLink } from "../../utils/actions";

const areas = ["All", ...new Set(websites.map((p) => p.area))];

// Shape a website the way the shared details modal expects
const toModal = (p) => ({ ...p, liveLabel: "Open website", repos: [{ label: "Source", url: p.repo }] });

const CsLab = ({ onDetails }) => {
  const [area, setArea] = useState("All");
  const visible = area === "All" ? websites : websites.filter((p) => p.area === area);

  return (
    <div className="cslab">
      <div className="cslab__head reveal">
        <div>
          <h3 className="projects__subhead cslab__title">Live websites</h3>
          <p className="projects__note">
            Five free, responsive websites built for real visitors: news, everyday tools and eco guides, each its own GitHub repo with automated tests.
          </p>
        </div>
        <div className="cslab__stats" aria-label="Websites metrics">
          <div className="cslab__stat">
            <b>{websites.length}</b>
            <span>live websites</span>
          </div>
          <div className="cslab__stat">
            <b>320-3000</b>
            <span>px responsive</span>
          </div>
          <div className="cslab__stat">
            <b>$0</b>
            <span>hosting cost</span>
          </div>
        </div>
      </div>

      <div className="cslab__filters reveal" role="group" aria-label="Filter by area">
        {areas.map((a) => (
          <button key={a} className={`cslab__chip ${area === a ? "cslab__chip--active" : ""}`} aria-pressed={area === a} onClick={() => setArea(a)}>
            {a}
          </button>
        ))}
      </div>

      <div className="cslab__grid">
        {visible.map((p, i) => (
          <article key={p.id} className="lab-card" style={{ "--accent": p.accent, animationDelay: `${i * 60}ms` }}>
            <div className="lab-card__top">
              <span className="lab-card__icon" aria-hidden="true">
                {p.icon}
              </span>
              <span className="lab-card__area">{p.area}</span>
            </div>
            <h4 className="lab-card__name">{p.name}</h4>
            <p className="lab-card__tagline">{p.tagline}</p>
            <p className="lab-card__desc">{p.description}</p>
            <div className="tag-list">
              {p.stack.slice(0, 4).map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>
            <div className="lab-card__foot">
              <button className="btn btn--primary btn--small" onClick={() => openLink(p.live)}>
                Visit site <Icon name="external" size={14} />
              </button>
              <button className="btn btn--small" onClick={() => openLink(p.repo)} aria-label={`${p.name} source on GitHub`}>
                <Icon name="github" size={14} /> Code
              </button>
              <button className="project__more" onClick={() => onDetails(toModal(p))}>
                <Icon name="info" size={16} /> Details
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default CsLab;
