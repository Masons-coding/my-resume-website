import "./App.scss";

import AboutMe from "./components/AboutMe/AboutMe.js";

import MyProjects from "./components/MyProjects/MyProjects.js";

import Footer from "./components/Footer/Footer.js";

import masonLogo from "./assets/images/Mason-logo.svg";

import { useRef } from 'react';

function App() {

  const about = useRef(null);
  const projects = useRef(null);

  const handleLogoClick = () => {
    window.scrollTo(0, 0)
  };

  const scrollToSection = (elementRef) => {
    window.scrollTo({
      top: elementRef.current.offsetTop,
      behavior: "smooth",
    });
  };

  return (
      <>

      <header className="header">
        <div className="logo-container">
          <button className="logo-button" onClick={handleLogoClick}><img  className="logo" src={masonLogo} alt="MC logo"/></button>
        </div>

        <div className="nav-links">
          <li onClick={() => scrollToSection(about)} className="link">About</li>
          <li onClick={() => scrollToSection(projects)} className="link">Projects</li>
        </div>
      </header>

      <div ref={about} className="about">
        <AboutMe/>
      </div>

      <div ref={projects} className="projects">
        <MyProjects/>
      </div>

      <Footer/>
      

      </>
  );
}
export default App;
