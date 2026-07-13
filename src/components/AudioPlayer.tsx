import React from "react";

type AudioPlayerProps = {
  src: string;
};

export default function AudioPlayer({ src }: AudioPlayerProps) {
  return (
    <div
      style={{
        maxWidth: 640,
        margin: "20px auto",
        padding: "12px 14px",
        borderRadius: 14,
        background: "var(--ifm-background-surface-color)",
        border: "2px solid var(--ifm-color-emphasis-300)",
      }}
    >
      <div
        style={{
          fontSize: "0.8rem",
          fontWeight: 600,
          color: "var(--ifm-color-primary)",
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
