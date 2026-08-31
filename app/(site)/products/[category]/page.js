import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import FadeIn from "@/components/FadeIn";
import CtaBanner from "@/components/CtaBanner";
import { products } from "@/data/products";

export function generateStaticParams() {
  return products.map((product) => ({ category: product.id }));
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const product = products.find((item) => item.id === category);
  if (!product) return {};

  return {
    title: product.name,
    description: `${product.name} product offerings, fabric constructions, and monthly production capacity from Cottonrose.`,
  };
}

export default async function ProductCategoryPage({ params }) {
  const { category } = await params;
  const product = products.find((item) => item.id === category);
  if (!product) notFound();

  return (
    <>
      <PageHero title={product.name} crumb={`Product Categories / ${product.name}`} image={product.image} />
      <section className="section category-detail">
        <div className="container">
          <FadeIn as={Link} href="/products" className="category-detail__back">← All Product Categories</FadeIn>

          <div className="category-detail__layout">
            <FadeIn className="category-detail__visual">
              <Image src={product.image} alt={product.alt} fill sizes="(max-width: 768px) 100vw, 48vw" priority />
              <div className="category-detail__capacity">
                <span>Monthly capacity</span>
                <strong>{product.capacityLabel}</strong>
                <small>Pcs / month</small>
              </div>
            </FadeIn>

            <FadeIn className="category-detail__content">
              <span className="section-label">Product portfolio & technical specifications</span>
              <h2>{product.name} manufacturing capability</h2>

              <div className="category-detail__group">
                <h3><span aria-hidden="true">+</span> Product Offering</h3>
                <ul>{product.offerings.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>

              <div className="category-detail__group">
                <h3><span aria-hidden="true">◇</span> Fabric Construction</h3>
                <ul>{product.fabrics.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            </FadeIn>
          </div>

          <FadeIn as="nav" className="category-detail__nav" aria-label="Other product categories">
            {products.map((item) => (
              <Link href={`/products/${item.id}`} className={item.id === product.id ? "category-detail__nav-link category-detail__nav-link--active" : "category-detail__nav-link"} key={item.id}>
                {item.name}
              </Link>
            ))}
          </FadeIn>
        </div>
      </section>
      <CtaBanner title={`Source ${product.name} with Cottonrose`} text="Send us your tech pack or reference image and we'll quote within days." />
    </>
  );
}
