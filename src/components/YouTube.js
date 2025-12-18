import React from 'react';
import PropTypes from 'prop-types';

const YouTube = ({ ID }) => (
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
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" // tilt screen
      allowFullScreen
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "25pt"
      }}
    ></iframe>
  </div>
);

YouTube.propTypes = {
  ID: PropTypes.string.isRequired,
};

export default YouTube;