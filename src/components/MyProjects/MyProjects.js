import './MyProjects.scss';
import cleanEarthLogo from "../../assets/images/Clean-Earth-Logo.svg";

import weatherLogo from "../../assets/images/weather-icon.svg";

import githubLogo from "../../assets/images/github-icon.svg";

const MyProjects = () => {

function cleanEarthClick() {
    window.open('https://www.cleanearthfoundation.com/');
}

function cleanEarthGitFrontClick() {
    window.open('https://github.com/Masons-coding/Clean-Earth-Foundation');
}

function cleanEarthGitBackClick() {
    window.open('https://github.com/Masons-coding/cleanearthfoundation-server');
}

function weatherGitClick() {
    window.open('https://github.com/Masons-coding/WeatherAPI-APP');
}

function weatherApiLinkClick() {
    window.open('https://openweathermap.org/');
}



    return (
        <>
        <div className="projects-container">
            <h1 className="projects-header">Projects (click logo to view live)</h1>
            <div className="all-projects-container">
                <div className="project-container">
                    <h3 className="project-header-text">CLEAN EARTH</h3>
                    <img onClick={cleanEarthClick} className="project-logo" src={cleanEarthLogo} alt="CleanEarth Logo"/>
                    <p className="project-text">Clean Earth Foundation is a nonprofit organization dedicated to championing and coordinating initiatives aimed at environmental cleanup and preservation on a global scale.</p>
                    <div className="github-container">
                        <p className="project-text-git">Front-end:</p>
                        <img onClick={cleanEarthGitFrontClick} className="github-logo" src={githubLogo} alt="Github Logo"/>
                    </div>
                    <div className="github-container">
                        <p className="project-text-git">Back-end:</p>
                        <img onClick={cleanEarthGitBackClick} className="github-logo" src={githubLogo} alt="Github Logo"/>
                    </div>
                    <div className="used-container">
                        <p className="used-text">Tech-stack:</p>
                        <p className="used-stack-text">React, JavaScript, SCSS, NodeJS, ExpressJS, KnexJS, MySQL database, Google Maps API, Stripe payment API, and various NPM packages.</p>
                    </div>
                </div>
                <div className="project-container">
                    <h3 className="project-header-text">Weather API</h3>
                    <img  className="project-logo" src={weatherLogo} alt="Weather Logo"/>
                    <p className="project-text">A Python-based weather application which leverages an online weather API, <span className="weather-link" onClick={weatherApiLinkClick}>Openweathermap</span>, to provide real-time weather information for cities worldwide. Users can input the name of a city, and the application sends a request to the API, retrieving data such as temperature, humidity, wind speed, and weather conditions</p>
                    <img onClick={weatherGitClick} className="github-logo" src={githubLogo} alt="Github Logo"/>
                    <div className="used-container">
                        <p className="used-text">Tech-stack:</p>
                        <p className="used-stack-text">Python, Python Tkinter, Python Configparser, Python requests, Python time, and Openweathermap-API</p>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default MyProjects;