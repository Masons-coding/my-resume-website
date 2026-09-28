// Single source of truth for all site content — edit here to update the site.

export const profile = {
  name: "Mason Clarke",
  title: "Client Solutions Architect",
  roles: [
    "Client Solutions Architect",
    "Web Integrator @ Plusgrade",
    "Full-Stack Developer",
    "React + Node.js Engineer",
    "Hackathon Winner",
  ],
  location: "Ottawa, Ontario",
  timeZone: "America/Toronto",
  email: "maclarkegdci@gmail.com",
  linkedin: "https://www.linkedin.com/in/mason-clarke/",
  github: "https://github.com/Masons-coding",
  repo: "https://github.com/Masons-coding/my-resume-website",
  resumePdf: "/Mason-Clarke-Resume.pdf",
  summary:
    "Highly motivated and fast-learning Client Solutions Architect with 4+ years of experience providing high-level solutions to clients, working in fast-paced environments, writing clean and maintainable code, and adapting to any new system — including leveraging AI to further improve projects and my team.",
};

export const stats = [
  { value: 4, suffix: "+", label: "Years of experience" },
  { value: 500, suffix: "+", label: "Client initiatives" },
  { value: 100, prefix: "$", suffix: "M+", label: "In sales generated" },
  { value: 100, suffix: "+ hrs", label: "Saved per project with AI tooling" },
];

export const about = [
  "I'm Mason — a dedicated, compassionate professional with a strong work ethic. I turn partner and product requirements into working solutions, and I love the moment a client sees their vision come to life.",
  "I've been directly involved in 500+ client initiatives that have generated over $100 million in sales. My sweet spot is understanding the systems already in place and bending them to drive higher customer satisfaction.",
  "My love for code started in high school with MIT's App Inventor — dragging blocks around until they became real apps. I still get that same thrill turning \"unreadable code\" into products people actually enjoy using.",
  "Before tech, I ran my own landscaping business — which is where I sharpened the organization and communication skills I use every day. Outside of work you'll find me into sports and fitness, travelling, and looking for ways to make a positive impact on others.",
];

export const experience = [
  {
    role: "Web Integrator",
    company: "Plusgrade",
    period: "Jul 2025 — Present",
    current: true,
    points: [
      "Turn partner and product requirements into concrete configuration, database/rule changes and feature activations — then validate them end-to-end in stage and production.",
      "Collaborate across teams to clarify requirements, align on scope, problem-solve, and close the loop on partner feedback.",
      "Leveraging AI to build and maintain a new internal testing tool, saving 100+ hours of work per project.",
    ],
    tags: ["AI tooling", "SQL", "Configuration", "QA / Testing"],
  },
  {
    role: "Web Developer",
    company: "Plusgrade",
    period: "Oct 2023 — Jul 2025",
    points: [
      "Built engaging landing pages, dynamic banners and countdown clocks with React, HTML, SCSS and JavaScript that enhanced UX and monetized engagement.",
      "Developed and optimized tailored promotional offers for diverse partner objectives, boosting customer acquisition and revenue.",
      "Communicated through Agile practices and interdepartmental collaboration, providing feedback for transparent project updates.",
    ],
    tags: ["React", "JavaScript", "SCSS", "Agile"],
  },
  {
    role: "Junior Full Stack Developer",
    company: "Clean Earth Foundation",
    period: "Jul 2022 — Oct 2023",
    points: [
      "Collaborated with the founders to build the non-profit's website with its own server and database.",
      "Created REST API endpoints and used HTTP methods for transferring data.",
      "Owned the full-stack process: front-end, back-end, and design/implementation.",
    ],
    tags: ["React", "Node.js", "Express", "MySQL", "REST"],
  },
];

export const education = [
  {
    school: "BrainStation",
    program: "Web Development Bootcamp",
    period: "Sep 2022 — Dec 2022",
    detail: "React, Node.js, Express, Knex.js and MySQL — full-stack from design to deployment.",
  },
  {
    school: "Lambton College",
    program: "Computer Science",
    period: "Sep 2020 — Apr 2022",
    detail: "Programming languages, algorithms, data structures, software development methodologies and computer architecture.",
  },
];

export const award = {
  title: "1st Place — BrainStation × LoyaltyOne Hackathon",
  detail:
    "24-hour challenge with the \"Responsive Zoomers\" team: a UI specialist, a data expert and I collaborated on how to make Air Miles enticing for Gen-Z — and won.",
};

export const skillGroups = {
  Languages: ["JavaScript", "HTML", "CSS", "SCSS", "Python", "SQL", "Java"],
  Frameworks: ["React", "Node.js", "Express.js", "Knex.js", "REST APIs", "NPM"],
  "Data & Cloud": ["MySQL", "MongoDB", "AWS (RDS, S3)", "Netlify", "Heroku", "Docker"],
  Tools: ["Git / GitHub", "GitLab", "Jira", "Salesforce", "Grafana", "Splunk", "Cypress", "Cyberduck"],
  Practices: ["Agile / Scrum", "BEM", "Client solutions", "AI-assisted development", "End-to-end testing"],
};

