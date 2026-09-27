"use client";

import { useCallback, useRef, useState } from "react";

// Reveals an element once it scrolls into view, and keeps it revealed.
// Uses a callback ref (not useRef + useEffect) so the observer attaches
// the moment the element actually mounts — including when that element
// only appears after data finishes loading (e.g. entries fetched from
// Supabase). A plain useRef + effect only checks for the element once,
// on the hook's own first render; if the element isn't there yet at
// that moment, it's never observed, and the fade-in never fires.
export function useScrollReveal() {
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef(null);

  const ref = useCallback((el) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    if (!el) return;

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
    observerRef.current = observer;
  }, []);

  return [ref, isVisible];
}