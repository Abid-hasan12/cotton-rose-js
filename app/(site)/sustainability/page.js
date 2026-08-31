import PageHero from "@/components/PageHero";
import Image from "next/image";
import FadeIn from "@/components/FadeIn";
import CtaBanner from "@/components/CtaBanner";

export const metadata = {
  title: "Sustainability & Compliance",
  description: "Cottonrose's certifications and commitment to ethical labor standards, worker welfare, and environmental responsibility."
};

const certifications = [
  [<>ISO<br />9001</>, "ISO 9001", "Quality management systems certification for consistent production standards."],
  ["GOTS", "GOTS", "Global Organic Textile Standard for certified organic fiber processing."],
  [<>OEKO<br />TEX</>, "OEKO-TEX", "Testing and certification for textiles free of harmful substances."],
  ["Sedex", "Sedex", "Ethical trade data exchange supporting responsible sourcing practices."],
  [<>amfori<br />BSCI</>, "amfori BSCI", "Business Social Compliance Initiative auditing for fair labor conditions."]
];

export default function SustainabilityPage() {
  return <>
    <PageHero title="Sustainability & Compliance" crumb="Sustainability" image="https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1800&q=80" />
    <section className="section"><div className="container">
      <FadeIn className="section__head"><span className="section-label">Verified Standards</span><h2>Our Certifications</h2><p>Cottonrose partners exclusively with factories that meet or exceed the following internationally recognized standards.</p></FadeIn>
      <div className="cert-grid">{certifications.map(([badge, title, text]) => <FadeIn className="cert-card" key={title}><div className="cert-card__badge">{badge}</div><h3>{title}</h3><p>{text}</p></FadeIn>)}</div>
    </div></section>
    <section className="section section--grey"><div className="container why-bd">
      <FadeIn className="commitment__image"><Image src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80" alt="Sustainable textile production" fill sizes="(max-width: 768px) 100vw, 50vw" /></FadeIn>
      <FadeIn className="compliance"><h2>Our Commitment</h2><p>Cottonrose holds every partner factory to consistent labor standards, including fair wages, safe working conditions, reasonable working hours, and freedom of association, in line with internationally recognized frameworks.</p><p>We conduct regular social and environmental audits across our factory network, prioritizing worker welfare alongside production quality. Environmental responsibility — including responsible water use, chemical management, and waste reduction — is a standing requirement for every partner mill and factory.</p><p>This is an ongoing commitment. As standards evolve, our compliance program is reviewed and strengthened in step.</p></FadeIn>
    </div></section>
    <CtaBanner title="Sourcing You Can Stand Behind" text="Ask us for factory compliance documentation for your program." button="Contact Us" />
  </>;
}