export const softSkills = [
  "Understanding client needs and delivering their vision on time",
  "Delivering on tight deadlines and adapting when needed",
  "Excellent communication & organization",
  "Eager to learn and fill role gaps",
];

export const projects = [
  {
    id: "clean-earth",
    name: "Clean Earth Foundation",
    tagline: "Full-stack non-profit platform",
    description:
      "A nonprofit dedicated to championing and coordinating environmental cleanup and preservation initiatives on a global scale. I built the whole thing — front-end, back-end, database and payments.",
    highlights: [
      "Custom Node/Express REST API backed by MySQL via Knex.js",
      "Google Maps API integration for cleanup locations",
      "Stripe payment integration for donations",
      "Designed and implemented end-to-end with the founders",
    ],
    stack: ["React", "JavaScript", "SCSS", "Node.js", "Express", "Knex.js", "MySQL", "Google Maps API", "Stripe"],
    live: "https://www.cleanearthfoundation.com/",
    liveLabel: "Visit live site",
    repos: [
      { label: "Front-end", url: "https://github.com/Masons-coding/Clean-Earth-Foundation" },
      { label: "Back-end", url: "https://github.com/Masons-coding/cleanearthfoundation-server" },
    ],
    logo: "clean-earth",
    accent: "#00adff",
  },
  {
    id: "weather",
    name: "Weather API App",
    tagline: "Python weather app — now running in your browser",
    description:
      "Originally a Python/Tkinter desktop app that pulls real-time weather for any city. I ported it to the web: the actual Python code runs client-side in a WebAssembly sandbox (Pyodide) — no server, no API keys, free to host.",
    highlights: [
      "Real Python executed in the browser via Pyodide / WebAssembly",
      "Temperature (°C/°F), conditions, wind speed & humidity",
      "Auto-refreshes every 30 minutes with a live countdown — like the original",
      "Keyless Open-Meteo API — zero secrets shipped to the browser",
    ],
    stack: ["Python", "Pyodide", "WebAssembly", "Tkinter (original)", "OpenWeatherMap (original)", "Open-Meteo API"],
    live: "/weather/",
    liveLabel: "Launch live demo",
    repos: [{ label: "Source", url: "https://github.com/Masons-coding/WeatherAPI-APP" }],
    logo: "weather",
    accent: "#e34f26",
  },
  {
    id: "portfolio",
    name: "This Website",
    tagline: "Interactive React portfolio",
    description:
      "The site you're on. A React single-page app with a particle hero, command palette, working terminal, scroll-driven animations and a hosted Python app — deployed on Netlify.",
    highlights: [
      "Zero UI libraries — hand-built React components & SCSS",
      "Command palette (Ctrl/⌘ + K) and an interactive terminal",
      "Canvas particle network, 3D tilt cards, animated counters",
      "Respects reduced-motion preferences",
    ],
    stack: ["React", "JavaScript", "SCSS", "Canvas API", "Netlify"],
    live: null,
    repos: [{ label: "Source", url: "https://github.com/Masons-coding/my-resume-website" }],
    logo: "mc",
    accent: "#1572b6",
  },
];

// Work I can describe but not link to (proprietary / event projects).
export const otherWork = [
  {
    id: "ai-testing",
    name: "AI-Powered Testing Tool",
    org: "Plusgrade · 2025",
    description:
      "An internal testing tool I'm building and maintaining with AI assistance to validate partner configurations end-to-end.",
    impact: "100+ hours saved per project",
    stack: ["AI-assisted dev", "Automation", "SQL", "QA"],
    badge: "Internal",
  },
  {
    id: "promo",
    name: "Promo Landing Pages & Countdown Clocks",
    org: "Plusgrade · 2023–2025",
    description:
      "Engaging partner landing pages, dynamic banners and urgency-driving countdown clocks that monetized user engagement for airline and travel partners.",
    impact: "Boosted acquisition & revenue",
    stack: ["React", "JavaScript", "SCSS", "HTML"],
    badge: "Live demo below",
    demo: "countdown",
  },
  {
    id: "hackathon",
    name: "Air Miles × Gen-Z",
    org: "BrainStation × LoyaltyOne Hackathon · 2022",
    description:
      "In 24 hours, the \"Responsive Zoomers\" team — a UI specialist, a data expert and I — designed how to make Air Miles enticing for Gen-Z.",
    impact: "🏆 1st place",
    stack: ["Product thinking", "UX", "Data", "Pitching"],
    badge: "Winner",
  },
];
