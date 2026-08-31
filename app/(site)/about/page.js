import Link from "next/link";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import FadeIn from "@/components/FadeIn";
import CtaBanner from "@/components/CtaBanner";

export const metadata = {
  title: "About Us",
  description: "Learn about Cottonrose, a Dhaka-based apparel buying house connecting global brands with compliant Bangladeshi garment factories."
};

const leaders = [
  ["S M Mujibur Rahman", "CEO", "/ceo-profile"],
  ["MD. ZAHIDUL ISLAM", "MANAGING PARTNER", "/mp1"],
  ["MD. KHAIRUL ISLAM", "MANAGING PARTNER", "/mp2"],
  ["BAPPA PAUL", "MANAGING PARTNER", "/mp3"]
];

export default function AboutPage() {
  return (
    <>
      <PageHero title="About Cottonrose" crumb="About" image="https://images.unsplash.com/photo-1596079890744-c1a0462d0975?auto=format&fit=crop&w=1800&q=80" />
      <section className="section">
        <div className="container story">
          <FadeIn><Image src="/images/banner2.png" width={1262} height={848} sizes="(max-width: 768px) 100vw, 50vw" alt="Garment factory production floor" /></FadeIn>
          <FadeIn><span className="section-label">Our Story</span><h2>Built on Trust Between Buyers and Factories</h2>
            <p>Founded in Dhaka in 20XX, Cottonrose was established to close the gap between international fashion brands and Bangladesh&apos;s world-class garment manufacturing base. What began as a small sourcing desk has grown into a full-service buying house managing sourcing, sampling, production oversight, quality control, and logistics for buyers across Europe, North America, and the Middle East.</p>
            <p>Today, Cottonrose works with a curated network of 30+ compliant factories, employs a merchandising team of 500+ professionals, and supports brands of every size — from emerging labels with no strict MOQ requirements to established retailers running high-volume programs.</p>
          </FadeIn>
        </div>
      </section>
      <section className="section section--grey">
        <div className="container">
          <FadeIn className="section__head"><span className="section-label">What Drives Us</span><h2>Mission &amp; Vision</h2></FadeIn>
          <div className="mv-grid">
            <FadeIn className="mv-card"><h3>Our Corporate Mission</h3><p>To empower international apparel brands by providing reliable, agile, and cost-effective manufacturing solutions while prioritizing ethical labor practices, exceptional quality standards, and environmentally responsible textiles.</p></FadeIn>
            <FadeIn className="mv-card"><h3>Our Corporate Vision</h3><p>To be globally recognized as a benchmark apparel sourcing house from Bangladesh, renowned for operational excellence, full social and environmental compliance, and innovative approaches to sustainable fashion.</p></FadeIn>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container why-bd">
          <FadeIn><Image src="/images/banner.jpeg" width={848} height={1261} sizes="(max-width: 768px) 100vw, 50vw" alt="Skilled garment workers sewing" /></FadeIn>
          <FadeIn><span className="section-label">Sourcing Advantage</span><h2>Why Bangladesh</h2>
            <ul>
              <li>Skilled, experienced garment workforce built over decades of export manufacturing</li>
              <li>Highly competitive production pricing versus other major sourcing hubs</li>
              <li>Mature export infrastructure with established shipping and logistics networks</li>
              <li>Second-largest global garment exporter with continuously growing capacity</li>
              <li>Strong compliance ecosystem across ISO, GOTS, OEKO-TEX, Sedex, and amfori BSCI</li>
            </ul>
          </FadeIn>
        </div>
      </section>
      <section className="section section--grey">
        <div className="container">
          <FadeIn className="section__head"><span className="section-label">Our Team</span><h2>Leadership</h2></FadeIn>
          <div className="leadership">
            {leaders.map(([name, title, href]) => (
              <FadeIn className="leader-card" key={name}>
                <Image className="leader-card_avatar" src="/images/ceo.png" width={88} height={88} alt={name} />
                <div className="leader-card_name">{name}</div><div className="leader-card_title">{title}</div>
                <Link href={href} className="btn-view-profile">View Profile</Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
      <CtaBanner title="Let's Discuss Your Sourcing Needs" text="Our merchandising team is ready to scope your next production run." button="Contact Us" />
    </>
  );
}
