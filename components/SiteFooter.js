import Link from "next/link";
import { fetchPublicApi } from "@/lib/public-api-client";

export default async function SiteFooter() {
  const [products, company] = await Promise.all([
    fetchPublicApi("/api/products?group=core&limit=100", "products", []),
    fetchPublicApi("/api/company", "company", null),
  ]);
  const safeCompany = company || {};
  const contacts = Array.isArray(safeCompany.contacts) ? safeCompany.contacts : [];
  const addresses = Array.isArray(safeCompany.addresses) ? safeCompany.addresses : [];
  const contact = contacts.find((item) => item.contact_type === "mobile") || contacts[0] || {};
  const address = addresses[0] || {};
  const companyAddress = [address.street, address.city, address.postcode, address.country]
    .filter(Boolean)
    .join(address.city || address.postcode ? ", " : " ")
    .replace(/,\s*,/g, ", ");
  const phoneHref = contact.link_value || contact.mobile_href || "";
  const phoneLabel = contact.display_value || contact.mobile_display || "";
  const emailContact = contacts.find((item) => item.contact_type === "email") || {};

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__col">
            <div className="footer__logo">Cotton<span>Rose</span></div>
            <p>{safeCompany.description || "Buyer-focused apparel sourcing and quality coordination."}</p>
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
              {(Array.isArray(products) ? products : []).map((product) => <li key={product.slug}><Link href={`/products/${product.slug}`}>{product.name}</Link></li>)}
              <li><Link href="/diversified-products">Diversified Product Lines</Link></li>
            </ul>
          </div>
          <div className="footer__col">
            <h4>Contact</h4>
            <ul>
              {companyAddress && <li>{companyAddress}</li>}
              {phoneLabel && <li><a href={phoneHref ? `tel:${phoneHref.replace(/^tel:/, "")}` : "#"}>{phoneLabel}</a></li>}
              {emailContact.link_value && <li><a href={emailContact.link_value}>{emailContact.display_value || emailContact.link_value.replace(/^mailto:/, "")}</a></li>}
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <span>&copy; {new Date().getFullYear()} {safeCompany.name || "CottonRose"}. All rights reserved.</span>
          <span>Buying house · Dhaka, Bangladesh</span>
        </div>
      </div>
    </footer>
  );
}
