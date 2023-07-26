import React, { useEffect } from 'react';

const SetDataUrl = ({ children }) => {
  useEffect(() => {
    document.body.setAttribute('data-url', window.location.pathname);
  }, []);

  console.log('window.location.pathname', window.location.pathname);
  return <>{children}</>;
};

export default SetDataUrl;
