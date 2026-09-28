import "./Education.scss";

import Icon from "../Icon/Icon.js";
import { award, education } from "../../data/resume";
import { confetti } from "../../utils/actions";

const Education = () => {
  return (
    <section id="education" className="section education">
      <div className="section__inner">
        <p className="section__eyebrow reveal">learning</p>
        <h2 className="section__title reveal">Education & Awards</h2>

        <div className="education__grid">
          {education.map((e) => (
            <article key={e.school} className="education__card card reveal">
              <span className="education__icon">
                <Icon name="cap" size={22} />
              </span>
              <div className="education__meta">
                <p className="education__period">{e.period}</p>
                {e.gpa && (
                  <span className="education__gpa">
                    <span>GPA</span> {e.gpa}
                  </span>
                )}
              </div>
              <h3 className="education__school">{e.school}</h3>
              <p className="education__program">{e.program}</p>
              <p className="education__detail">{e.detail}</p>
            </article>
          ))}

          <button className="award reveal" onClick={confetti} aria-label={`${award.title}. Click to celebrate.`}>
            <span className="award__shine" aria-hidden="true" />
            <span className="award__icon">
              <Icon name="trophy" size={34} />
            </span>
            <span className="award__title">{award.title}</span>
            <span className="award__detail">{award.detail}</span>
            <span className="award__hint">Click to celebrate 🎉</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Education;
