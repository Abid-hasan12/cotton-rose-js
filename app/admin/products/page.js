"use client";

import { useEffect, useState } from "react";

const empty = { slug: "", name: "", category_id: "", summary: "", image_url: "", image_alt: "", offerings: "[]", materials: "[]", options: "[]", gallery: [] };
const jsonFields = ["offerings", "materials", "options"];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    const [productsResponse, categoriesResponse] = await Promise.all([fetch("/api/admin/products"), fetch("/api/admin/categories")]);
    if (!productsResponse.ok || !categoriesResponse.ok) throw new Error("Products could not be loaded.");
    setProducts(await productsResponse.json());
    setCategories(await categoriesResponse.json());
  }
  useEffect(() => { load().catch((error) => setMessage(error.message)); }, []);

  function start(product = null) {
    setEditing(product?.id || null);
    setForm(product ? { ...empty, ...product, category_id: product.category_id, offerings: JSON.stringify(product.offerings || []), materials: JSON.stringify(product.materials || []), options: JSON.stringify(product.options || []), gallery: product.images || [] } : { ...empty, category_id: categories[0]?.id || "" });
    setOpen(true);
    setMessage("");
  }

  async function uploadGallery(event) {
    const files = [...event.target.files];
    const urls = await Promise.all(files.map(async (file) => {
      const body = new FormData(); body.append("file", file);
      const response = await fetch("/api/admin/media/upload", { method: "POST", body });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Image upload failed.");
      return { url: result.url, alt: file.name };
    }));
    setForm((current) => ({ ...current, gallery: [...current.gallery, ...urls], image_url: current.image_url || urls[0]?.url || "" }));
  }

  async function save(event) {
    event.preventDefault(); setSaving(true); setMessage("");
    try {
      const payload = { ...form, category_id: Number(form.category_id), gallery: form.gallery };
      for (const field of jsonFields) payload[field] = JSON.parse(form[field]);
      const response = await fetch("/api/admin/products", { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing ? { ...payload, id: editing } : payload) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Product could not be saved.");
      await load(); setOpen(false);
    } catch (error) { setMessage(error.message); } finally { setSaving(false); }
  }

  async function remove(id) {
    if (!window.confirm("Delete this product permanently?")) return;
    const response = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    if (!response.ok) { const result = await response.json(); setMessage(result.message); return; }
    setProducts((current) => current.filter((product) => product.id !== id));
  }

  return <div className="admin-content">
    <header className="admin-page-header"><div><p className="section-label">Catalogue</p><h1>Products</h1><p className="admin-muted">Manage core and diversified product details.</p></div><button className="btn btn--gold" onClick={() => start()}>New product</button></header>
    {message && <p className="admin-alert" role="alert">{message}</p>}
    <section className="admin-panel"><div className="admin-toolbar"><h2>All products</h2><span className="admin-muted">{products.length} items</span></div>
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Product</th><th>Type</th><th>Category</th><th>Gallery</th><th /></tr></thead><tbody>
        {products.map((product) => <tr key={product.id}><td><strong>{product.name}</strong><br /><span className="admin-muted">{product.slug}</span></td><td>{product.category_group}</td><td>{product.category_name}</td><td>{(product.images || []).length + (product.image_url ? 1 : 0)} images</td><td className="admin-actions"><button className="admin-link-button" onClick={() => start(product)}>Edit</button><button className="admin-delete" onClick={() => remove(product.id)}>Delete</button></td></tr>)}
      </tbody></table>{!products.length && <p className="admin-empty">No products yet.</p>}</div>
    </section>
    {open && <div className="admin-modal-backdrop" onClick={() => setOpen(false)}><section className="admin-modal admin-modal--wide" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
      <button className="admin-modal__close" onClick={() => setOpen(false)} aria-label="Close">×</button><p className="section-label">{editing ? "Edit product" : "New product"}</p><h2>{editing ? "Update catalogue item" : "Add catalogue item"}</h2>
      <form className="admin-editor-form" onSubmit={save}>
        <label>Name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
        <label>Slug<input required value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} /></label>
        <label>Category<select required value={form.category_id} onChange={(event) => setForm({ ...form, category_id: event.target.value })}><option value="">Select category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name} ({category.category_group})</option>)}</select></label>
        <label>Primary image URL<input required value={form.image_url} onChange={(event) => setForm({ ...form, image_url: event.target.value })} /></label>
        <label className="admin-editor-form__wide">Summary<textarea required rows="3" value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} /></label>
        {jsonFields.map((field) => <label key={field}>{field[0].toUpperCase() + field.slice(1)} <span className="admin-help">Valid JSON array or object</span><textarea rows="3" value={form[field]} onChange={(event) => setForm({ ...form, [field]: event.target.value })} /></label>)}
        <label>Image alt text<input value={form.image_alt} onChange={(event) => setForm({ ...form, image_alt: event.target.value })} /></label>
        <label className="admin-upload-box">Gallery uploads<input type="file" accept="image/*" multiple onChange={(event) => uploadGallery(event).catch((error) => setMessage(error.message))} /><span>{form.gallery.length} gallery images selected</span></label>
        <div className="admin-editor-form__wide admin-form-actions"><button type="button" className="admin-link-button" onClick={() => setOpen(false)}>Cancel</button><button className="btn btn--gold" disabled={saving}>{saving ? "Saving..." : editing ? "Save changes" : "Create product"}</button></div>
      </form>
    </section></div>}
  </div>;
}
