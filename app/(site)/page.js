import Link from "next/link";
import Image from "next/image";
import FadeIn from "@/components/FadeIn";
import CtaBanner from "@/components/CtaBanner";
import SourcingProcess from "@/components/SourcingProcess";
import { fetchPublicApi } from "@/lib/public-api-client";

const proofPoints = [
  ["Buyer Representation", "One accountable CottonRose contact coordinates the brief, decisions, milestones, and follow-up."],
  ["Order-Specific Sourcing", "Product, material, quantity, compliance, price, and delivery needs guide every sourcing recommendation."],
  ["Quality Coordination", "Agreed material, workmanship, inspection, and shipment-readiness checkpoints are documented and followed."],
  ["Clear Communication", "Buyers receive practical updates, risk escalation, and decision records throughout the order journey."],
];

const features = [
  ["Brief-led sourcing", "Supplier and material options are assessed against the requirements of each buyer program."],
  ["Transparent commercials", "Costing assumptions, quantities, lead times, and responsibilities are clarified before confirmation."],
  ["Dedicated coordination", "A consistent contact follows product development, approvals, order status, quality, and shipment."],
  ["Private due diligence", "Applicable supplier documents are reviewed and shared with qualified buyers for the proposed order."],
];

export default async function HomePage() {
  const products = await fetchPublicApi("/api/products?group=core&limit=100", "products", []);

  return (
    <>
      <section className="hero" aria-labelledby="home-hero-title">
        <div className="hero__glow hero__glow--one" aria-hidden="true" />
        <div className="hero__glow hero__glow--two" aria-hidden="true" />
        <div className="container hero__grid">
          <div className="hero__content">
            <h1 className="hero__title" id="home-hero-title">From buyer brief to shipment, <span>one accountable sourcing partner.</span></h1>
            <p className="hero__tagline">CottonRose represents international buyers across product development, order-specific sourcing, quality coordination, commercial follow-up, and shipment handover.</p>
            <div className="hero__actions"><Link href="/contact" className="btn btn--gold">Discuss Your Requirement <span aria-hidden="true">→</span></Link><Link href="/products" className="btn btn--outline">Explore Product Offering</Link></div>
          </div>

          <div className="hero__visual" aria-label="CottonRose apparel sourcing portfolio">
            <div className="hero__visual-main">
              <Image src="/images/products/product-range.jpg" alt="Coordinated apparel range representing CottonRose sourcing" fill priority sizes="(max-width: 900px) 92vw, 44vw" />
              <div className="hero__visual-caption"><span>Buyer-focused sourcing</span><strong>Products aligned to your brief</strong></div>
            </div>
            <div className="hero__visual-secondary">
              <Image src="/images/products/woven-shirts.jpg" alt="Woven shirts illustrating CottonRose product sourcing" fill priority sizes="(max-width: 600px) 45vw, 17vw" />
            </div>
            <div className="hero__visual-note">
              <span>Core scope</span>
              <strong>Knitwear · Woven · Sweaters · Activewear</strong>
            </div>
            <div className="hero__journey" aria-label="CottonRose sourcing journey">
              <span>Buyer brief</span><i aria-hidden="true" />
              <span>Sourcing</span><i aria-hidden="true" />
              <span>Quality</span><i aria-hidden="true" />
              <span>Shipment</span>
            </div>
          </div>
        </div>
      </section>

      <section className="proof-strip" aria-label="CottonRose service principles"><div className="container proof-strip__grid">{proofPoints.map(([title, text]) => <div className="proof-strip__item" key={title}><strong>{title}</strong><span>{text}</span></div>)}</div></section>

      <section className="section" id="products"><div className="container">
        <FadeIn className="section__head"><span className="section-label">What we source</span><h2>Product Offering</h2><p>Four core sourcing groups supported by a broader catalogue. Availability is confirmed against each buyer&apos;s tech pack, quantity, materials, standards, and delivery target.</p></FadeIn>
        <div className="category-grid">{products.map(({ slug, name, image, summary }) => <FadeIn as={Link} href={`/products/${slug}`} className="category-card" key={slug}><Image src={image?.url || "/images/product-placeholder-1.svg"} alt={image?.alt || name} fill sizes="(max-width: 768px) 100vw, 50vw" /><div className="category-card__overlay"><span className="category-card__title">{name}</span><span className="category-card__summary">{summary}</span><span className="category-card__link">Explore offering →</span></div></FadeIn>)}</div>
        <FadeIn className="section-action"><Link href="/diversified-products" className="btn btn--navy">View Diversified Product Lines</Link></FadeIn>
      </div></section>

      <section className="section section--grey"><div className="container">
        <FadeIn className="section__head"><span className="section-label">Why CottonRose</span><h2>Professional buyer advocacy</h2><p>Our role is to keep buyer requirements visible, decisions documented, and sourcing activity accountable.</p></FadeIn>
        <div className="features">{features.map(([title, text]) => <FadeIn className="feature-card" key={title}><div className="feature-card__icon" aria-hidden="true">✓</div><h3 className="feature-card__title">{title}</h3><p>{text}</p></FadeIn>)}</div>
      </div></section>

      <section className="section"><div className="container"><FadeIn className="section__head"><span className="section-label">How we work</span><h2>Our Sourcing Process</h2><p>Six visible stages from the first technical review to shipment coordination.</p></FadeIn><SourcingProcess /></div></section>

      <section className="section section--grey"><div className="container"><FadeIn className="section__head"><span className="section-label">Quality &amp; compliance</span><h2>Due diligence built around the buyer program</h2><p>CottonRose coordinates quality checkpoints and reviews applicable supplier documentation without presenting supplier credentials as its own.</p><div className="section-action"><Link href="/quality-compliance" className="btn btn--navy">View Our Approach</Link></div></FadeIn></div></section>

      <CtaBanner title="Ready to Discuss Your Sourcing Brief?" text="Send the product, material, quantity, destination, and delivery requirements for an order-specific review." />
    </>
  );
}
