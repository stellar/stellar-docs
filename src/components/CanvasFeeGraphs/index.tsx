import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

import styles from './styles.module.css'

export default function CanvasEmbed() {
  return (
    <div className={styles.CanvasFeeWrapper}>
      <BrowserOnly fallback={<div>Loading...</div>}>
        {() => {
          const Canvas = require("canvas-embed").Canvas;
          return <Canvas canvasId="k3X9xS" />;
        }}
      </BrowserOnly>
    </div>
  )
}
