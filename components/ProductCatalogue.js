"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

function getProductName(product) {
  return product.name || product.product_name || product.title || "Product";
}

function getProductCategory(product) {
  return product.category?.name || product.category || product.category_name || product.type || "Other";
}

export default function ProductCatalogue() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch("/api/products?group=core&limit=100");
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Could not load products.");
        if (!Array.isArray(result.data)) throw new Error("The products response was invalid.");
        setProducts(result.data);
      } catch (loadError) {
        setError(loadError.message);
      }
    }

    loadProducts();
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(products.map(getProductCategory))],
    [products],
  );
  const visibleProducts = useMemo(
    () => activeCategory === "All"
      ? products
      : products.filter((product) => getProductCategory(product) === activeCategory),
    [activeCategory, products],
  );

  return (
    <>
      {error && <p className="portfolio-message" role="alert">{error}</p>}
      {!error && products.length === 0 && <p className="portfolio-message">Loading products...</p>}
      {products.length > 0 && <nav className="portfolio-nav" aria-label="Product categories">
        {categories.map((category) => (
          <button
            type="button"
            key={category}
            className={`portfolio-nav__item${activeCategory === category ? " portfolio-nav__item--active" : ""}`}
            onClick={() => setActiveCategory(category)}
            aria-pressed={activeCategory === category}
          >
            {category}
          </button>
        ))}
      </nav>}

      <div className="portfolio-list" aria-live="polite">
        {visibleProducts.map((product, index) => (
          <article className="portfolio-card" key={product.slug || product.id || `${getProductName(product)}-${index}`}>
            <div className="portfolio-card__visual">
              {(product.image?.url || product.image || product.image_url) && <img src={product.image?.url || product.image || product.image_url} alt={product.image?.alt || product.alt || getProductName(product)} />}
              <span className="portfolio-card__index">{String(index + 1).padStart(2, "0")}</span>
              <div className="portfolio-card__image-title"><span>{getProductCategory(product)}</span><h3>{getProductName(product)}</h3></div>
            </div>

            <div className="portfolio-card__content">
              <div className="portfolio-card__topline">
                <span className="section-label">{getProductCategory(product)}</span>
              </div>
              <h3 className="portfolio-card__product-name">{getProductName(product)}</h3>
              {(product.description || product.summary) && <p className="portfolio-card__summary">{product.description || product.summary}</p>}
              {product.slug && <Link href={`/products/${product.slug}`} className="portfolio-card__link">Explore {getProductName(product)} <span aria-hidden="true">→</span></Link>}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
