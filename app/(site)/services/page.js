import PageHero from "@/components/PageHero";
import Image from "next/image";
import FadeIn from "@/components/FadeIn";
import CtaBanner from "@/components/CtaBanner";

export const metadata = {
  title: "Services",
  description: "Cottonrose's end-to-end sourcing services: Sourcing, Sampling, Production Management, Quality Control, and Logistics."
};

const services = [
  { title: "Sourcing", image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80", alt: "Fabric rolls for sourcing", text: "We match your product requirements, budget, and compliance needs against our network of 30+ vetted, compliant factories across Bangladesh — identifying the right manufacturing partner before a single sample is cut.", points: ["Factory capability and capacity matching", "Raw material and fabric sourcing", "Costing and price negotiation"] },
  { title: "Sampling", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80", alt: "Sample garment development", text: "Our sampling teams turn tech packs and design references into accurate pre-production samples, iterating quickly until fit, construction, and finish are approved.", points: ["Fit, proto, and pre-production samples", "Trim and accessory sourcing", "Rapid revision turnaround"] },
  { title: "Production Management", image: "https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80", alt: "Garment production line", text: "Dedicated merchandisers track every order in real time — managing production schedules, resolving line issues, and keeping factories accountable to agreed timelines.", points: ["Production planning and follow-up", "On-site progress monitoring", "Issue escalation and resolution"] },
  { title: "Quality Control", image: "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=900&q=80", alt: "Quality control inspection", text: "Multi-stage inspections — inline, mid-line, and final random inspection — are carried out against internationally recognized AQL standards before any shipment is approved.", points: ["Inline and final random inspection (AQL)", "Fabric and trim testing coordination", "Detailed inspection reporting"] },
  { title: "Logistics", image: "https://images.unsplash.com/photo-1580913428023-02c695666d61?auto=format&fit=crop&w=900&q=80", alt: "Warehouse and shipping logistics", text: "We coordinate documentation, freight booking, and customs clearance across sea, air, and rail — ensuring shipments arrive on time at their final destination.", points: ["Export documentation and compliance", "Freight forwarding coordination", "Real-time shipment tracking"] }
];

export default function ServicesPage() {
  return <>
    <PageHero title="Our Services" crumb="Services" image="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1800&q=80" />
    <section className="section"><div className="container">
      {services.map((service, index) => (
        <div className={`service-block${index % 2 ? " service-block--reverse" : ""}`} key={service.title}>
          <FadeIn className="service-block__img"><Image src={service.image} alt={service.alt} fill sizes="(max-width: 768px) 100vw, 50vw" /></FadeIn>
          <FadeIn className="service-block__text"><span className="service-block__num">Step {String(index + 1).padStart(2, "0")}</span><h2>{service.title}</h2><p>{service.text}</p><ul>{service.points.map((point) => <li key={point}>{point}</li>)}</ul></FadeIn>
        </div>
      ))}
    </div></section>
    <CtaBanner title="Need End-to-End Sourcing Support?" text="From first sample to final shipment, Cottonrose manages the process." button="Talk to Our Team" />
  </>;
}
