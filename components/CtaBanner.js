import Link from "next/link";
import FadeIn from "./FadeIn";

const image = "/images/banner2.png";

export default function CtaBanner({ title, text, button = "Get a Quote" }) {
  return (
    <section className="cta-banner" style={{ backgroundImage: `url('${image}')` }}>
      <div className="container">
        <FadeIn as="h2" className="cta-banner__title">{title}</FadeIn>
        <FadeIn as="p">{text}</FadeIn>
        <FadeIn as={Link} href="/contact" className="btn btn--gold">{button}</FadeIn>
      </div>
    </section>
  );
}
