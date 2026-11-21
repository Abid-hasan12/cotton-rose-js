"use client";

import { useEffect, useRef, useState } from "react";

export default function LeadershipGrid() {
  const [leaders, setLeaders] = useState([]);
  const [companyContact, setCompanyContact] = useState(null);
  const [error, setError] = useState("");
  const [activeLeader, setActiveLeader] = useState(null);
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    async function loadLeadership() {
      try {
        const [leadershipResponse, companyResponse] = await Promise.all([
          fetch("/api/leadership"),
          fetch("/api/company"),
        ]);
        const leadershipResult = await leadershipResponse.json();
        const companyResult = await companyResponse.json();
        if (!leadershipResponse.ok) throw new Error(leadershipResult.error || "Could not load leadership.");
        if (!companyResponse.ok) throw new Error(companyResult.error || "Could not load company contact details.");
        if (!Array.isArray(leadershipResult.data) || !companyResult.data?.contacts?.length) throw new Error("The leadership response was invalid.");
        setLeaders(leadershipResult.data);
        setCompanyContact(companyResult.data.contacts[0]);
      } catch (loadError) {
        setError(loadError.message);
      }
    }

    loadLeadership();
  }, []);

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
        {error && <p className="portfolio-message" role="alert">{error}</p>}
        {!error && leaders.length === 0 && <p className="portfolio-message">Loading leadership...</p>}
        {leaders.map((leader) => (
          <article className="leader-card" key={leader.id}>
            <div className="leader-card__avatar" aria-hidden="true">
              {leader.image?.url ? <img src={leader.image.url} alt="" /> : leader.initials}
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
              {activeLeader.image?.url ? <img src={activeLeader.image.url} alt="" /> : activeLeader.initials}
            </div>
            <span className="section-label">CottonRose leadership</span>
            <h2 id="leadership-modal-title">{activeLeader.name}</h2>
            <p className="leadership-modal__role">{activeLeader.role}</p>
            <p id="leadership-modal-description">{activeLeader.summary}</p>
            <h3>Responsibility areas</h3>
            <ul>{activeLeader.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul>
            <div className="leadership-modal__actions">
              <a className="btn btn--navy" href={`mailto:${companyContact.email}`}>Email CottonRose</a>
              <a className="btn btn--gold" href={companyContact.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}
