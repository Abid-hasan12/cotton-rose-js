import PageHero from "@/components/PageHero";
import FadeIn from "@/components/FadeIn";
import DiversifiedProductCatalogue from "@/components/DiversifiedProductCatalogue";
import CtaBanner from "@/components/CtaBanner";
import { Suspense } from "react";

export const metadata = {
  title: "Diversified Product Lines",
  description: "Explore CottonRose diversified apparel sourcing lines across swimwear, shirts, activewear, woven bottoms, denim, sweaters, and outerwear.",
};

export default function DiversifiedProductsPage() {
  return (
    <>
      <PageHero title="Diversified Product Lines" crumb="Diversified Product Lines" image="/images/banner2.png" />
      <section className="bg-brand-mist py-16 md:py-24">
        <div className="container">
          <FadeIn className="section__head">
            <span className="section-label">Extended product portfolio</span>
            <h2>Explore every product line</h2>
            <p>Select a category to browse illustrative product references and common material capabilities.</p>
          </FadeIn>
          <FadeIn>
            <Suspense fallback={<p className="portfolio-message">Loading diversified products...</p>}>
              <DiversifiedProductCatalogue />
            </Suspense>
          </FadeIn>
        </div>
      </section>
      <CtaBanner title="Have a Product in Mind?" text="Send your tech pack or reference image for an order-specific sourcing review." />
    </>
  );
}
