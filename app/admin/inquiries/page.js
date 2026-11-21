"use client";

import { useEffect, useMemo, useState } from "react";

const statuses = ["Pending", "Contacted", "Closed"];

export default function InquiriesPage() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    const response = await fetch("/api/admin/inquiries");
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Inquiries could not be loaded.");
    setItems(result);
  }
  useEffect(() => { load().catch((error) => setMessage(error.message)); }, []);
  const visible = useMemo(() => filter === "All" ? items : items.filter((item) => item.status === filter), [filter, items]);

  async function update(id, values) {
    const isNote = Object.prototype.hasOwnProperty.call(values, "notes");
    const response = await fetch(isNote ? `/api/admin/inquiries/${id}/notes` : "/api/admin/inquiries", { method: isNote ? "POST" : "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(isNote ? { note: values.notes.split("\n").pop() } : { id, ...values }) });
    const result = await response.json();
    if (!response.ok) { setMessage(result.message || "Inquiry could not be updated."); return false; }
    setItems((current) => current.map((item) => item.id === id ? { ...item, ...values } : item));
    setSelected((current) => current?.id === id ? { ...current, ...values } : current);
    return true;
  }
  async function saveNote(event) {
    event.preventDefault();
    if (!note.trim() || !selected) return;
    if (await update(selected.id, { notes: `${selected.notes ? `${selected.notes}\n` : ""}${note.trim()}` })) { setNote(""); }
  }

  return <div className="admin-content">
    <header className="admin-page-header"><div><p className="section-label">Buyer relations</p><h1>Inquiries</h1><p className="admin-muted">Respond to sourcing requests and keep follow-up status current.</p></div><div className="admin-filter"><label htmlFor="inquiry-filter">Filter</label><select id="inquiry-filter" value={filter} onChange={(event) => setFilter(event.target.value)}><option>All</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select></div></header>
    {message && <p className="admin-alert" role="alert">{message}</p>}
    <section className="admin-panel"><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Received</th><th>Buyer</th><th>Product</th><th>Destination</th><th>Status</th></tr></thead><tbody>
      {visible.map((item) => <tr key={item.id}><td>{new Date(item.created_at).toLocaleDateString()}</td><td><button className="admin-name" onClick={() => { setSelected(item); setNote(""); }}>{item.name}</button><br /><span className="admin-muted">{item.email}</span></td><td>{item.product || "General inquiry"}</td><td>{item.destination || "—"}</td><td><select className={`admin-status admin-status--${item.status.toLowerCase()}`} value={item.status} onChange={(event) => update(item.id, { status: event.target.value })}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></td></tr>)}
    </tbody></table>{!visible.length && <p className="admin-empty">No inquiries match this filter.</p>}</div></section>
    {selected && <div className="admin-modal-backdrop" onClick={() => setSelected(null)}><section className="admin-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}><button className="admin-modal__close" onClick={() => setSelected(null)} aria-label="Close">×</button><p className="section-label">Inquiry #{selected.id}</p><h2>{selected.name}</h2><p className="admin-muted">{selected.email} · {selected.phone}</p><dl className="admin-details"><dt>Product</dt><dd>{selected.product || "General inquiry"}</dd><dt>Quantity</dt><dd>{selected.quantity || "—"}</dd><dt>Delivery</dt><dd>{selected.delivery_date || "—"}</dd><dt>Message</dt><dd>{selected.message || "—"}</dd></dl><label className="admin-field">Status<select className="admin-status" value={selected.status} onChange={(event) => update(selected.id, { status: event.target.value })}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label><form className="admin-note-form" onSubmit={saveNote}><label>Add internal note<textarea rows="3" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Record your follow-up..." /></label><button className="btn btn--gold">Save note</button></form>{selected.notes && <div className="admin-note-history"><strong>Notes</strong><p>{selected.notes}</p></div>}</section></div>}
  </div>;
}
