import React from "react";

type AudioBadgeProps = {
  src: string;
};

export default function AudioBadge({ src }: AudioBadgeProps) {
  return (
    <div
      style={{
        maxWidth: 640,
        margin: "20px auto",
        padding: "12px 14px",
        borderRadius: 14,
        background: "rgba(59, 130, 246, 0.12)", // blue
        border: "1px solid rgba(59, 130, 246, 0.35)",
      }}
    >
      <div
        style={{
          fontSize: "0.8rem",
          fontWeight: 600,
          color: "#3B82F6",
          marginBottom: 6,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        🎧 Audio Recording
      </div>

      <audio controls preload="metadata" style={{ width: "100%" }}>
        <source src={src} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
