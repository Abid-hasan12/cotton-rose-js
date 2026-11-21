"use client";

import { useEffect, useState } from "react";

export default function ContentEditor({ title, eyebrow, endpoint, fields, empty }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");

  async function load() {
    const response = await fetch(endpoint); const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Content could not be loaded.");
    setItems(Array.isArray(result) ? result : [result]); if (!Array.isArray(result)) setForm({ ...empty, ...result });
  }
  useEffect(() => { load().catch((error) => setMessage(error.message)); }, [endpoint]);
  async function save(event) {
    event.preventDefault(); setMessage("");
    const response = await fetch(endpoint, { method: editing || endpoint.endsWith("/company") ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing ? { ...form, id: editing } : form) });
    const result = await response.json();
    if (!response.ok) { setMessage(result.message || "Could not save changes."); return; }
    setForm({ ...empty, ...result }); setEditing(null); await load();
  }
  return <div className="admin-content"><header className="admin-page-header"><div><p className="section-label">{eyebrow}</p><h1>{title}</h1><p className="admin-muted">Keep this content current across the public website.</p></div></header>{message && <p className="admin-alert" role="alert">{message}</p>}
    <div className="admin-content-grid"><section className="admin-panel"><div className="admin-toolbar"><h2>{editing ? "Edit item" : "Add item"}</h2>{editing && <button className="admin-link-button" onClick={() => { setEditing(null); setForm(empty); }}>Cancel</button>}</div><form className="admin-editor-form" onSubmit={save}>{fields.map(({ key, label, type = "text", required = false }) => <label key={key}>{label}{type === "textarea" ? <textarea required={required} rows="4" value={form[key] || ""} onChange={(event) => setForm({ ...form, [key]: event.target.value })} /> : <input required={required} type={type} value={form[key] || ""} onChange={(event) => setForm({ ...form, [key]: event.target.value })} />}</label>)}<button className="btn btn--gold">{editing ? "Save changes" : "Create"}</button></form></section>
      {items.length > 0 && <section className="admin-panel"><div className="admin-toolbar"><h2>Published items</h2><span className="admin-muted">{items.length}</span></div>{items.map((item) => <div className="admin-list-row" key={item.id || item.name || item.title}><div><strong>{item.name || item.title}</strong><span>{item.role || item.description || item.tagline}</span></div><button className="admin-link-button" onClick={() => { setEditing(item.id); setForm({ ...empty, ...item }); }}>Edit</button></div>)}</section>}</div>
  </div>;
}
