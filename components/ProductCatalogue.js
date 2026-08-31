"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import FadeIn from "./FadeIn";
import { products } from "@/data/products";

const maxCapacity = Math.max(...products.map((product) => product.capacity));

function DetailList({ title, items, variant }) {
  return (
    <div className={`portfolio-card__detail portfolio-card__detail--${variant}`}>
      <div className="portfolio-card__detail-heading">
        <span className="portfolio-card__detail-icon" aria-hidden="true">{variant === "fabric" ? "◇" : "+"}</span>
        <h4>{title}</h4>
      </div>
      <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
    </div>
  );
}

export default function ProductCatalogue() {
  const [activeId, setActiveId] = useState(products[0].id);

  useEffect(() => {
    const sections = products.map(({ id }) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveId(visible.target.id);
    }, { rootMargin: "-25% 0px -55%", threshold: [0.1, 0.3, 0.6] });

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const jumpTo = (id) => {
    setActiveId(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <FadeIn as="nav" className="portfolio-nav" aria-label="Product categories">
        {products.map((product, index) => (
          <button
            key={product.id}
            className={`portfolio-nav__item${activeId === product.id ? " portfolio-nav__item--active" : ""}`}
            onClick={() => jumpTo(product.id)}
            aria-current={activeId === product.id ? "true" : undefined}
          >
            <span>0{index + 1}</span>
            {product.name}
          </button>
        ))}
      </FadeIn>

      <div className="portfolio-list">
        {products.map((product, index) => (
          <FadeIn as="article" id={product.id} className={`portfolio-card${index % 2 ? " portfolio-card--reverse" : ""}`} key={product.id}>
            <div className="portfolio-card__visual">
              <Image src={product.image} alt={product.alt} fill sizes="(max-width: 768px) 100vw, 46vw" />
              <span className="portfolio-card__index">0{index + 1}</span>
              <div className="portfolio-card__image-title"><span>Category</span><h3>{product.name}</h3></div>
            </div>

            <div className="portfolio-card__content">
              <div className="portfolio-card__topline">
                <span className="section-label">Production capability</span>
                <span className="portfolio-card__count">0{index + 1} / 04</span>
              </div>
              <div className="portfolio-card__capacity">
                <div>
                  <strong className="portfolio-card__capacity-number">{product.capacityLabel}</strong>
                  <span className="portfolio-card__capacity-unit">Pcs / month</span>
                </div>
                <div className="portfolio-card__capacity-track" aria-hidden="true">
                  <span style={{ "--capacity-width": `${(product.capacity / maxCapacity) * 100}%` }} />
                </div>
              </div>
              <div className="portfolio-card__details">
                <DetailList title="Product Offering" items={product.offerings} variant="offering" />
                <DetailList title="Fabric Construction" items={product.fabrics} variant="fabric" />
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </>
  );
}
