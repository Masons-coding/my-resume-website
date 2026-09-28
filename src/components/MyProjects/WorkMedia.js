import "./WorkMedia.scss";

import { useEffect, useRef, useState } from "react";

import Icon from "../Icon/Icon.js";
import { prefersReducedMotion } from "../../utils/actions";

// Full-size viewer for a card's video or screenshot
const MediaViewer = ({ media, title, open, onClose }) => {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog ref={ref} className="media-viewer" onClose={onClose} onClick={(e) => e.target === ref.current && onClose()} aria-label={title}>
      {open && (
        <figure className="media-viewer__body">
          <button className="media-viewer__close" onClick={onClose} aria-label="Close">
            <Icon name="close" />
          </button>
          {media.type === "video" ? (
            <video className="media-viewer__media" src={media.src} poster={media.poster} controls autoPlay muted loop playsInline />
          ) : (
            <img className="media-viewer__media" src={media.src} alt={media.alt || title} />
          )}
          {media.caption && <figcaption>{media.caption}</figcaption>}
        </figure>
      )}
    </dialog>
  );
};

// Inline preview inside a work card. Videos play muted on loop only while on screen.
const WorkMedia = ({ media, title }) => {
  const [open, setOpen] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || prefersReducedMotion()) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.4 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const label = media.type === "video" ? "Watch full demo" : "View full size";

  return (
    <>
      <button type="button" className={`work-media work-media--${media.type}`} onClick={() => setOpen(true)} aria-label={`${label}: ${title}`}>
        {media.type === "video" ? (
          <video ref={videoRef} src={media.src} poster={media.poster} muted loop playsInline preload="metadata" aria-hidden="true" />
        ) : (
          <img src={media.src} alt={media.alt || title} loading="lazy" />
        )}
        <span className="work-media__cta">
          {media.type === "video" ? "▶" : "⤢"} {label}
        </span>
      </button>
      <MediaViewer media={media} title={title} open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default WorkMedia;
