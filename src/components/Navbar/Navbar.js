import "./Navbar.scss";

import { useEffect, useState } from "react";

import masonLogo from "../../assets/images/Mason-logo.svg";
import Icon from "../Icon/Icon.js";
import { openPalette, scrollToId, sections } from "../../utils/actions";

const navSections = sections.filter((s) => s.id !== "home");

const Navbar = () => {
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight whichever section is crossing the middle of the viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const go = (id) => {
    setMenuOpen(false);
    scrollToId(id);
  };

  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

  return (
    <header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__inner">
        <button className="navbar__logo" onClick={() => go("home")} aria-label="Back to top">
          <img src={masonLogo} alt="MC logo" />
        </button>

        <nav className={`navbar__links ${menuOpen ? "navbar__links--open" : ""}`} aria-label="Main">
          {navSections.map(({ id, label }) => (
            <button
              key={id}
              className={`navbar__link ${active === id ? "navbar__link--active" : ""}`}
              onClick={() => go(id)}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="navbar__actions">
          <button className="navbar__palette" onClick={openPalette} aria-label="Open command palette">
            <Icon name="search" size={16} />
            <span className="navbar__kbd">{isMac ? "⌘" : "Ctrl"} K</span>
          </button>
          <button
            className="navbar__burger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <Icon name={menuOpen ? "close" : "menu"} size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
