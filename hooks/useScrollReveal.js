"use client";

import { useEffect, useRef, useState } from "react";

// Reveals an element once it scrolls into view, and keeps it revealed.
// Visibility lives in React state (not a class added directly to the
// DOM node), so it survives re-renders — typing in a search box,
// toggling language, anything — instead of getting reset back to
// invisible the next time the component renders.
export function useScrollReveal() {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isVisible]);

  return [ref, isVisible];
}