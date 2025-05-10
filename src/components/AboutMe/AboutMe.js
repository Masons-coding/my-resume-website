import './AboutMe.scss';

import linkedInLogo from "../../assets/images/Linked-In-Logo.svg";

import technologies from "../../assets/images/technologies.png";

import libraries from "../../assets/images/libraries.png";

import languages from "../../assets/images/languages.png";

import githubLogo from "../../assets/images/github-icon.svg";

import masonImg from "../../assets/images/MasonPicture.jpg";

const AboutMe = () => {

function linkedInClick() {
    window.open('https://www.linkedin.com/in/mason-clarke/');
}

function gitClick() {
    window.open('https://github.com/Masons-coding');
}

    return (
        <div className="about-me">
            <div className="title-container">
                <h1 className="welcome-message">HI! I'm Mason Clarke</h1>
                <p className="my-title"> A Full Stack Software Engineer | React | JavaScript | SCSS | NodeJS | ExpressJS | KnexJS | MySQL</p>
            <img  className="programmer-img" src={masonImg} alt="Programmer"/>
            <div className="my-contact-container">
                <div className="social-container">
                    <p className="social-text">Email:</p>
                    <p>Maclarkegdci@gmail.com</p>
                </div>
                <div className="social-container">
                    <p className="social-text">Linked-in:</p>
                    <img onClick={linkedInClick} className="linked-in-logo" src={linkedInLogo} alt="MC logo"/>
                </div>
                <div className="social-container">
                    <p className="social-text">Github:</p>
                    <img onClick={gitClick} className="git-hub-logo" src={githubLogo} alt="Github Logo"/>
                </div>
            </div>

            </div>

            <div className="about-me-info-container">
                <h2 className="about-title">About</h2>
                <div className="info-container">
                    <div className="my-info-text-container">
                        <p className="my-info-text">My name is Mason Clarke, a dedicated and compassionate professional with a strong work ethic. I am committed to promoting a healthy lifestyle through sports and fitness, I have a profound love for travel, and I hold a genuine passion for making a positive impact on others. Currently, I'm privileged to work as a Web Developer at Points, an exceptional company in the industry.</p>
                        <p className="my-info-text">My educational journey, coupled with my hands-on experience at BrainStation, Lambton & Plusgrade, has equipped me with proficiency in a wide array of programming languages and frameworks, including React, NodeJS, Express, KnexJS, MySQL, SCSS, JavaScript, HTML, Python, SQL, Java, and C#. Additionally, I possess a sound understanding of cloud computing and have worked with AWS services, such as Amazon RDS connected to MySQL databases and Amazon S3 Buckets with the help of Cyberduck. My versatility extends to both sides of the DevOps spectrum, and I am well-versed in essential tools such as GitHub|GitLab for version control, AWS|Netlify|Heroku|GoDaddy for deployment, Cypress for testing, and I have a comprehensive grasp of BEM principles, Agile project practices, and Scrum fundamentals. Furthermore, I possess comprehensive knowledge with useful tools such as Salesforce, Jira, Notion & Google sheets|Google docs|Google slides.</p>
                        <p className="my-info-text">My extensive experience running my own landscaping business has honed my organizational and communication skills, allowing me to consistently execute tasks with diligence and precision.</p>
                    </div>
                    <div className="all-i-know-container">
                        <div className="things-i-know-list-container">
                            <div className="what-i-know-logo-container">
                                <h3 className="what-i-know-title">Languages</h3>
                                <img  className="what-i-know-img" src={languages} alt="languages"/>
                            </div>
                            <div className="button-container">
                                <img alt="HTML" src="https://img.shields.io/badge/HTML-1572B6?&logoColor=white&style=for-the-badge" />
                                <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-E34F26?t&logoColor=white&style=for-the-badge" />
                                <img alt="SCSS" src="https://img.shields.io/badge/SCSS-1572B6?&logoColor=white&style=for-the-badge" />
                                <img alt="CSS" src="https://img.shields.io/badge/CSS-E34F26?&logoColor=white&style=for-the-badge" />
                                <img alt="Python" src="https://img.shields.io/badge/Python-1572B6?&logoColor=white&style=for-the-badge" />
                                <img alt='SQL' src='https://img.shields.io/badge/SQL-100000?style=for-the-badge&logo=&logoColor=white&labelColor=E34F26&color=E34F26'/>
                            </div>
                        </div>
                        <div className="things-i-know-list-container">
                            <div className="what-i-know-logo-container">
                                <h3 className="what-i-know-title">Libraries</h3>
                                <img  className="what-i-know-img" src={libraries} alt="libraries"/>
                            </div>
                            <div className="button-container">
                                <img alt="React" src="https://img.shields.io/badge/React-1572B6?&logoColor=white&style=for-the-badge" />
                                <img alt="NPM" src="https://img.shields.io/badge/NPM-E34F26?&logoColor=white&style=for-the-badge" />
                                <img alt="Express.JS" src="https://img.shields.io/badge/Express JS-1572B6?&logoColor=white&style=for-the-badge" />
                                <img alt="Node.JS" src="https://img.shields.io/badge/Node JS-E34F26?&logoColor=white&style=for-the-badge" />
                                <img alt='Knex.JS' src='https://img.shields.io/badge/KNEX_JS-100000?style=for-the-badge&logo=&logoColor=white&labelColor=1572B6&color=1572B6'/>
                            </div>
                        </div>
                        <div className="things-i-know-list-container">
                            <div className="what-i-know-logo-container">
                                <h3 className="what-i-know-title">Technologies</h3>
                                <img  className="what-i-know-img" src={technologies} alt="technologies"/>
                            </div>
                            <div className="button-container">
                                <img alt='Jira' src='https://img.shields.io/badge/jira-100000?style=for-the-badge&logo=&logoColor=white&labelColor=E34F26&color=E34F26'/>
                                <img alt='RestAPI' src='https://img.shields.io/badge/REST_API-100000?style=for-the-badge&logo=&logoColor=white&labelColor=1572B6&color=1572B6'/>
                                <img alt='AWS' src='https://img.shields.io/badge/AWS-100000?style=for-the-badge&logo=&logoColor=white&labelColor=E34F26&color=E34F26'/>
                                <img alt="MySQL" src="https://img.shields.io/badge/MySQL-1572B6?&logoColor=white&style=for-the-badge" />
                                <img alt='MongoDB' src='https://img.shields.io/badge/Mongo_db-100000?style=for-the-badge&logo=&logoColor=white&labelColor=E34F26&color=E34F26'/>
                                <img alt='CyberDuck' src='https://img.shields.io/badge/cyberduck-100000?style=for-the-badge&logo=&logoColor=white&labelColor=1572B6&color=1572B6'/>
                                <img alt='SalesForce' src='https://img.shields.io/badge/salesforce-100000?style=for-the-badge&logo=&logoColor=white&labelColor=E34F26&color=E34F26'/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutMe;