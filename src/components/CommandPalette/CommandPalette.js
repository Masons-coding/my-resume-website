import "./CommandPalette.scss";

import { useEffect, useMemo, useRef, useState } from "react";

import Icon from "../Icon/Icon.js";
import { csProjects, profile } from "../../data/resume";
import { confetti, copyEmail, openLink, scrollToId, sections } from "../../utils/actions";

const actions = [
  ...sections.map((s) => ({ label: `Go to ${s.label}`, group: "Navigate", icon: "arrowRight", run: () => scrollToId(s.id) })),
  { label: "Launch Weather App (Python)", group: "Projects", icon: "sparkles", run: () => openLink("/weather/") },
  { label: "Visit Clean Earth Foundation", group: "Projects", icon: "external", run: () => openLink("https://www.cleanearthfoundation.com/") },
  ...csProjects.map((p) => ({ label: `${p.icon} ${p.name}`, group: `CS Lab · ${p.area}`, icon: "external", run: () => openLink(p.live) })),
  { label: "Download resume (PDF)", group: "Links", icon: "download", run: () => window.open(profile.resumePdf, "_blank", "noopener") },
  { label: "Copy email address", group: "Links", icon: "copy", run: copyEmail },
  { label: "Open LinkedIn", group: "Links", icon: "linkedin", run: () => openLink(profile.linkedin) },
  { label: "Open GitHub", group: "Links", icon: "github", run: () => openLink(profile.github) },
  { label: "Open the terminal", group: "Fun", icon: "terminal", run: () => { scrollToId("terminal"); setTimeout(() => document.getElementById("terminal-input")?.focus({ preventScroll: true }), 700); } },
  { label: "Celebrate 🎉", group: "Fun", icon: "sparkles", run: confetti },
];

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef(null);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    return q ? actions.filter((a) => `${a.label} ${a.group}`.toLowerCase().includes(q)) : actions;
  }, [query]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") setOpen(false);
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("site:palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("site:palette", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  const choose = (action) => {
    setOpen(false);
    action.run();
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => (i + 1) % Math.max(results.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => (i - 1 + results.length) % Math.max(results.length, 1));
    } else if (e.key === "Enter" && results[index]) {
      choose(results[index]);
    }
  };

  if (!open) return null;

  return (
    <div className="palette" onClick={() => setOpen(false)}>
      <div className="palette__box" role="dialog" aria-modal="true" aria-label="Command palette" onClick={(e) => e.stopPropagation()}>
        <div className="palette__search">
          <Icon name="search" size={18} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Type a command or search…"
            aria-label="Search commands"
          />
          <kbd>esc</kbd>
        </div>
        <ul className="palette__list" role="listbox">
          {results.length === 0 && <li className="palette__empty">No results for “{query}”</li>}
          {results.map((a, i) => (
            <li
              key={a.label}
              role="option"
              aria-selected={i === index}
              className={`palette__item ${i === index ? "palette__item--active" : ""}`}
              onMouseEnter={() => setIndex(i)}
              onClick={() => choose(a)}
            >
              <Icon name={a.icon} size={16} />
              <span>{a.label}</span>
              <small>{a.group}</small>
            </li>
          ))}
        </ul>
        <p className="palette__footer">
          <kbd>↑</kbd>
          <kbd>↓</kbd> to navigate · <kbd>enter</kbd> to select
        </p>
      </div>
    </div>
  );
};

export default CommandPalette;
