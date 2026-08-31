"use client";

import { useEffect, useRef, useState } from "react";

export default function Counter({ to }) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let frame;
    const animate = () => {
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / 1600, 1);
        setValue(Math.round((1 - Math.pow(1 - progress, 3)) * to));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        animate();
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    observer.observe(node);
    return () => { observer.disconnect(); if (frame) cancelAnimationFrame(frame); };
  }, [to]);

  return <span ref={ref}>{value}</span>;
}
