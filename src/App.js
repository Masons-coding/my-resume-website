import "./App.scss";

import { useEffect } from "react";

import Navbar from "./components/Navbar/Navbar.js";
import Hero from "./components/Hero/Hero.js";
import AboutMe from "./components/AboutMe/AboutMe.js";
import Experience from "./components/Experience/Experience.js";
import Skills from "./components/Skills/Skills.js";
import MyProjects from "./components/MyProjects/MyProjects.js";
import Education from "./components/Education/Education.js";
import Terminal from "./components/Terminal/Terminal.js";
import Contact from "./components/Contact/Contact.js";
import Footer from "./components/Footer/Footer.js";
import CommandPalette from "./components/CommandPalette/CommandPalette.js";
import Effects from "./components/Effects/Effects.js";
import "./styles/frontend-polish.scss";

import { confetti, toast } from "./utils/actions";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

function App() {
  // Reveal-on-scroll for every element tagged with `.reveal`
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.12 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Konami code easter egg
  useEffect(() => {
    let progress = 0;
    const onKey = (e) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      progress = key === KONAMI[progress] ? progress + 1 : key === KONAMI[0] ? 1 : 0;
      if (progress === KONAMI.length) {
        progress = 0;
        confetti();
        toast("🎮 Konami code unlocked — you found the secret!");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <a className="skip-link" href="#about">Skip to content</a>
      <Effects />
      <Navbar />
      <main>
        <Hero />
        <AboutMe />
        <Experience />
        <Skills />
        <MyProjects />
        <Education />
        <Terminal />
        <Contact />
      </main>
      <Footer />
      <CommandPalette />
    </>
  );
}
export default App;
