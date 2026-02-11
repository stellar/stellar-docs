import React, { type ReactNode } from 'react';

export function YouTube({ ID }: { ID: string; }): ReactNode {
  return (
    <div style={{
      position: "relative",
      width: "100%",
      paddingBottom: "56.25%", // Make 16 x 9
      height: 0,
      marginBottom: "23px"
    }}>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${ID}?controls=0&rel=0&modestbranding=1`}
        title="Informational explainer"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" // tilt screen
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
      ></iframe>
    </div>
  );
};

export default YouTube;
