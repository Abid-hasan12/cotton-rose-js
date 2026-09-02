"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function ProductGallery({ images, categoryName }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const selected = selectedIndex === null ? null : images[selectedIndex];
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);

  const closeGallery = () => {
    setSelectedIndex(null);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  useEffect(() => {
    if (!selected) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") closeGallery();
      if (event.key === "ArrowRight") setSelectedIndex((index) => (index + 1) % images.length);
      if (event.key === "ArrowLeft") setSelectedIndex((index) => (index - 1 + images.length) % images.length);
      if (event.key === "Tab") {
        const controls = dialogRef.current?.querySelectorAll("button");
        if (!controls?.length) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => dialogRef.current?.querySelector("button")?.focus());
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [images.length, selected]);

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-12">
        {images.map((item, index) => (
          <button
            type="button"
            key={`${item.src}-${index}`}
            onClick={(event) => { triggerRef.current = event.currentTarget; setSelectedIndex(index); }}
            className={`group relative overflow-hidden rounded-2xl bg-brand-mist text-left shadow-product-card focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-4 ${index === 0 || index === 3 ? "aspect-[4/3] lg:col-span-7" : "aspect-[4/3] lg:col-span-5"}`}
            aria-label={`Open ${item.alt}`}
          >
            <Image src={item.src} alt={item.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 58vw" className="object-cover transition duration-700 group-hover:scale-105" />
            <span className="absolute inset-0 bg-gradient-to-t from-brand-navy/70 via-transparent to-transparent opacity-70 transition-opacity group-hover:opacity-90" />
            <span className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-sm font-semibold text-white">
              <span>{categoryName} · Reference {String(index + 1).padStart(2, "0")}</span>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-xl backdrop-blur-md transition-transform group-hover:scale-110" aria-hidden="true">↗</span>
            </span>
          </button>
        ))}
      </div>

      {selected && (
        <div ref={dialogRef} className="fixed inset-0 z-[2000] grid place-items-center bg-brand-navy/95 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={`${categoryName} image preview`} onMouseDown={(event) => event.target === event.currentTarget && closeGallery()}>
          <button type="button" onClick={closeGallery} className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white text-xl font-bold text-brand-navy shadow-xl transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold" aria-label="Close image preview">×</button>
          <button type="button" onClick={() => setSelectedIndex((selectedIndex - 1 + images.length) % images.length)} className="absolute left-4 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-2xl text-white backdrop-blur-md transition-colors hover:bg-brand-gold hover:text-brand-navy sm:left-8" aria-label="Previous image">‹</button>
          <div className="relative h-[75vh] w-[min(1100px,85vw)] overflow-hidden rounded-2xl">
            <Image src={selected.src} alt={selected.alt} fill sizes="90vw" priority className="object-contain" />
          </div>
          <button type="button" onClick={() => setSelectedIndex((selectedIndex + 1) % images.length)} className="absolute right-4 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-2xl text-white backdrop-blur-md transition-colors hover:bg-brand-gold hover:text-brand-navy sm:right-8" aria-label="Next image">›</button>
          <p className="absolute bottom-5 text-sm font-semibold text-white/75">{selectedIndex + 1} / {images.length}</p>
        </div>
      )}
    </>
  );
}
