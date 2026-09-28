import "./Experience.scss";

import Icon from "../Icon/Icon.js";
import { experience } from "../../data/resume";

const Experience = () => {
  return (
    <section id="experience" className="section experience">
      <div className="section__inner">
        <p className="section__eyebrow reveal">career</p>
        <h2 className="section__title reveal">Experience</h2>

        <ol className="timeline">
          {experience.map((job) => (
            <li key={job.role + job.company} className="timeline__item reveal">
              <span className={`timeline__dot ${job.current ? "timeline__dot--current" : ""}`} aria-hidden="true">
                <Icon name="briefcase" size={16} />
              </span>
              <article className="timeline__card card">
                <header className="timeline__header">
                  <div>
                    <h3 className="timeline__role">{job.role}</h3>
                    <p className="timeline__company">{job.company}</p>
                  </div>
                  <span className={`timeline__period ${job.current ? "timeline__period--current" : ""}`}>
                    {job.period}
                  </span>
                </header>
                <ul className="timeline__points">
                  {job.points.map((p) => (
                    <li key={p.slice(0, 30)}>{p}</li>
                  ))}
                </ul>
                <div className="tag-list">
                  {job.tags.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Experience;
