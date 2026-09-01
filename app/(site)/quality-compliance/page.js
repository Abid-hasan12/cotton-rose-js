import PageHero from "@/components/PageHero";
import FadeIn from "@/components/FadeIn";
import CtaBanner from "@/components/CtaBanner";
import { dueDiligenceAreas, qualityCheckpoints } from "@/data/compliance";

export const metadata = {
  title: "Quality & Compliance",
  description: "How CottonRose coordinates quality assurance, inspections, supplier due diligence, and buyer-required documentation.",
};

export default function QualityCompliancePage() {
  return <>
    <PageHero title="Quality & Compliance" crumb="Quality & Compliance" image="/images/banner2.png" />
    <section className="section"><div className="container">
      <FadeIn className="section__head"><span className="section-label">CottonRose quality assurance</span><h2>Documented checkpoints, clear reporting</h2><p>Quality requirements are defined against the buyer brief and managed through order-specific material, workmanship, inspection, and shipment-readiness checkpoints.</p></FadeIn>
      <div className="quality-grid">{qualityCheckpoints.map((item, index) => <FadeIn as="article" className="quality-card" key={item.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item.title}</h3><p>{item.text}</p></FadeIn>)}</div>
    </div></section>
    <section className="section section--grey"><div className="container">
      <FadeIn className="section__head"><span className="section-label">Supplier due diligence</span><h2>Compliance coordination, not borrowed credentials</h2><p>CottonRose does not present supplier certificates as its own. Applicable evidence is reviewed for the proposed order and shared privately with qualified buyers.</p></FadeIn>
      <div className="due-diligence-grid">{dueDiligenceAreas.map(([title, text]) => <FadeIn as="article" className="due-diligence-card" key={title}><h3>{title}</h3><p>{text}</p></FadeIn>)}</div>
      <FadeIn className="compliance-note"><strong>Important scope note</strong><p>Supplier selection and document availability depend on product, material, destination market, buyer program, and current validity. Factory identities, facility profiles, capacities, and reports are not published on this portfolio.</p></FadeIn>
    </div></section>
    <CtaBanner title="Need Documents for a Proposed Order?" text="Tell us the product, destination market, and buyer requirements so we can review the applicable due-diligence scope privately." button="Request Information" />
  </>;
}
