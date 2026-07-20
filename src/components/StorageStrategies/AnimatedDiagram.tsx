import React, { useEffect, useRef, useState } from "react";
import "./diagrams.css";

interface AnimatedDiagramProps {
  id: string;
  caption?: string;
  children: React.ReactNode;
}

// Card that plays its CSS/SVG animations once it scrolls into view, with a
// replay button. Animations are gated behind the .play class (see diagrams.css).
export default function AnimatedDiagram({
  id,
  caption,
  children,
}: AnimatedDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);
  // .play must live in React state: it gates animation-play-state in CSS, and
  // an imperatively added class would be dropped on the next re-render.
  const [playing, setPlaying] = useState(false);
  const [restored, setRestored] = useState({
    instance: false,
    persistent: false,
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setPlaying(true);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const replay = () => {
    const el = ref.current;
    if (!el) {
      return;
    }
    setRestored({ instance: false, persistent: false });
    setPlaying(true);
    // Toggling .play only pauses/resumes; to restart from frame 0 the
    // animations themselves must be torn down and recreated.
    const anims = el.querySelectorAll<HTMLElement | SVGElement>(".anim");
    anims.forEach((a) => {
      a.style.animation = "none";
    });
    void (el as HTMLElement).offsetWidth;
    anims.forEach((a) => {
      a.style.animation = "";
    });
  };

  const className = [
    "ssd",
    playing ? "play" : "",
    restored.instance ? "restored-instance" : "",
    restored.persistent ? "restored-persistent" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={className} id={id} ref={ref}>
      <div className="diagram-controls">
        {id === "d0" ? (
          <>
            <button
              className="restore"
              type="button"
              aria-pressed={restored.instance}
              onClick={() =>
                setRestored((current) => ({ ...current, instance: true }))
              }
            >
              Restore instance
            </button>
            <button
              className="restore"
              type="button"
              aria-pressed={restored.persistent}
              onClick={() =>
                setRestored((current) => ({ ...current, persistent: true }))
              }
            >
              Restore persistent entry
            </button>
          </>
        ) : null}
        <button className="replay" type="button" onClick={replay}>
          {id === "d0" ? "↻ Replay expiry" : "↻ Replay"}
        </button>
      </div>
      {children}
      {caption ? <p className="caption">{caption}</p> : null}
    </div>
  );
}
