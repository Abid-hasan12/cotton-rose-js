import PageHero from "@/components/PageHero";
import FadeIn from "@/components/FadeIn";
import ProductCatalogue from "@/components/ProductCatalogue";
import CtaBanner from "@/components/CtaBanner";

export const metadata = {
  title: "Products",
  description: "Explore Cottonrose's apparel categories: Knitwear, Woven, Denim, Sweater, Outerwear, and Activewear sourced from compliant Bangladeshi factories."
};

export default function ProductsPage() {
  return <>
    <PageHero title="Our Products" crumb="Products" image="https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1800&q=80" />
    <section className="section"><div className="container">
      <FadeIn className="section__head"><span className="section-label">Catalogue</span><h2>Product Categories</h2><p>Click any item for details. Use the filters below to browse by category.</p></FadeIn>
      <ProductCatalogue />
    </div></section>
    <CtaBanner title="Have a Product in Mind?" text="Send us your tech pack or reference image and we'll quote within days." />
  </>;
}
