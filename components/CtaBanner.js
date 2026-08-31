import Link from "next/link";
import FadeIn from "./FadeIn";

const image = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1800&q=80";

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
