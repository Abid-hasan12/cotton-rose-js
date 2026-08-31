import Link from "next/link";
import Image from "next/image";
import FadeIn from "@/components/FadeIn";
import Counter from "@/components/Counter";
import CtaBanner from "@/components/CtaBanner";
import { products } from "@/data/products";

const features = [
  ["No Strict MOQ", "Flexible order quantities suited to both emerging and established brands."],
  ["Compliance First", "Every partner factory is audited against internationally recognized standards."],
  ["Fast Lead Time", "Streamlined production planning keeps orders moving on schedule."],
  ["Full Traceability", "End-to-end visibility from raw material to finished, shipped goods."],
  ["Dedicated Merchandising", "A single point of contact managing your account from sample to shipment."]
];

const process = [
  ["Sourcing", "Matching your requirements to the right factory partner."],
  ["Sampling", "Development and approval of pre-production samples."],
  ["Production", "Managed manufacturing with continuous progress tracking."],
  ["Quality Control", "Multi-stage inspection against agreed AQL standards."],
  ["Shipping", "Documentation and logistics coordination to final destination."]
];

export default function HomePage() {
  return (
    <>
      <section className="hero" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1800&q=80')" }}>
        <div className="container hero__content">
          <span className="hero__eyebrow">Premier Apparel Sourcing &amp; SCM & Garment Exporter | Bangladesh</span>
          <h1 className="hero__title">Your Trusted Apparel Sourcing Partner from Bangladesh</h1>
          <p className="hero__tagline">
            <span className="hero__brand-cotton">Cotton</span>{" "}
            <span className="hero__brand-rose">Rose</span>{" "}
            BD is a leading, fully compliant garment buying house and apparel sourcing agency based in Uttara, Dhaka—one of Bangladesh’s key hubs for the textile and apparel industry.
          </p>
          <p className="hero__tagline">We serve as a trusted, full-service supply chain partner to global fashion retailers, department stores, brand owners, and high-volume importers across Europe, North America, Australia, and Asia.</p>
          <div className="hero__actions">
            <Link href="/contact" className="btn btn--gold">Get a Quote</Link>
            <Link href="/products" className="btn btn--outline">Explore Products</Link>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="container stats__grid">
          <div className="stats__item"><div className="stats__number"><Counter to={12} />+</div><div className="stats__label">Years OF Experience</div></div>
          <div className="stats__item"><div className="stats__number"><Counter to={16} />M+</div><div className="stats__label">ANNUAL GARMENT EXPORTS</div></div>
          <div className="stats__item"><div className="stats__number"><Counter to={45} />+</div><div className="stats__label">AUDITED PARTNER MILLS</div></div>
          <div className="stats__item"><div className="stats__number"><Counter to={99} />.5%</div><div className="stats__label">ON-TIME DELIVERY RATE</div></div>
        </div>
      </section>

      <section className="section" id="categories">
        <div className="container">
          <FadeIn className="section__head"><span className="section-label">What We Source</span><h2>Product Categories</h2><p>Full-package sourcing across four core apparel categories, backed by a vetted factory network.</p></FadeIn>
          <div className="category-grid">
            {products.map(({ id, name, image, alt }) => (
              <FadeIn as={Link} href={`/products/${id}`} className="category-card" key={id}>
                <Image src={image} alt={alt} fill sizes="(max-width: 768px) 50vw, 33vw" />
                <div className="category-card__overlay"><span className="category-card__title">{name}</span><span className="category-card__link">View products →</span></div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--grey">
        <div className="container">
          <FadeIn className="section__head"><span className="section-label">Our Advantage</span><h2>Why Choose Cottonrose</h2><p>A merchandising-first approach built for long-term buyer partnerships.</p></FadeIn>
          <div className="features">
            {features.map(([title, text]) => <FadeIn className="feature-card" key={title}><div className="feature-card__icon">✓</div><h3 className="feature-card__title">{title}</h3><p>{text}</p></FadeIn>)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <FadeIn className="section__head"><span className="section-label">How We Work</span><h2>Our Sourcing Process</h2><p>A structured, transparent workflow from first inquiry to final shipment.</p></FadeIn>
          <div className="process">
            {process.map(([title, text], index) => <FadeIn className="process__step" key={title}><div className="process__num">{index + 1}</div><h3 className="process__title">{title}</h3><p>{text}</p></FadeIn>)}
          </div>
        </div>
      </section>

      <section className="section section--grey">
        <div className="container">
          <FadeIn className="section__head"><span className="section-label">Trust &amp; Compliance</span><h2>Certifications</h2></FadeIn>
          <FadeIn className="certs">{["ISO 9001", "GOTS", "OEKO-TEX", "Sedex", "amfori BSCI"].map((cert) => <span className="cert-badge" key={cert}>{cert}</span>)}</FadeIn>
        </div>
      </section>

      <CtaBanner title="Ready to Start Sourcing with Cottonrose?" text="Tell us about your product requirements and our merchandising team will respond within 1–2 business days." />
    </>
  );
}
