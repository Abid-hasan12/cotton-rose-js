"use client";

import { useEffect, useRef, useState } from "react";
import { leaders } from "@/data/leadership";
import { company } from "@/data/company";

export default function LeadershipGrid() {
  const [activeLeader, setActiveLeader] = useState(null);
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (activeLeader && dialog && !dialog.open) dialog.showModal();
  }, [activeLeader]);

  useEffect(() => {
    if (!activeLeader) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        dialogRef.current?.close();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [activeLeader]);

  const openProfile = (leader, trigger) => {
    triggerRef.current = trigger;
    setActiveLeader(leader);
  };

  const closeProfile = () => dialogRef.current?.close();

  return (
    <>
      <div className="leadership">
        {leaders.map((leader) => (
          <article className="leader-card" key={leader.id}>
            <div className="leader-card__avatar" aria-hidden="true">
              {leader.image ? <img src={leader.image} alt="" /> : leader.initials}
            </div>
            <h3 className="leader-card__name">{leader.name}</h3>
            <p className="leader-card__title">{leader.role}</p>
            <button className="btn-view-profile" type="button" onClick={(event) => openProfile(leader, event.currentTarget)}>View profile</button>
          </article>
        ))}
      </div>
      {activeLeader && (
        <dialog ref={dialogRef} className="leadership-modal" aria-labelledby="leadership-modal-title" aria-describedby="leadership-modal-description" onCancel={(event) => { event.preventDefault(); closeProfile(); }} onClose={() => { setActiveLeader(null); requestAnimationFrame(() => triggerRef.current?.focus()); }} onClick={(event) => event.target === event.currentTarget && closeProfile()}>
          <div className="leadership-modal__content">
            <button className="leadership-modal__close" type="button" onClick={closeProfile} aria-label="Close leadership profile">×</button>
            <div className="leadership-modal__avatar" aria-hidden="true">
              {activeLeader.image ? <img src={activeLeader.image} alt="" /> : activeLeader.initials}
            </div>
            <span className="section-label">CottonRose leadership</span>
            <h2 id="leadership-modal-title">{activeLeader.name}</h2>
            <p className="leadership-modal__role">{activeLeader.role}</p>
            <p id="leadership-modal-description">{activeLeader.summary}</p>
            <h3>Responsibility areas</h3>
            <ul>{activeLeader.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul>
            <div className="leadership-modal__actions">
              <a className="btn btn--navy" href={`mailto:${company.contact.email}`}>Email CottonRose</a>
              <a className="btn btn--gold" href={company.contact.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}
