import PageHero from "@/components/PageHero";
import Image from "next/image";
import FadeIn from "@/components/FadeIn";
import CtaBanner from "@/components/CtaBanner";
import { fetchPublicApi } from "@/lib/public-api-client";

export const metadata = {
  title: "Sourcing Services",
  description: "CottonRose buyer-representation services across product development, commercial coordination, material sourcing, order management, quality assurance, and shipment support.",
};

export default async function ServicesPage() {
  const services = await fetchPublicApi("/api/services", "services");

  return <>
    <PageHero title="Sourcing Services" crumb="Services" image="/images/banner2.png" />
    <section className="section"><div className="container">
      <FadeIn className="section__head"><span className="section-label">Buyer representation from brief to shipment</span><h2>One coordinated sourcing workflow</h2><p>Each service supports the same six-stage order journey, with a clear buyer-facing deliverable at every stage.</p></FadeIn>
      {services.map((service, index) => (
        <article className={`service-block${index % 2 ? " service-block--reverse" : ""}`} key={service.title}>
          <FadeIn className="service-block__img"><Image src={service.image?.url || "/images/banner2.png"} alt={service.image?.alt || service.title} fill sizes="(max-width: 768px) 100vw, 50vw" /></FadeIn>
          <FadeIn className="service-block__text"><span className="service-block__num">Service {String(index + 1).padStart(2, "0")}</span><h2>{service.title}</h2><p>{service.description}</p><ul>{service.points.map((point) => <li key={point}>{point}</li>)}</ul><p className="service-block__deliverable"><strong>Buyer deliverable:</strong> {service.deliverable}</p></FadeIn>
        </article>
      ))}
    </div></section>
    <CtaBanner title="Need End-to-End Sourcing Support?" text="Share your product brief and CottonRose will confirm the most practical next step." button="Talk to Our Team" />
  </>;
}
