import React from 'react';
import Admonition from '@theme/Admonition';

export const Alert = ({ children }) => {
  return <Admonition type="info">{children}</Admonition>;
};
