import Image from "next/image";
import PageHero from "@/components/PageHero";
import FadeIn from "@/components/FadeIn";
import CtaBanner from "@/components/CtaBanner";
import LeadershipGrid from "@/components/LeadershipGrid";
import { company } from "@/data/company";

export const metadata = {
  title: "About Us",
  description: `Learn how ${company.name} represents apparel buyers through sourcing, quality assurance, order management, and shipment coordination from Bangladesh.`,
};

export default function AboutPage() {
  return (
    <>
      <PageHero title="About CottonRose" crumb="About" image="/images/banner2.png" />
      <section className="section"><div className="container story">
        <FadeIn><Image src="/images/banner2.png" width={1262} height={848} sizes="(max-width: 768px) 100vw, 50vw" alt="Apparel tech pack, material swatches, and sample-development tools" /></FadeIn>
        <FadeIn><span className="section-label">Our role</span><h2>The professional bridge between buyer and supplier</h2><p>CottonRose is an apparel buying house based in Dhaka, Bangladesh. We represent buyer requirements throughout product development, commercial alignment, material sourcing, order follow-up, quality assurance, and shipment coordination.</p><p>Our role is independent from production: we help each buyer identify an appropriate sourcing solution, maintain clear communication, monitor agreed checkpoints, and keep decisions documented from the first brief to final handover.</p></FadeIn>
      </div></section>
      <section className="section section--grey"><div className="container">
        <FadeIn className="section__head"><span className="section-label">What drives us</span><h2>Mission &amp; Vision</h2></FadeIn>
        <div className="mv-grid">
          <FadeIn className="mv-card"><h3>Our Mission</h3><p>To give apparel buyers dependable sourcing representation through transparent communication, disciplined order management, practical quality assurance, and responsible supply-chain coordination.</p></FadeIn>
          <FadeIn className="mv-card"><h3>Our Vision</h3><p>To be a trusted Bangladesh sourcing partner known for professional buyer advocacy, accountable execution, and long-term relationships built on clarity and consistency.</p></FadeIn>
        </div>
      </div></section>
      <section className="section"><div className="container why-bd">
        <FadeIn><Image src="/images/banner.jpeg" width={848} height={1261} sizes="(max-width: 768px) 100vw, 50vw" alt="Example of a finished apparel product available for sourcing" /></FadeIn>
        <FadeIn><span className="section-label">Buyer representation</span><h2>How CottonRose adds value</h2><ul><li>One accountable point of coordination from inquiry through shipment</li><li>Product and material sourcing aligned with the buyer&apos;s brief</li><li>Clear costing, sample comments, timelines, and order-status communication</li><li>Independent quality checkpoints and corrective-action follow-up</li><li>Support for documentation, logistics coordination, and final handover</li></ul></FadeIn>
      </div></section>
      <section className="section section--grey" id="leadership"><div className="container">
        <FadeIn className="section__head"><span className="section-label">Our team</span><h2>Leadership</h2><p>Select a profile to learn about each leader&apos;s role without leaving this page.</p></FadeIn>
        <FadeIn><LeadershipGrid /></FadeIn>
      </div></section>
      <CtaBanner title="Discuss Your Sourcing Requirements" text="Share your brief and our team will confirm the next practical step." button="Contact Us" />
    </>
  );
}
