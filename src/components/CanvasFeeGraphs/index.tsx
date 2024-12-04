import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

import styles from './styles.module.css';
import Translate from '@docusaurus/Translate';

const translatedLoading = (
  <Translate
    id='components.CanvasFeeGraphs.Loading'
    description='Placeholder loading string for when the real-time fee graphs are loading'>
    Loading...
  </Translate>
)

export default function CanvasEmbed() {
  return (
    <div className={styles.CanvasFeeWrapper}>
      <BrowserOnly fallback={<div>{translatedLoading}</div>}>
        {() => {
          const Canvas = require("canvas-embed").Canvas;
          return <Canvas canvasId="k3X9xS" />;
        }}
      </BrowserOnly>
    </div>
  );
}
