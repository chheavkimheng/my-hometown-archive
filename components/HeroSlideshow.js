"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// How long each photo stays before the next one fades in.
const SLIDE_MS = 6000;

const styles = {
  wrap: { position: "absolute", inset: 0 },
  image: { objectFit: "cover" },
};

export default function HeroSlideshow({ images }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    // People who ask their device for less motion get a still photo.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const timer = setInterval(() => {
      setCurrent((index) => (index + 1) % images.length);
    }, SLIDE_MS);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div style={styles.wrap} aria-hidden="true">
      {images.map(({ src, position }, index) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          priority={index === 0}
          quality={90}
          sizes="100vw"
          className={`hero-slide ${index === current ? "is-active" : ""}`}
          style={{ ...styles.image, objectPosition: position ?? "center" }}
        />
      ))}
    </div>
  );
}