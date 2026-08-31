"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import FadeIn from "./FadeIn";
import { products } from "@/data/products";

const filters = ["all", ...products.map((product) => product.id)];

export default function ProductCatalogue() {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const closeButtonRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    const onKeyDown = (event) => event.key === "Escape" && setSelected(null);
    document.addEventListener("keydown", onKeyDown);
    if (selected) closeButtonRef.current?.focus();
    else triggerRef.current?.focus();
    return () => { document.body.style.overflow = ""; document.removeEventListener("keydown", onKeyDown); };
  }, [selected]);

  const openProduct = (product, trigger) => {
    triggerRef.current = trigger;
    setSelected(product);
  };

  return (
    <>
      <FadeIn className="filter-bar">
        {filters.map((value) => <button key={value} className={`filter-btn${filter === value ? " filter-btn--active" : ""}`} onClick={() => setFilter(value)}>{value === "all" ? "All" : value[0].toUpperCase() + value.slice(1)}</button>)}
      </FadeIn>
      <div className="products__grid">
        {products.map((product) => (
          <FadeIn as="article" id={product.id} className="product-card" key={product.id} hidden={filter !== "all" && filter !== product.id} role="button" tabIndex={0} aria-label={`View ${product.name} details`} onClick={(event) => openProduct(product, event.currentTarget)} onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openProduct(product, event.currentTarget);
            }
          }}>
            <div className="product-card__img-wrap"><Image src={product.image} alt={product.alt} fill sizes="(max-width: 768px) 50vw, 33vw" /></div>
            <div className="product-card__body"><span className="product-card__tag">{product.name}</span><h3 className="product-card__title">{product.title}</h3><p>{product.summary}</p></div>
          </FadeIn>
        ))}
      </div>
      <div className={`modal${selected ? " modal--open" : ""}`} aria-hidden={!selected} onMouseDown={(event) => event.target === event.currentTarget && setSelected(null)}>
        <div className="modal__box" role="dialog" aria-modal="true" aria-label={selected?.name || "Product details"}>
          <button ref={closeButtonRef} className="modal__close" aria-label="Close" onClick={() => setSelected(null)}>&times;</button>
          {selected && <div className="modal__img-wrap"><Image src={selected.image} alt={selected.alt} fill sizes="(max-width: 640px) 100vw, 640px" /></div>}
          <div className="modal__body"><h3 className="modal__title">{selected?.name}</h3><p className="modal__desc">{selected?.description}</p>
            <div className="modal__specs"><span><strong>MOQ:</strong> No strict MOQ</span><span><strong>Lead Time:</strong> 45–90 days</span><span><strong>Markets:</strong> Europe, N. America, Middle East</span><span><strong>Compliance:</strong> ISO 9001, GOTS, OEKO-TEX</span></div>
          </div>
        </div>
      </div>
    </>
  );
}
