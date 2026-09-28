import "./AboutMe.scss";

import { about, profile, softSkills } from "../../data/resume";

const json = [
  ["name", `"${profile.name}"`],
  ["role", `"${profile.title}"`],
  ["company", `"Plusgrade"`],
  ["location", `"${profile.location}"`],
  ["experience", `"4+ years"`],
  ["loves", `["sports", "fitness", "travel", "clean code"]`],
  ["superpower", `"making clients' visions real"`],
  ["available", "true"],
];

const AboutMe = () => {
  return (
    <section id="about" className="section about">
      <div className="section__inner">
        <p className="section__eyebrow reveal">about me</p>
        <h2 className="section__title reveal">Who I am</h2>

        <div className="about__grid">
          <div className="about__text reveal">
            <p className="about__lead">{profile.summary}</p>
            {about.map((p) => (
              <p key={p.slice(0, 24)} className="about__para">
                {p}
              </p>
            ))}
            <ul className="about__soft">
              {softSkills.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>

          <div className="about__code reveal" aria-label="Profile summary as JSON">
            <div className="about__code-bar">
              <span />
              <span />
              <span />
              <p>mason.json</p>
            </div>
            <pre>
              <code>
                <span className="c-punct">{"{"}</span>
                {"\n"}
                {json.map(([k, v], i) => (
                  <span key={k}>
                    {"  "}
                    <span className="c-key">"{k}"</span>
                    <span className="c-punct">: </span>
                    <span className={v === "true" ? "c-bool" : "c-str"}>{v}</span>
                    {i < json.length - 1 ? <span className="c-punct">,</span> : null}
                    {"\n"}
                  </span>
                ))}
                <span className="c-punct">{"}"}</span>
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
