import Image from "next/image";
import FadeIn from "./FadeIn";
import { productTimeline } from "@/data/productTimeline";

export default function ProductTimeline() {
  return (
    <section className="product-evolution" aria-labelledby="product-evolution-title">
      <FadeIn className="product-evolution__intro">
        <div>
          <span className="section-label">Portfolio evolution</span>
          <h2 id="product-evolution-title">How our product offering has grown</h2>
          <p>A chronological view of when CottonRose began and when new sourcing categories were added.</p>
        </div>
        <aside className="product-evolution__notice" aria-label="Timeline verification status">
          <strong>Dates pending confirmation</strong>
          <span>The supplied company profile confirms the current range but does not contain the founding or product-addition years.</span>
        </aside>
      </FadeIn>

      <ol className="product-timeline">
        {productTimeline.map((milestone, index) => (
          <FadeIn as="li" className="product-timeline__item" key={milestone.id}>
            <div className="product-timeline__marker" aria-hidden="true"><span>{String(index + 1).padStart(2, "0")}</span></div>
            <article className="product-timeline__card">
              <div className="product-timeline__image">
                <Image src={milestone.image} alt={milestone.alt} fill sizes="(max-width: 768px) 100vw, 38vw" />
              </div>
              <div className="product-timeline__content">
                <div className="product-timeline__meta">
                  <span className="product-timeline__year">{milestone.year ?? "Year to confirm"}</span>
                  <span className="product-timeline__status">Pending verification</span>
                </div>
                <h3>{milestone.title}</h3>
                <p>{milestone.description}</p>
                <ul aria-label={`Products associated with ${milestone.title}`}>
                  {milestone.products.map((product) => <li key={product}>{product}</li>)}
                </ul>
              </div>
            </article>
          </FadeIn>
        ))}
      </ol>
    </section>
  );
}
