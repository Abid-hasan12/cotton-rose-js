"use client";

import { useEffect, useMemo, useState } from "react";

const tabs = ["All", "Woven", "Knit", "Outerwear", "Denim"];
const empty = { name: "", category_id: "", summary: "", image_url: "", image_alt: "", materials: "", sort_order: 0, gallery: [] };

export default function CategoriesPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tab, setTab] = useState("All");
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    const [productResponse, categoryResponse] = await Promise.all([
      fetch("/api/admin/products"),
      fetch("/api/admin/categories"),
    ]);
    const [productResult, categoryResult] = await Promise.all([productResponse.json(), categoryResponse.json()]);
    if (!productResponse.ok || !categoryResponse.ok) throw new Error(productResult.message || categoryResult.message || "Catalogue could not be loaded.");
    setProducts(productResult.filter((item) => item.category_group === "diversified"));
    setCategories(categoryResult.filter((item) =>
      item.category_group === "diversified" &&
      tabs.slice(1).includes(item.name),
    ));
  }
  useEffect(() => { load().catch((error) => setMessage(error.message)); }, []);

  const visible = useMemo(
    () => tab === "All" ? products : products.filter((item) => item.category_name === tab),
    [products, tab],
  );

  function start(product = null) {
    setEditing(product?.id || null);
    setForm(product ? {
      ...empty,
      ...product,
      category_id: product.category_id || "",
      materials: Array.isArray(product.materials) ? product.materials.join("\n") : "",
      gallery: product.images || [],
    } : { ...empty, category_id: categories.find((item) => item.name === tab)?.id || categories[0]?.id || "" });
    setOpen(true);
    setMessage("");
  }

  async function uploadMain(event) {
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

  async function uploadGallery(event) {
    const urls = [];
    for (const file of [...event.target.files]) {
      const body = new FormData();
      body.append("file", file);
      body.append("alt", form.name || file.name);
      const response = await fetch("/api/admin/media/upload", { method: "POST", body });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Image upload failed.");
      urls.push({ url: result.url, alt: form.name || file.name });
    }
    setForm((current) => ({
      ...current,
      gallery: [...current.gallery, ...urls],
      image_url: current.image_url || urls[0]?.url || "",
    }));
  }

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const payload = {
        ...form,
        category_id: Number(form.category_id),
        materials: form.materials.split("\n").map((item) => item.trim()).filter(Boolean),
        sort_order: Number(form.sort_order || 0),
      };
      const response = await fetch("/api/admin/products", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing ? { ...payload, id: editing } : payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Catalogue item could not be saved.");
      await load();
      setOpen(false);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(id) {
    if (!window.confirm("Delete this diversified catalogue item permanently?")) return;
    const response = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    const result = await response.json();
    if (!response.ok) { setMessage(result.message || "Item could not be deleted."); return; }
    setProducts((current) => current.filter((item) => item.id !== id));
  }

  return <div className="admin-content">
    <header className="admin-page-header"><div><p className="section-label">Diversified Catalogue</p><h1>Category</h1><p className="admin-muted">Organize catalogue items under Woven, Knit, Outerwear, and Denim.</p></div><button className="btn btn--gold" onClick={() => start()}>New category item</button></header>
    {message && <p className="admin-alert" role="alert">{message}</p>}
    <section className="admin-panel">
      <div className="admin-toolbar"><h2>{tab} items</h2><span className="admin-muted">{visible.length} items</span></div>
      <nav className="admin-filter-tabs" aria-label="Diversified category filters">
        {tabs.map((item) => <button type="button" key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)} aria-pressed={tab === item}>{item}</button>)}
      </nav>
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Item</th><th>Category</th><th>Materials</th><th>Gallery</th><th>Sort</th><th /></tr></thead><tbody>
        {visible.map((item) => <tr key={item.id}><td><strong>{item.name}</strong></td><td>{item.category_name}</td><td>{(item.materials || []).length ? item.materials.join(", ") : "—"}</td><td>{(item.images || []).length + (item.image_url ? 1 : 0)}</td><td>{item.sort_order || 0}</td><td className="admin-actions"><button className="admin-link-button" onClick={() => start(item)}>Edit</button><button className="admin-delete" onClick={() => remove(item.id)}>Delete</button></td></tr>)}
      </tbody></table>{!visible.length && <p className="admin-empty">No items in this category.</p>}</div>
    </section>
    {open && <div className="admin-modal-backdrop" onClick={() => setOpen(false)}><section className="admin-modal admin-modal--wide" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
      <button className="admin-modal__close" onClick={() => setOpen(false)} aria-label="Close">×</button><p className="section-label">{editing ? "Edit category item" : "New category item"}</p><h2>{editing ? "Update catalogue item" : "Add catalogue item"}</h2>
      <form className="admin-editor-form" onSubmit={save}>
        <label>Name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
        <label>Category<select required value={form.category_id} onChange={(event) => setForm({ ...form, category_id: event.target.value })}><option value="">Select category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
        <label>Main image URL<input required value={form.image_url} onChange={(event) => setForm({ ...form, image_url: event.target.value })} /></label>
        <label>Image alt text<input value={form.image_alt} onChange={(event) => setForm({ ...form, image_alt: event.target.value })} /></label>
        <label className="admin-upload-box">Upload main image<input type="file" accept="image/*" onChange={(event) => uploadMain(event).catch((error) => setMessage(error.message))} /><span>{form.image_url || "No image selected"}</span></label>
        <label className="admin-editor-form__wide">Summary<textarea required rows="3" value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} /></label>
        <label className="admin-editor-form__wide">Materials<span className="admin-help">One material per line</span><textarea rows="5" value={form.materials} onChange={(event) => setForm({ ...form, materials: event.target.value })} /></label>
        <label>Sort order<input type="number" min="0" value={form.sort_order} onChange={(event) => setForm({ ...form, sort_order: event.target.value })} /></label>
        <label className="admin-upload-box">Gallery uploads<input type="file" accept="image/*" multiple onChange={(event) => uploadGallery(event).catch((error) => setMessage(error.message))} /><span>{form.gallery.length} gallery images</span></label>
        <div className="admin-editor-form__wide admin-form-actions"><button type="button" className="admin-link-button" onClick={() => setOpen(false)}>Cancel</button><button className="btn btn--gold" disabled={saving}>{saving ? "Saving..." : editing ? "Save changes" : "Create item"}</button></div>
      </form>
    </section></div>}
  </div>;
}
