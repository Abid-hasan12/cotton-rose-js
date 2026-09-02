import FadeIn from "./FadeIn";
import { productTimeline } from "@/data/productTimeline";

const startYear = 2012;
const endYear = 2026;

export default function ProductTimeline() {
  return (
    <section className="product-evolution" aria-labelledby="product-evolution-title">
      <FadeIn className="product-evolution__intro">
        <div>
          <span className="section-label">Product range evolution</span>
          <h2 id="product-evolution-title">A sourcing portfolio built over time</h2>
          <p>
            From core apparel to a broader multi-category offer, CottonRose has expanded the
            product programs it can source and manage for international buyers.
          </p>
        </div>
        <div className="product-evolution__period" aria-label={`Portfolio development from ${startYear} to ${endYear}`}>
          <span>{startYear}</span>
          <i aria-hidden="true" />
          <span>{endYear}</span>
        </div>
      </FadeIn>

      <FadeIn className="product-range" role="group" aria-label={`CottonRose product range progression, ${startYear} to ${endYear}`}>
        <div className="product-range__heading">
          <span>Range progression</span>
          <strong>{startYear}—{endYear}</strong>
        </div>

        <div className="product-range__chart">
          <svg className="product-range__line" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <marker id="product-range-arrow" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="10" markerHeight="10" orient="auto-start-reverse">
                <path d="M 1 1 L 11 6 L 1 11 z" />
              </marker>
            </defs>
            <path className="product-range__line-shadow" d="M 68 535 L 925 66" />
            <path className="product-range__line-main" d="M 68 535 L 925 66" markerEnd="url(#product-range-arrow)" />
          </svg>

          <span className="product-range__year product-range__year--start">{startYear}<small>Starting range</small></span>
          <span className="product-range__year product-range__year--end">{endYear}<small>Expanded offer</small></span>

          <ol className="product-range__steps">
            {productTimeline.map((milestone, index) => (
              <li
                className="product-range__step"
                key={milestone.id}
                style={{
                  "--range-x": `${11 + (index * 8.625)}%`,
                  "--range-y": `${17 + (index * 7.9)}%`,
                }}
              >
                <button
                  className="product-range__trigger"
                  type="button"
                  aria-describedby={`product-range-${milestone.id}-description`}
                >
                  <span className="product-range__marker" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <span className="product-range__name">{milestone.title}</span>
                </button>
                <span
                  className="product-range__description"
                  id={`product-range-${milestone.id}-description`}
                  role="tooltip"
                >
                  {milestone.description}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <p className="product-range__note">
          Product feasibility is confirmed against each buyer&apos;s specifications, quantity,
          compliance requirements, target price, and delivery window.
        </p>
      </FadeIn>
    </section>
  );
}
