import './AboutMe.scss';

import heart from "../../assets/images/Heart.png";

import technologies from "../../assets/images/technologies.png";

import smile from "../../assets/images/Smile.png";

import jen from "../../assets/images/Jen.jpeg";

const AboutMe = () => {

    return (
        <div className="about-me">
            <div className="title-container">
                <h1 className="welcome-message">Dear My Love!</h1>
                <p className="my-title"> You truly are one of a kind and I'm so happy I met you!</p>
            <img  className="programmer-img" src={jen} alt="jen"/>
            <div className="my-contact-container">
            </div>

            </div>

            <div className="about-me-info-container">
                <h2 className="about-title">My Letter to you</h2>
                <div className="info-container">
                    <div className="my-info-text-container">
                        <p className="my-info-text">Where to even begin...</p>
                        <p className="my-info-text">It's hard to express just how much I love you and how much you have changed my life but here it goes haha.</p>
                        <p className="my-info-text"></p>
                    </div>
                    <div className="all-i-know-container">
                        <div className="things-i-know-list-container">
                            <div className="what-i-know-logo-container">
                                <h3 className="what-i-know-title">Things I love about you</h3>
                                <img  className="what-i-know-img" src={heart} alt="heart"/>
                            </div>
                            <div className="button-container">
                                <img alt="" src="https://img.shields.io/badge/Your eyes-1572B6?&logoColor=white&style=for-the-badge" />
                                <img alt="" src="https://img.shields.io/badge/Your smile-E34F26?t&logoColor=white&style=for-the-badge" />
                                <img alt="" src="https://img.shields.io/badge/Your luagh-1572B6?&logoColor=white&style=for-the-badge" />
                                <img alt="" src="https://img.shields.io/badge/Your silliness-E34F26?&logoColor=white&style=for-the-badge" />
                                <img alt="" src="https://img.shields.io/badge/Your ability to slow my brain down-1572B6?&logoColor=white&style=for-the-badge" />
                                <img alt='' src='https://img.shields.io/badge/Your Compassion -100000?style=for-the-badge&logo=&logoColor=white&labelColor=E34F26&color=E34F26'/>
                            </div>
                        </div>
                        <div className="things-i-know-list-container">
                            <div className="what-i-know-logo-container">
                                <h3 className="what-i-know-title">Things I want with you</h3>
                                <img  className="what-i-know-img" src={smile} alt="smile"/>
                            </div>
                            <div className="button-container">
                                <img alt="" src="https://img.shields.io/badge/To travel the world-1572B6?&logoColor=white&style=for-the-badge" />
                                <img alt="" src="https://img.shields.io/badge/To buy a house together-E34F26?&logoColor=white&style=for-the-badge" />
                                <img alt="" src="https://img.shields.io/badge/To grow old-1572B6?&logoColor=white&style=for-the-badge" />
                                <img alt="" src="https://img.shields.io/badge/To keep having fun forever!-E34F26?&logoColor=white&style=for-the-badge" />
                                <img alt='' src='https://img.shields.io/badge/To marry you!!!!!!!!!-100000?style=for-the-badge&logo=&logoColor=white&labelColor=1572B6&color=1572B6'/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutMe;