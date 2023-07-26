import React, { ReactNode, useState } from "react";
import styles from "./style.module.css";
import { ImageHolder } from "../course-images";

interface CarouselProps {
  images: ReactNode[];
}

export function Carousel({ images }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const previousSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className={styles.carousel}>
      <button onClick={previousSlide}>Previous</button>
      <div className={styles.slideContainer}>
        <div
          className={styles.slideWrapper}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className={`${styles.slide} ${
                index === currentIndex ? styles.active : ""
              }`}
            >
              <ImageHolder image={image} />
            </div>
          ))}
        </div>
      </div>
      <button onClick={nextSlide}>Next</button>
    </div>
  );
}
