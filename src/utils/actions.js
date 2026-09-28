import { profile } from "../data/resume";

// Tiny window-event bus so any component can trigger toasts / confetti.
export const toast = (message) => window.dispatchEvent(new CustomEvent("site:toast", { detail: message }));
export const confetti = () => window.dispatchEvent(new CustomEvent("site:confetti"));
export const openPalette = () => window.dispatchEvent(new CustomEvent("site:palette"));

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
};

export const openLink = (url) => window.open(url, "_blank", "noopener,noreferrer");

export const copyEmail = async () => {
  try {
    await navigator.clipboard.writeText(profile.email);
    toast("Email copied to clipboard ✉️");
  } catch {
    window.location.href = `mailto:${profile.email}`;
  }
};

export const ottawaTime = () =>
  new Date().toLocaleTimeString("en-CA", { timeZone: profile.timeZone, hour: "numeric", minute: "2-digit" });

export const sections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "terminal", label: "Terminal" },
  { id: "contact", label: "Contact" },
];
