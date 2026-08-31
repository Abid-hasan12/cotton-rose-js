"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { products } from "@/data/products";

const links = [
  ["/", "Home"],
  ["/about", "About"],
];

const linksAfterProducts = [
  ["/services", "Services"],
  ["/sustainability", "Sustainability"],
  ["/contact", "Contact"]
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [shrunk, setShrunk] = useState(false);
  const productsRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setShrunk(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setProductsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const closeDropdown = (event) => {
      if (event.key === "Escape" || (event.type === "pointerdown" && !productsRef.current?.contains(event.target))) {
        setProductsOpen(false);
      }
    };
    document.addEventListener("pointerdown", closeDropdown);
    document.addEventListener("keydown", closeDropdown);
    return () => {
      document.removeEventListener("pointerdown", closeDropdown);
      document.removeEventListener("keydown", closeDropdown);
    };
  }, []);

  return (
    <header className={`site-header${shrunk ? " site-header--shrink" : ""}`}>
      <nav className="nav container">
        <Link href="/" className="nav__logo">Cotton<span>{pathname === "/" ? "Rose" : "rose"}</span></Link>
        <button
          className={`nav__toggle${open ? " nav__toggle--open" : ""}`}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <span /><span /><span />
        </button>
        <ul id="primary-navigation" className={`nav__list${open ? " nav__list--open" : ""}`}>
          {links.map(([href, label]) => (
            <li key={href}>
              <Link href={href} className={`nav__link${pathname === href ? " nav__link--active" : ""}`}>
                {label}
              </Link>
            </li>
          ))}
          <li
            ref={productsRef}
            className={`nav__dropdown${productsOpen ? " nav__dropdown--open" : ""}`}
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
          >
            <button
              className={`nav__link nav__dropdown-toggle${pathname.startsWith("/products") ? " nav__link--active" : ""}`}
              aria-expanded={productsOpen}
              aria-controls="products-menu"
              onClick={() => setProductsOpen((value) => !value)}
            >
              Categories <span className="nav__dropdown-chevron" aria-hidden="true" />
            </button>
            <ul id="products-menu" className="nav__dropdown-menu">
              {products.map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/products/${product.id}`}
                    className={pathname === `/products/${product.id}` ? "nav__dropdown-link nav__dropdown-link--active" : "nav__dropdown-link"}
                  >
                    {product.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          {linksAfterProducts.map(([href, label]) => (
            <li key={href}>
              <Link href={href} className={`nav__link${pathname === href ? " nav__link--active" : ""}`}>
                {label}
              </Link>
            </li>
          ))}
          <li><Link href="/contact" className="btn btn--gold">Get a Quote</Link></li>
        </ul>
      </nav>
    </header>
  );
}
