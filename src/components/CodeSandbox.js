import React from 'react';

export const CodeSandbox = ({ module }) => (
    <iframe
        title={`Wallet Example - ${module}`}
        src={`https://codesandbox.io/embed/github/ElliotFriend/inline-stellar-examples/tree/main/?codemirror=1&forcerefresh=1&fontsize=13&hidedevtools=1&hidenavigation=1&theme=dark&view=split&initialpath=/${module}&module=/${module}/index.js,/${module}/index.html`}
        style={{ width: '100%', height: '500px', border: '0', borderRadius: '4px', overflow: 'hidden' }}
        allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
        sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
    ></iframe>
);