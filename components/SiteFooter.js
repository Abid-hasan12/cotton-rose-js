"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { products } from "@/data/products";

export default function SiteFooter() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isContact = pathname === "/contact";
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__col">
            <div className="footer__logo">Cotton<span>{isHome ? "Rose" : "rose"}</span></div>
            <p>Apparel buying house based in Dhaka, Bangladesh, serving international fashion brands, retailers, and wholesalers.</p>
          </div>
          <div className="footer__col">
            <h4>Company</h4>
            <ul>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/services">Services</Link></li>
              <li><Link href="/sustainability">Sustainability</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer__col">
            <h4><Link href="/products">Product Categories</Link></h4>
            <ul>
              {products.map((product) => <li key={product.id}><Link href={`/products/${product.id}`}>{product.name}</Link></li>)}
            </ul>
          </div>
          <div className="footer__col">
            <h4>Contact</h4>
            <ul>
              <li>House No. 45, Road No. 4, Sector No. 11, Uttara Model Town, Uttara, Dhaka-{isContact ? "1230" : "1330"}, Bangladesh.</li>
              <li><a href="tel:+8801976694113">{isContact ? "+880 1976-694113" : "+880 1976694113"}</a></li>
              <li><a href="mailto:info@cottonrosebd.com">info@cottonrosebd.com</a></li>
            </ul>
            <div className="footer__social">
              <a href="#" aria-label="LinkedIn">in</a>
              <a href="#" aria-label="Facebook">f</a>
              <a href="#" aria-label="Instagram">ig</a>
            </div>
          </div>
        </div>
        <div className="footer__bottom">
          <span>&copy; 2026 Cottonrose. All rights reserved.</span>
          <span>Est. 20XX · Dhaka, Bangladesh</span>
        </div>
      </div>
    </footer>
  );
}
