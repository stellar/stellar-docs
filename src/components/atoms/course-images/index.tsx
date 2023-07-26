import React, { ReactNode } from "react";
import styles from "./style.module.css";

interface ImageHolderProps {
  image: ReactNode;
}

export function ImageHolder({ image }: ImageHolderProps) {
  return <div className={styles.image_holder}>{image}</div>;
}
