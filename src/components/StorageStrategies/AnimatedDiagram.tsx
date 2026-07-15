import React, { useEffect, useRef } from "react";
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

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("play");
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
    el.classList.add("play");
  };

  return (
    <div className="ssd" id={id} ref={ref}>
      <button className="replay" type="button" onClick={replay}>
        ↻ replay
      </button>
      {children}
      {caption ? <p className="caption">{caption}</p> : null}
    </div>
  );
}
