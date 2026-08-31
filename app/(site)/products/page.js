import PageHero from "@/components/PageHero";
import FadeIn from "@/components/FadeIn";
import ProductCatalogue from "@/components/ProductCatalogue";
import CtaBanner from "@/components/CtaBanner";

export const metadata = {
  title: "Product Categories",
  description: "Explore Cottonrose's manufacturing capabilities across Knitwear, Woven Wear, Sweaters, and Activewear."
};

export default function ProductsPage() {
  return <>
    <PageHero title="Product Categories" crumb="Product Categories" image="https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1800&q=80" />
    <section className="section products-portfolio"><div className="container">
      <FadeIn className="section__head products-portfolio__head"><span className="section-label">Product portfolio & technical specifications</span><h2>Full-spectrum manufacturing capabilities</h2><p>Our network of fully audited state-of-the-art partner factories enables us to manufacture a diverse range of high-quality readymade garments (RMG) for Men, Women, Kids, and Workwear.</p></FadeIn>
      <ProductCatalogue />
    </div></section>
    <CtaBanner title="Have a Product in Mind?" text="Send us your tech pack or reference image and we'll quote within days." />
  </>;
}
