import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import FadeIn from "@/components/FadeIn";
import CtaBanner from "@/components/CtaBanner";
import { fetchPublicApi } from "@/lib/public-api-client";

export async function generateMetadata({ params }) {
  const { category } = await params;
  const products = await fetchPublicApi(`/api/products?group=core&category=${encodeURIComponent(category)}&limit=100`, "products");
  const product = products[0];
  if (!product) return {};

  return {
    title: product.name,
    description: `${product.name} product offerings, material constructions, and sourcing support from CottonRose.`,
  };
}

export default async function ProductCategoryPage({ params }) {
  const { category } = await params;
  const products = await fetchPublicApi(`/api/products?group=core&limit=100`, "products");
  const product = products.find((item) => item.slug === category);
  if (!product) notFound();
  const image = product.image?.url || "/images/product-placeholder-1.svg";

  return (
    <>
      <PageHero title={product.name} crumb={`Products / ${product.name}`} image={image} />
      <section className="section category-detail">
        <div className="container">
          <FadeIn as={Link} href="/products" className="category-detail__back">← All Product Offerings</FadeIn>

          <div className="category-detail__layout">
            <FadeIn className="category-detail__visual">
              <Image src={image} alt={product.image?.alt || product.name} fill sizes="(max-width: 768px) 100vw, 48vw" priority />
              <div className="category-detail__capacity"><span>CottonRose sourcing offering</span><strong>{product.name}</strong><small>Availability confirmed per buyer brief</small></div>
            </FadeIn>

            <FadeIn className="category-detail__content">
              <span className="section-label">Product and material scope</span>
              <h2>{product.name} sourcing support</h2>
              <p className="category-detail__intro">{product.summary}</p>

              <div className="category-detail__group">
                <h3><span aria-hidden="true">+</span> Product Offering</h3>
                <ul>{product.offerings.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>

              <div className="category-detail__group">
                <h3><span aria-hidden="true">◇</span> Fabric Construction</h3>
                <ul>{product.materials.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
              <div className="category-detail__group"><h3><span aria-hidden="true">✓</span> Coordination Options</h3><ul>{product.options.map((item) => <li key={item}>{item}</li>)}</ul></div>
            </FadeIn>
          </div>

          <FadeIn as="nav" className="category-detail__nav" aria-label="Other product categories">
            {products.map((item) => (
              <Link href={`/products/${item.slug}`} className={item.slug === product.slug ? "category-detail__nav-link category-detail__nav-link--active" : "category-detail__nav-link"} key={item.slug}>
                {item.name}
              </Link>
            ))}
          </FadeIn>
        </div>
      </section>
      <CtaBanner title={`Source ${product.name} with CottonRose`} text="Send your tech pack, quantity, material requirement, destination, and delivery target for order-specific review." />
    </>
  );
}
