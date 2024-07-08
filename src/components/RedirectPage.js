import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

function RedirectPage({ to }) {
  useEffect(() => {
    window.location.href = to;
  }, [to]);

  return null;
}

RedirectPage.propTypes = {
  to: PropTypes.string.isRequired,
};

export default RedirectPage;