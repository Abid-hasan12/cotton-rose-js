import PageHero from "@/components/PageHero";
import FadeIn from "@/components/FadeIn";
import ProductCatalogue from "@/components/ProductCatalogue";
import ProductTimeline from "@/components/ProductTimeline";
import CtaBanner from "@/components/CtaBanner";

export const metadata = {
  title: "Product Offering",
  description: "Explore CottonRose sourcing offerings across knitwear, woven wear, sweaters, activewear, and diversified apparel lines."
};

export default function ProductsPage() {
  return <>
    <PageHero title="Product Offering" crumb="Products" image="/images/banner2.png" />
    <section className="section products-portfolio"><div className="container">
      <FadeIn className="section__head products-portfolio__head"><span className="section-label">Buyer-focused sourcing portfolio</span><h2>Products we can source and manage</h2><p>Explore CottonRose product categories, common material constructions, and development options. Final feasibility is confirmed privately against your tech pack, quantity, compliance needs, target price, and delivery date.</p></FadeIn>
      <ProductTimeline />
      <ProductCatalogue />
    </div></section>
    <CtaBanner title="Have a Product in Mind?" text="Send your tech pack or reference image and we will confirm the information needed for a sourcing proposal." />
  </>;
}
