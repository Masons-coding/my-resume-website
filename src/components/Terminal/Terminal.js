import "./Terminal.scss";

import { useEffect, useRef, useState } from "react";

import { csProjects, education, experience, profile, projects, skillGroups } from "../../data/resume";
import { confetti, copyEmail, openLink, scrollToId, sections } from "../../utils/actions";

const FILES = ["about.txt", "experience.txt", "skills.txt", "projects.txt", "resume.pdf"];

const HELP = [
  "Available commands:",
  "  whoami            who is this guy?",
  "  about             short bio",
  "  experience        work history",
  "  skills            tech toolbox",
  "  projects          things I've built",
  "  lab               computer-science projects (7 live demos)",
  "  demo <name>       open a lab project, e.g. demo sql",
  "  education         schools & bootcamps",
  "  weather <city>    launch my Python weather app 🐍",
  "  contact           ways to reach me",
  "  email | linkedin | github | resume",
  "  goto <section>    scroll to a section",
  "  ls, cat <file>, neofetch, date, echo, history, clear",
  "  sudo hire-mason   😉",
];

const neofetch = () => [
  "   __  __  ____     mason@portfolio",
  "  |  \\/  |/ ___|    ---------------",
  "  | |\\/| | |        OS: React 19 on Netlify",
  "  | |  | | |___     Role: " + profile.title,
  "  |_|  |_|\\____|    Company: Plusgrade",
  "                    Location: " + profile.location,
  "                    Uptime: 4+ years in industry",
  "                    Shell: mason-sh 1.0",
];

const run = (raw, history) => {
  const [first, ...args] = raw.trim().split(/\s+/);
  const cmd = (first || "").toLowerCase();
  const arg = args.join(" ");
  switch (cmd) {
    case "":
      return [];
    case "help":
    case "?":
      return HELP;
    case "whoami":
      return [`${profile.name} — ${profile.title} based in ${profile.location}.`];
    case "about":
    case "cat":
      if (cmd === "cat" && !FILES.includes(arg)) return [{ err: `cat: ${arg || "missing file"}: No such file` }];
      if (arg === "resume.pdf") return run("resume", history);
      if (cmd === "cat" && arg !== "about.txt") return run(arg.replace(".txt", ""), history);
      return [profile.summary];
    case "experience":
      return experience.map((j) => `▹ ${j.role} @ ${j.company}  (${j.period})`);
    case "skills":
      return Object.entries(skillGroups).map(([g, s]) => `${g.padEnd(13)} ${s.join(", ")}`);
    case "projects":
      return [
        ...projects.map((p) => `▹ ${p.name.padEnd(24)} ${p.tagline}`),
        `▹ ${"CS Lab".padEnd(24)} ${csProjects.length} more — type 'lab'`,
        "Tip: try `weather Ottawa` to run the Python app.",
      ];
    case "lab":
      return [
        ...csProjects.map((p) => `${p.icon} ${p.area.padEnd(11)} ${p.name.padEnd(24)} ${String(p.tests).padStart(2)} tests`),
        "Open one with `demo <name>`, e.g. `demo neural` or `demo network`.",
      ];
    case "demo": {
      const q = arg.toLowerCase();
      const match = q && csProjects.find((p) => p.id.includes(q) || p.name.toLowerCase().includes(q) || p.area.toLowerCase().includes(q));
      if (!match) return [{ err: `demo: which one? Try: ${csProjects.map((p) => p.id.split("-")[0]).join(", ")}` }];
      openLink(match.live);
      return [`Launching ${match.name}…`];
    }
    case "education":
      return education.map((e) => `▹ ${e.school} — ${e.program} (${e.period})`);
    case "contact":
      return [`email:    ${profile.email}`, `linkedin: ${profile.linkedin}`, `github:   ${profile.github}`];
    case "email":
      copyEmail();
      return [`${profile.email} (copied to clipboard)`];
    case "linkedin":
      openLink(profile.linkedin);
      return ["Opening LinkedIn…"];
    case "github":
      openLink(profile.github);
      return ["Opening GitHub…"];
    case "resume":
      window.open(profile.resumePdf, "_blank", "noopener");
      return ["Opening resume PDF…"];
    case "weather": {
      const city = arg || "Ottawa";
      openLink(`/weather/?city=${encodeURIComponent(city)}`);
      return [`$ python weather_app.py --city "${city}"`, "Launching in a new tab…"];
    }
    case "goto": {
      const target = sections.find((s) => s.id === arg.toLowerCase());
      if (!target) return [{ err: `goto: unknown section. Try: ${sections.map((s) => s.id).join(", ")}` }];
      setTimeout(() => scrollToId(target.id), 150);
      return [`Scrolling to ${target.label}…`];
    }
    case "ls":
      return [FILES.join("   ")];
    case "neofetch":
      return neofetch();
    case "date":
      return [new Date().toString()];
    case "echo":
      return [arg];
    case "history":
      return history.map((h, i) => `${String(i + 1).padStart(3)}  ${h}`);
    case "sudo":
      if (arg === "hire-mason") {
        confetti();
        return ["[sudo] password for recruiter: ********", "✅ Excellent decision. Let's talk → " + profile.email];
      }
      return [{ err: "Nice try. Permission denied." }];
    case "exit":
      return ["There is no escape. 🙂 (try `contact` instead)"];
    case "coffee":
      return ["☕ Brewing… done. Productivity +20%."];
    default:
      return [{ err: `command not found: ${cmd}. Type 'help' for a list of commands.` }];
  }
};

