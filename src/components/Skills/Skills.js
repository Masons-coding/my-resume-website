import "./Skills.scss";

import { useState } from "react";

import { skillGroups } from "../../data/resume";

const groups = ["All", ...Object.keys(skillGroups)];
const allSkills = Object.entries(skillGroups).flatMap(([group, skills]) => skills.map((name) => ({ name, group })));

const Skills = () => {
  const [filter, setFilter] = useState("All");
  const visible = filter === "All" ? allSkills : allSkills.filter((s) => s.group === filter);

  return (
    <section id="skills" className="section skills">
      <div className="section__inner">
        <p className="section__eyebrow reveal">toolbox</p>
        <h2 className="section__title reveal">Skills & Tech</h2>

        <div className="skills__tabs reveal" role="tablist" aria-label="Skill categories">
          {groups.map((g) => (
            <button
              key={g}
              role="tab"
              aria-selected={filter === g}
              className={`skills__tab ${filter === g ? "skills__tab--active" : ""}`}
              onClick={() => setFilter(g)}
            >
              {g}
              <span className="skills__count">{g === "All" ? allSkills.length : skillGroups[g].length}</span>
            </button>
          ))}
        </div>

        <div className="skills__grid" key={filter}>
          {visible.map((s, i) => (
            <span
              key={s.name}
              className={`skills__chip skills__chip--${Object.keys(skillGroups).indexOf(s.group) % 3}`}
              style={{ animationDelay: `${i * 25}ms` }}
            >
              {s.name}
            </span>
          ))}
        </div>
      </div>

      <div className="skills__marquee" aria-hidden="true">
        <div className="skills__track">
          {[...allSkills, ...allSkills].map((s, i) => (
            <span key={i}>
              {s.name} <b>✦</b>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
