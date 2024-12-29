import './Footer.scss';

import githubLogo from "../../assets/images/github-icon.svg";

const Footer = () => {

function gitClicked() {
    window.open('https://github.com/Masons-coding/my-resume-website');
}

    return (
        <>
        <div className="footer-container">
            <h1 className="footer-message">Thank you!</h1>
            <div className="footer-github-container">
                <p className="footer-text">This was made using React, Javascript, HTML and SCSS</p>
                <img onClick={gitClicked} className="github-logo" src={githubLogo} alt="Github Logo"/>
            </div>
            
        </div>
        </>
    );
};

export default Footer;