const COMMANDS = [
  "help", "whoami", "about", "experience", "skills", "projects", "lab", "demo", "education", "weather", "contact",
  "email", "linkedin", "github", "resume", "goto", "ls", "cat", "neofetch", "date", "echo", "history",
  "clear", "sudo", "coffee",
];

const Terminal = () => {
  const [lines, setLines] = useState([
    { out: "Welcome to mason-sh 1.0 — an interactive resume." },
    { out: "Type 'help' to see what you can do. Try 'sudo hire-mason'. ✨" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [cursor, setCursor] = useState(-1);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const body = bodyRef.current;
    body.scrollTop = body.scrollHeight;
  }, [lines]);

  const submit = (e) => {
    e.preventDefault();
    const value = input;
    setInput("");
    setCursor(-1);
    if (value.trim().toLowerCase() === "clear") {
      setLines([]);
      setHistory((h) => [...h, value]);
      return;
    }
    const nextHistory = value.trim() ? [...history, value] : history;
    const output = run(value, nextHistory).map((l) => (typeof l === "string" ? { out: l } : l));
    setLines((prev) => [...prev, { cmd: value }, ...output]);
    setHistory(nextHistory);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowUp" && history.length) {
      e.preventDefault();
      const next = cursor === -1 ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(next);
      setInput(history[next]);
    } else if (e.key === "ArrowDown" && cursor !== -1) {
      e.preventDefault();
      const next = cursor + 1;
      setCursor(next >= history.length ? -1 : next);
      setInput(next >= history.length ? "" : history[next]);
    } else if (e.key === "Tab") {
      e.preventDefault();
      const match = COMMANDS.find((c) => c.startsWith(input.toLowerCase()));
      if (input && match) setInput(match + " ");
    }
  };

  const quick = ["help", "whoami", "lab", "weather Toronto", "neofetch", "sudo hire-mason"];

  return (
    <section id="terminal" className="section terminal-section">
      <div className="section__inner">
        <p className="section__eyebrow reveal">play around</p>
        <h2 className="section__title reveal">Interactive Terminal</h2>

        <div className="terminal reveal" onClick={() => inputRef.current.focus({ preventScroll: true })}>
          <div className="terminal__bar">
            <span />
            <span />
            <span />
            <p>mason@portfolio: ~</p>
          </div>
          <div ref={bodyRef} className="terminal__body" aria-live="polite">
            {lines.map((l, i) =>
              l.cmd !== undefined ? (
                <p key={i} className="terminal__line">
                  <span className="terminal__ps1">mason@portfolio:~$</span> {l.cmd}
                </p>
              ) : (
                <p key={i} className={`terminal__line ${l.err ? "terminal__line--err" : ""}`}>
                  {l.err || l.out}
                </p>
              )
            )}
            <form className="terminal__form" onSubmit={submit}>
              <label htmlFor="terminal-input" className="terminal__ps1">
                mason@portfolio:~$
              </label>
              <input
                id="terminal-input"
                ref={inputRef}
                className="terminal__input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck="false"
                aria-label="Terminal command"
              />
            </form>
          </div>
        </div>

        <div className="terminal__quick reveal">
          <span>Quick commands:</span>
          {quick.map((q) => (
            <button
              key={q}
              onClick={() => {
                const output = run(q, [...history, q]).map((l) => (typeof l === "string" ? { out: l } : l));
                setLines((prev) => [...prev, { cmd: q }, ...output]);
                setHistory((h) => [...h, q]);
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Terminal;
