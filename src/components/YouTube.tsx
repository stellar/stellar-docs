import React, { type ReactNode } from 'react';

type YouTubeVid = {
  ID: string;
};

export function YouTube({ ID }: { ID: string; }): ReactNode {
  return (
    <div style={{
      position: "relative",
      width: "100%",
      paddingBottom: "56.25%", // 16:9 aspect ratio
      height: 0,
      marginBottom: "23px",
    }}>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${ID}?rel=0&modestbranding=1`}
        title="Informational explainer"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; gyroscope" // screen tilt
        allowFullScreen
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: "0px",
          borderRadius: "25pt",
        }}
      />
    </div>
  );
};

export default YouTube;
