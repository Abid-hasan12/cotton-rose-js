"use client";

import { useEffect, useRef, useState } from "react";
import FadeIn from "./FadeIn";

const processSteps = [
  ["Design & Sample Prototyping", "Tech pack analysis, yarn sourcing, Clo3D digital prototyping, counter sample execution and approval within 7 days."],
  ["Open Costing & Commercials", "Transparent FOB/CIF price breakdown, fabric yield optimization, order confirmation and production planning."],
  ["Raw Material Procurement & Testing", "Sourcing certified yarn, trims, and accessories. 4-Point System fabric inspection and lab tests for colorfastness and shrinkage."],
  ["Pre-Production & Line Setup", "Holding Pre-Production (PPM) meetings, securing PP sample approvals, line balancing, and initial cut-piece audits."],
  ["Inline Quality Assurance", "Stationing dedicated QA engineers full-time in production lines. Conducting daily traffic light inspections and DuPro audits."],
  ["Final Inspection & Logistics", "Executing Final Random Inspection (FRI) based on AQL 1.5/2.5. Managing shipping documents, GSP, and export clearance."]
];

export default function SourcingProcess() {
  const [activeStep, setActiveStep] = useState(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (activeStep && dialog && !dialog.open) dialog.showModal();
  }, [activeStep]);

  const closeDialog = () => {
    dialogRef.current?.close();
    setActiveStep(null);
  };

  return (
    <>
      <div className="process">
        {processSteps.map(([title, description], index) => (
          <FadeIn
            as="button"
            type="button"
            className="process__card"
            key={title}
            onClick={() => setActiveStep({ title, description, number: index + 1 })}
            aria-haspopup="dialog"
          >
            <span className="process__num" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <span className="process__title">{title}</span>
            <span className="process__more" aria-hidden="true">
              <span>View details</span>
              <span className="process__plus">+</span>
            </span>
          </FadeIn>
        ))}
      </div>

      {activeStep && (
        <dialog
          ref={dialogRef}
          className="process-modal"
          aria-labelledby="process-modal-title"
          aria-describedby="process-modal-description"
          onClose={() => setActiveStep(null)}
          onClick={(event) => {
            if (event.target === event.currentTarget) closeDialog();
          }}
        >
          <div className="process-modal__content">
            <button className="process-modal__close" type="button" onClick={closeDialog} aria-label="Close process details">
              <span aria-hidden="true">×</span>
            </button>
            <span className="process-modal__eyebrow">Step {String(activeStep.number).padStart(2, "0")}</span>
            <h3 id="process-modal-title">{activeStep.title}</h3>
            <div className="process-modal__rule" aria-hidden="true" />
            <p id="process-modal-description">{activeStep.description}</p>
          </div>
        </dialog>
      )}
    </>
  );
}
