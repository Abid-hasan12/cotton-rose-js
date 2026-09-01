"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { products } from "@/data/products";
import { company, primaryNavigation } from "@/data/company";

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [shrunk, setShrunk] = useState(false);
  const productsRef = useRef(null);
  const navRef = useRef(null);

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
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : previousOverflow;
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const nav = navRef.current;
    const focusable = nav?.querySelectorAll('a[href], button:not([disabled])');
    focusable?.[0]?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") { setOpen(false); return; }
      if (event.key !== "Tab" || !focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

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
        <Link href="/" className="nav__logo" aria-label={`${company.name} home`}>Cotton<span>Rose</span></Link>
        <button
          className={`nav__toggle${open ? " nav__toggle--open" : ""}`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <span /><span /><span />
        </button>
        <ul ref={navRef} id="primary-navigation" className={`nav__list${open ? " nav__list--open" : ""}`}>
          {primaryNavigation.slice(0, 2).map(({ href, label, match }) => (
            <li key={href}><Link href={href} className={`nav__link${match(pathname) ? " nav__link--active" : ""}`}>{label}</Link></li>
          ))}
          <li
            ref={productsRef}
            className={`nav__dropdown${productsOpen ? " nav__dropdown--open" : ""}`}
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
          >
            <button
              className={`nav__link nav__dropdown-toggle${pathname.startsWith("/products") || pathname.startsWith("/diversified-products") ? " nav__link--active" : ""}`}
              aria-expanded={productsOpen}
              aria-controls="products-menu"
              onClick={() => setProductsOpen((value) => !value)}
            >
              Products <span className="nav__dropdown-chevron" aria-hidden="true" />
            </button>
            <ul id="products-menu" className="nav__dropdown-menu">
              <li><Link href="/products" className={pathname === "/products" ? "nav__dropdown-link nav__dropdown-link--active" : "nav__dropdown-link"}>All Product Offerings</Link></li>
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
              <li><Link href="/diversified-products" className={pathname.startsWith("/diversified-products") ? "nav__dropdown-link nav__dropdown-link--active" : "nav__dropdown-link"}>Diversified Product Lines</Link></li>
            </ul>
          </li>
          {primaryNavigation.slice(2).map(({ href, label, match }) => (
            <li key={href}><Link href={href} className={`nav__link${match(pathname) ? " nav__link--active" : ""}`}>{label}</Link></li>
          ))}
          <li><Link href="/contact" className="btn btn--gold">Get a Quote</Link></li>
        </ul>
      </nav>
    </header>
  );
}
