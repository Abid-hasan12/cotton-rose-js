import FadeIn from "./FadeIn";
import { sourcingGlossary, sourcingProcess } from "@/data/sourcingProcess";

export default function SourcingProcess() {
  return (
    <>
      <ol className="process">
        {sourcingProcess.map(({ title, description }, index) => (
          <FadeIn as="li" className="process__card" key={title}>
            <span className="process__num" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <h3 className="process__title">{title}</h3>
            <p className="process__description">{description}</p>
          </FadeIn>
        ))}
      </ol>
      <FadeIn as="dl" className="process-glossary" aria-label="Sourcing terminology">
        {sourcingGlossary.map(([term, meaning]) => <div key={term}><dt>{term}</dt><dd>{meaning}</dd></div>)}
      </FadeIn>
    </>
  );
}
