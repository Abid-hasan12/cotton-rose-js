import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import FadeIn from "@/components/FadeIn";
import ProductGallery from "@/components/ProductGallery";
import CtaBanner from "@/components/CtaBanner";
import { unstable_cache } from "next/cache";
import { getPublicProducts } from "@/lib/public-products";

export const dynamic = "force-dynamic";

const getDiversifiedProducts = unstable_cache(
  async () => (await getPublicProducts({ group: "diversified", page: 1, limit: 100 })).data,
  ["diversified-products"],
  { revalidate: 600, tags: ["products"] },
);

export async function generateMetadata({ params }) {
  const { category } = await params;
  const products = await getDiversifiedProducts();
  const product = products.find((item) => item.slug === category);
  if (!product) return {};
  return { title: product.name, description: `${product.summary} Explore CottonRose ${product.name.toLowerCase()} sourcing support.` };
}

export default async function DiversifiedCategoryPage({ params }) {
  const { category } = await params;
  const diversifiedProducts = await getDiversifiedProducts();
  const product = diversifiedProducts.find((item) => item.slug === category);
  if (!product) notFound();
  const currentIndex = diversifiedProducts.findIndex(({ slug }) => slug === product.slug);
  const previous = diversifiedProducts[(currentIndex - 1 + diversifiedProducts.length) % diversifiedProducts.length];
  const next = diversifiedProducts[(currentIndex + 1) % diversifiedProducts.length];
  const image = product.image || { url: "/images/product-placeholder-1.svg", alt: product.name };
  const gallery = [image];

  return (
    <>
      <PageHero title={product.name} crumb={`Diversified Product Lines / ${product.name}`} image={image.url} />
      <section className="bg-brand-mist py-16 md:py-24">
        <div className="container">
          <FadeIn><Link href="/diversified-products" className="mb-9 inline-flex items-center gap-2 text-sm font-bold text-brand-navy transition-all hover:-translate-x-1 hover:text-brand-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-4"><span aria-hidden="true">←</span> All diversified product lines</Link></FadeIn>
          <FadeIn className="mb-10 grid items-end gap-7 lg:grid-cols-[1fr_auto]">
            <div className="max-w-3xl">
              <span className="section-label">{product.category?.name} collection</span>
              <h2 className="text-3xl font-bold tracking-tight text-brand-navy md:text-5xl">Developed around your buyer brief.</h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-brand-ink/70 md:text-lg">{product.summary}</p>
            </div>
            <div className="flex max-w-xl flex-wrap gap-2 lg:max-w-sm lg:justify-end">{product.materials.map((material) => <span key={material} className="rounded-full border border-brand-navy/10 bg-white px-4 py-2 text-xs font-bold text-brand-navy shadow-sm">{material}</span>)}</div>
          </FadeIn>
          <FadeIn><ProductGallery images={gallery} categoryName={product.name} /></FadeIn>
          <FadeIn as="nav" className="mt-12 grid gap-3 border-t border-brand-navy/10 pt-8 sm:grid-cols-2" aria-label="Adjacent diversified product lines">
            <Link href={`/diversified-products/${previous.slug}`} className="rounded-2xl border border-brand-navy/10 bg-white p-5 transition-all hover:-translate-y-1 hover:border-brand-gold hover:shadow-product-card"><span className="text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">← Previous</span><strong className="mt-1 block text-brand-navy">{previous.name}</strong></Link>
            <Link href={`/diversified-products/${next.slug}`} className="rounded-2xl border border-brand-navy/10 bg-white p-5 text-left transition-all hover:-translate-y-1 hover:border-brand-gold hover:shadow-product-card sm:text-right"><span className="text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">Next →</span><strong className="mt-1 block text-brand-navy">{next.name}</strong></Link>
          </FadeIn>
        </div>
      </section>
      <CtaBanner title={`Develop ${product.name} with CottonRose`} text="Send your tech pack or reference image and our sourcing team will confirm the next step." />
    </>
  );
}
