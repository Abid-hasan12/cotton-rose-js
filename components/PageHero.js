import Link from "next/link";

export default function PageHero({ title, crumb, image }) {
  return (
    <section className="page-hero" style={{ backgroundImage: `url('${image}')` }}>
      <div className="container">
        <h1 className="page-hero__title">{title}</h1>
        <p className="page-hero__crumb"><Link href="/">Home</Link> / {crumb}</p>
      </div>
    </section>
  );
}
