"use client";

import { useEffect, useState } from "react";

const empty = { slug: "", name: "", role: "", initials: "", image_url: "", summary: "", responsibilities: "[]", sort_order: 0 };

export default function LeadershipPage() {
  const [profiles, setProfiles] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    const response = await fetch("/api/admin/leadership");
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Leadership could not be loaded.");
    setProfiles(result);
  }
  useEffect(() => { load().catch((error) => setMessage(error.message)); }, []);

  function start(profile = null) {
    setEditing(profile?.id || null);
    setForm(profile ? {
      ...empty,
      ...profile,
      responsibilities: Array.isArray(profile.responsibilities)
        ? profile.responsibilities.join("\n")
        : "",
    } : { ...empty });
    setOpen(true);
    setMessage("");
  }

  async function upload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const body = new FormData();
    body.append("file", file);
    body.append("alt", form.name || file.name);
    const response = await fetch("/api/admin/media/upload", { method: "POST", body });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Image upload failed.");
    setForm((current) => ({ ...current, image_url: result.url }));
  }

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const responsibilities = form.responsibilities
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);
      const payload = { ...form, responsibilities, sort_order: Number(form.sort_order || 0) };
      const response = await fetch("/api/admin/leadership", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing ? { ...payload, id: editing } : payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Leadership profile could not be saved.");
      await load();
      setOpen(false);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(id) {
    if (!window.confirm("Delete this leadership profile permanently?")) return;
    const response = await fetch(`/api/admin/leadership?id=${id}`, { method: "DELETE" });
    const result = await response.json();
    if (!response.ok) { setMessage(result.message || "Profile could not be deleted."); return; }
    setProfiles((current) => current.filter((profile) => profile.id !== id));
  }

  return <div className="admin-content">
    <header className="admin-page-header"><div><p className="section-label">Public about page</p><h1>Leadership</h1><p className="admin-muted">Add and maintain leadership profiles shown on the website.</p></div><button className="btn btn--gold" onClick={() => start()}>New profile</button></header>
    {message && <p className="admin-alert" role="alert">{message}</p>}
    <section className="admin-panel"><div className="admin-toolbar"><h2>Leadership team</h2><span className="admin-muted">{profiles.length} profiles</span></div>
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Name</th><th>Role</th><th>Initials</th><th>Sort</th><th /></tr></thead><tbody>
        {profiles.map((profile) => <tr key={profile.id}><td><strong>{profile.name}</strong></td><td>{profile.role}</td><td>{profile.initials || "—"}</td><td>{profile.sort_order}</td><td className="admin-actions"><button className="admin-link-button" onClick={() => start(profile)}>Edit</button><button className="admin-delete" onClick={() => remove(profile.id)}>Delete</button></td></tr>)}
      </tbody></table>{!profiles.length && <p className="admin-empty">No leadership profiles yet.</p>}</div>
    </section>
    {open && <div className="admin-modal-backdrop" onClick={() => setOpen(false)}><section className="admin-modal admin-modal--wide" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
      <button className="admin-modal__close" onClick={() => setOpen(false)} aria-label="Close">×</button>
      <p className="section-label">{editing ? "Edit profile" : "New profile"}</p><h2>{editing ? "Update leadership profile" : "Add leadership profile"}</h2>
      <form className="admin-editor-form" onSubmit={save}>
        <label>Name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
        <label>Role<input required value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} /></label>
        <label>Slug<input required value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} /></label>
        <label>Initials<input maxLength="20" value={form.initials} onChange={(event) => setForm({ ...form, initials: event.target.value })} /></label>
        <label>Image URL<input value={form.image_url} onChange={(event) => setForm({ ...form, image_url: event.target.value })} /></label>
        <label className="admin-upload-box">Upload image<input type="file" accept="image/*" onChange={(event) => upload(event).catch((error) => setMessage(error.message))} /><span>{form.image_url || "No image selected"}</span></label>
        <label className="admin-editor-form__wide">Summary<textarea required rows="4" value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} /></label>
        <label className="admin-editor-form__wide">Responsibilities<span className="admin-help">One responsibility per line</span><textarea rows="5" value={form.responsibilities} onChange={(event) => setForm({ ...form, responsibilities: event.target.value })} /></label>
        <label>Sort order<input type="number" min="0" value={form.sort_order} onChange={(event) => setForm({ ...form, sort_order: event.target.value })} /></label>
        <div className="admin-editor-form__wide admin-form-actions"><button type="button" className="admin-link-button" onClick={() => setOpen(false)}>Cancel</button><button className="btn btn--gold" disabled={saving}>{saving ? "Saving..." : editing ? "Save changes" : "Create profile"}</button></div>
      </form>
    </section></div>}
  </div>;
}
