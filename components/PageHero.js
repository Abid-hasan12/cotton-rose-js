import Link from "next/link";

export default function PageHero({ title, crumb, image }) {
  return (
    <section className="page-hero" style={{ backgroundImage: `url('${image}')` }} aria-labelledby="page-title">
      <div className="container">
        <h1 className="page-hero__title" id="page-title">{title}</h1>
        <nav className="page-hero__crumb" aria-label="Breadcrumb"><ol><li><Link href="/">Home</Link></li><li aria-current="page">{crumb}</li></ol></nav>
      </div>
    </section>
  );
}
