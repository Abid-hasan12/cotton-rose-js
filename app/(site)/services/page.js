import PageHero from "@/components/PageHero";
import Image from "next/image";
import FadeIn from "@/components/FadeIn";
import CtaBanner from "@/components/CtaBanner";

export const metadata = {
  title: "Sourcing Services",
  description: "CottonRose buyer-representation services across product development, commercial coordination, material sourcing, order management, quality assurance, and shipment support.",
};

const services = [
  { title: "Product Development", image: "/images/banner2.png", alt: "Tech pack and material swatches used during apparel product development", text: "We translate the buyer's design and technical brief into a structured development plan, coordinate samples, and keep comments and approvals organized.", points: ["Tech-pack and requirement review", "Proto, fit, and pre-production sample coordination", "Trim, color, and construction follow-up"], deliverable: "Approved development direction and sample-status record" },
  { title: "Costing & Commercial Coordination", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80", alt: "Commercial planning documents on a meeting table", text: "We coordinate itemized costing and commercial terms so assumptions, materials, quantities, and responsibilities are clear before order confirmation.", points: ["Cost breakdown review", "MOQ and lead-time confirmation", "Commercial clarification and follow-up"], deliverable: "Aligned commercial proposal and order assumptions" },
  { title: "Material & Supplier Sourcing", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80", alt: "Fabric and apparel materials prepared for sourcing review", text: "We identify an appropriate sourcing route for the product brief and coordinate fabric, yarn, trims, accessories, and required documentation.", points: ["Product and material matching", "Supplier due-diligence coordination", "Testing and documentation requirements"], deliverable: "Order-specific sourcing recommendation" },
  { title: "Order Management", image: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=900&q=80", alt: "Planning notebook used for order management", text: "A dedicated CottonRose contact follows the order plan, approvals, material status, milestones, risks, and corrective actions with clear buyer updates.", points: ["Critical-path and milestone tracking", "Approval and change control", "Risk escalation and status reporting"], deliverable: "Documented order plan and progress updates" },
  { title: "Quality Assurance", image: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=900&q=80", alt: "Apparel details being reviewed for quality", text: "We coordinate material checks and in-process and final inspection stages against the buyer-approved specification and inspection standard.", points: ["Material and workmanship checkpoints", "Inspection coordination against agreed AQL", "Finding, reporting, and corrective-action follow-up"], deliverable: "Buyer-relevant quality and inspection reporting" },
  { title: "Shipment Coordination", image: "https://images.unsplash.com/photo-1580913428023-02c695666d61?auto=format&fit=crop&w=900&q=80", alt: "Shipping containers representing export logistics coordination", text: "We support packing readiness, export documentation, freight handover, and shipment-status communication through the final delivery stage.", points: ["Packing and documentation review", "Freight-forwarder coordination", "Shipment-status follow-up"], deliverable: "Shipment document and handover status" },
];

export default function ServicesPage() {
  return <>
    <PageHero title="Sourcing Services" crumb="Services" image="/images/banner2.png" />
    <section className="section"><div className="container">
      <FadeIn className="section__head"><span className="section-label">Buyer representation from brief to shipment</span><h2>One coordinated sourcing workflow</h2><p>Each service supports the same six-stage order journey, with a clear buyer-facing deliverable at every stage.</p></FadeIn>
      {services.map((service, index) => (
        <article className={`service-block${index % 2 ? " service-block--reverse" : ""}`} key={service.title}>
          <FadeIn className="service-block__img"><Image src={service.image} alt={service.alt} fill sizes="(max-width: 768px) 100vw, 50vw" /></FadeIn>
          <FadeIn className="service-block__text"><span className="service-block__num">Service {String(index + 1).padStart(2, "0")}</span><h2>{service.title}</h2><p>{service.text}</p><ul>{service.points.map((point) => <li key={point}>{point}</li>)}</ul><p className="service-block__deliverable"><strong>Buyer deliverable:</strong> {service.deliverable}</p></FadeIn>
        </article>
      ))}
    </div></section>
    <CtaBanner title="Need End-to-End Sourcing Support?" text="Share your product brief and CottonRose will confirm the most practical next step." button="Talk to Our Team" />
  </>;
}
