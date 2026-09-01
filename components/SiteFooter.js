import Link from "next/link";
import { products } from "@/data/products";
import { company, companyAddress } from "@/data/company";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__col">
            <div className="footer__logo">Cotton<span>Rose</span></div>
            <p>{company.description}</p>
          </div>
          <div className="footer__col">
            <h4>Company</h4>
            <ul>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/services">Services</Link></li>
              <li><Link href="/quality-compliance">Quality &amp; Compliance</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/privacy">Privacy Notice</Link></li>
            </ul>
          </div>
          <div className="footer__col">
            <h4><Link href="/products">Product Offering</Link></h4>
            <ul>
              <li><Link href="/products">All Product Offerings</Link></li>
              {products.map((product) => <li key={product.id}><Link href={`/products/${product.id}`}>{product.name}</Link></li>)}
              <li><Link href="/diversified-products">Diversified Product Lines</Link></li>
            </ul>
          </div>
          <div className="footer__col">
            <h4>Contact</h4>
            <ul>
              <li>{companyAddress}</li>
              <li><a href={`tel:${company.contact.mobileHref}`}>{company.contact.mobileDisplay}</a></li>
              <li><a href={`mailto:${company.contact.email}`}>{company.contact.email}</a></li>
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <span>&copy; {new Date().getFullYear()} {company.name}. All rights reserved.</span>
          <span>Buying house · Dhaka, Bangladesh</span>
        </div>
      </div>
    </footer>
  );
}
