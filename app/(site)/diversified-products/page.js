import PageHero from "@/components/PageHero";
import FadeIn from "@/components/FadeIn";
import DiversifiedProductCatalogue from "@/components/DiversifiedProductCatalogue";
import CtaBanner from "@/components/CtaBanner";

export const metadata = {
  title: "Diversified Product Lines",
  description: "Explore Cottonrose's diversified apparel sourcing lines across swimwear, shirts, activewear, woven bottoms, denim, sweaters, and outerwear.",
};

export default function DiversifiedProductsPage() {
  return (
    <>
      <PageHero title="Diversified Product Lines" crumb="Diversified Product Lines" image="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1800&q=80" />
      <section className="bg-brand-mist py-16 md:py-24">
        <div className="container">
          <FadeIn className="section__head">
            <span className="section-label">Extended product portfolio</span>
            <h2>Explore every product line</h2>
            <p>Select a category to browse its sample gallery and key material capabilities.</p>
          </FadeIn>
          <FadeIn><DiversifiedProductCatalogue /></FadeIn>
        </div>
      </section>
      <CtaBanner title="Have a Product in Mind?" text="Send us your tech pack or reference image and we'll quote within days." />
    </>
  );
}
