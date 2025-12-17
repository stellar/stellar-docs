import React, { type CSSProperties } from "react";

type YouTubeVid = {
  ID: string;
};

const containerStyle: CSSProperties = {
  position: "relative",
  width: "100%",
  paddingBottom: "56.25%", // Maintain 16:9 ratio
  height: 0,
  marginBottom: "23px",
};

const iframeStyle: CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  borderRadius: "25pt",
};

const YouTube = ({ ID }: YouTubeVid): JSX.Element => (
  <div style={containerStyle}>
    <iframe
      src={`https://www.youtube-nocookie.com/embed/${ID}?controls=0&rel=0&modestbranding=1`}
      title="Informational explainer"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; gyroscope"
      allowFullScreen
      style={iframeStyle}
    />
  </div>
);

export default YouTube;
