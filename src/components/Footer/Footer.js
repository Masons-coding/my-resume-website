import './Footer.scss';

import githubLogo from "../../assets/images/github-icon.svg";

const Footer = () => {

function gitClicked() {
    window.open('https://github.com/Masons-coding/my-resume-website');
}

    return (
        <>
        <div className="footer-container">
            <h1 className="footer-message">I love you!</h1>
            
        </div>
        </>
    );
};

export default Footer;