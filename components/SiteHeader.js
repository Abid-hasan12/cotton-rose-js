"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  ["/", "Home"],
  ["/about", "About"],
  ["/products", "Products"],
  ["/services", "Services"],
  ["/sustainability", "Sustainability"],
  ["/contact", "Contact"]
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [shrunk, setShrunk] = useState(false);

  useEffect(() => {
    const onScroll = () => setShrunk(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

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
          <li><Link href="/contact" className="btn btn--gold">Get a Quote</Link></li>
        </ul>
      </nav>
    </header>
  );
}
