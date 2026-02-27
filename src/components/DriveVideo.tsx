import React from "react";

type Props = {
  ID: string;
};

export default function DrivePreviewCard({ ID }: Props) {
  const src = `https://drive.google.com/file/d/${ID}/preview`;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 960,
        margin: "16px auto",
        aspectRatio: "16 / 9",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(0,0,0,.18)",
        background: "rgba(0,0,0,.04)",
      }}
    >
      <iframe
        src={src}
        loading="lazy"
        title="Meeting Playback Video"
        allow="autoplay; fullscreen"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          border: 0,
        }}
      />
    </div>
  );
}
