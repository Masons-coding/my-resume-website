import "./Effects.scss";

import { useEffect, useRef, useState } from "react";

import Icon from "../Icon/Icon.js";
import { prefersReducedMotion } from "../../utils/actions";

const COLORS = ["#00adff", "#e34f26", "#1572b6", "#ffffff", "#ffd166"];

// Canvas confetti burst, triggered by the "site:confetti" event.
const Confetti = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let particles = [];
    let frame = null;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.vy += 0.25;
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.spin;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      });
      particles = particles.filter((p) => p.y < canvas.height + 40);
      frame = particles.length ? requestAnimationFrame(tick) : null;
    };

    const burst = () => {
      if (prefersReducedMotion()) return;
      resize();
      for (let i = 0; i < 180; i++) {
        const fromLeft = i % 2 === 0;
        particles.push({
          x: fromLeft ? 0 : canvas.width,
          y: canvas.height * 0.7,
          vx: (fromLeft ? 1 : -1) * (4 + Math.random() * 10),
          vy: -(8 + Math.random() * 12),
          size: 6 + Math.random() * 8,
          rot: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 0.3,
          color: COLORS[i % COLORS.length],
        });
      }
      if (!frame) frame = requestAnimationFrame(tick);
    };

    window.addEventListener("site:confetti", burst);
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("site:confetti", burst);
      window.removeEventListener("resize", resize);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={canvasRef} className="confetti" aria-hidden="true" />;
};

const Toast = () => {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    let timer;
    const show = (e) => {
      setMessage(e.detail);
      clearTimeout(timer);
      timer = setTimeout(() => setMessage(null), 2800);
    };
    window.addEventListener("site:toast", show);
    return () => {
      window.removeEventListener("site:toast", show);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className={`toast ${message ? "toast--show" : ""}`} role="status" aria-live="polite">
      {message}
    </div>
  );
};

const Effects = () => {
  const [progress, setProgress] = useState(0);
  const glowRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Soft glow that follows the cursor (mouse users only)
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || prefersReducedMotion()) return;
    const onMove = (e) => {
      if (glowRef.current) glowRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <>
      <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
      <div ref={glowRef} className="cursor-glow" aria-hidden="true" />
      <button
        className={`back-to-top ${progress > 0.08 ? "back-to-top--show" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" })}
        aria-label="Back to top"
      >
        <Icon name="arrowUp" />
      </button>
      <Toast />
      <Confetti />
    </>
  );
};

export default Effects;
