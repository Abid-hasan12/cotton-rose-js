"use client";

import { useEffect, useState } from "react";

const empty = { name: "", category_id: "", summary: "", image_url: "", image_alt: "", offerings: "", materials: "", options: "", sort_order: 0, gallery: [] };

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    const [productsResponse, categoriesResponse] = await Promise.all([
      fetch("/api/admin/products"),
      fetch("/api/admin/categories"),
    ]);
    const [productResult, categoryResult] = await Promise.all([productsResponse.json(), categoriesResponse.json()]);
    if (!productsResponse.ok || !categoriesResponse.ok) throw new Error(productResult.message || categoryResult.message || "Products could not be loaded.");
    setProducts(productResult.filter((item) => item.category_group === "core"));
    setCategories(categoryResult.filter((item) => item.category_group === "core"));
  }
  useEffect(() => { load().catch((error) => setMessage(error.message)); }, []);

  function lines(value) {
    return Array.isArray(value) ? value.join("\n") : "";
  }

  function start(product = null) {
    setEditing(product?.id || null);
    setForm(product ? {
      ...empty,
      ...product,
      category_id: product.category_id || "",
      offerings: lines(product.offerings),
      materials: lines(product.materials),
      options: lines(product.options),
      gallery: product.images || [],
    } : { ...empty, category_id: categories[0]?.id || "" });
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
    setForm((current) => ({ ...current, image_url: result.url, gallery: current.gallery }));
  }

  async function uploadGallery(event) {
    const files = [...event.target.files];
    const urls = [];
    for (const file of files) {
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

  function toArray(value) {
    return value.split("\n").map((item) => item.trim()).filter(Boolean);
  }

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const payload = {
        ...form,
        category_id: Number(form.category_id),
        offerings: toArray(form.offerings),
        materials: toArray(form.materials),
        options: toArray(form.options),
        sort_order: Number(form.sort_order || 0),
      };
      const response = await fetch("/api/admin/products", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing ? { ...payload, id: editing } : payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Product could not be saved.");
      await load();
      setOpen(false);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(id) {
    if (!window.confirm("Delete this core product permanently?")) return;
    const response = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    const result = await response.json();
    if (!response.ok) { setMessage(result.message || "Product could not be deleted."); return; }
    setProducts((current) => current.filter((item) => item.id !== id));
  }

  return <div className="admin-content">
    <header className="admin-page-header"><div><p className="section-label">Core Product Offerings</p><h1>Products</h1><p className="admin-muted">Manage Knitwear, Woven Wear, Sweaters, and Activewear.</p></div><button className="btn btn--gold" onClick={() => start()}>New core product</button></header>
    {message && <p className="admin-alert" role="alert">{message}</p>}
    <section className="admin-panel"><div className="admin-toolbar"><h2>Core product lines</h2><span className="admin-muted">{products.length} items</span></div>
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Product</th><th>Category</th><th>Gallery</th><th>Sort</th><th /></tr></thead><tbody>
        {products.map((product) => <tr key={product.id}><td><strong>{product.name}</strong></td><td>{product.category_name}</td><td>{(product.images || []).length + (product.image_url ? 1 : 0)} images</td><td>{product.sort_order || 0}</td><td className="admin-actions"><button className="admin-link-button" onClick={() => start(product)}>Edit</button><button className="admin-delete" onClick={() => remove(product.id)}>Delete</button></td></tr>)}
      </tbody></table>{!products.length && <p className="admin-empty">No core products yet.</p>}</div>
    </section>
    {open && <div className="admin-modal-backdrop" onClick={() => setOpen(false)}><section className="admin-modal admin-modal--wide" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
      <button className="admin-modal__close" onClick={() => setOpen(false)} aria-label="Close">×</button><p className="section-label">{editing ? "Edit core product" : "New core product"}</p><h2>{editing ? "Update product" : "Add product"}</h2>
      <form className="admin-editor-form" onSubmit={save}>
        <label>Name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
        <label>Category / Group<select required value={form.category_id} onChange={(event) => setForm({ ...form, category_id: event.target.value })}><option value="">Select category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
        <label>Main image URL<input required value={form.image_url} onChange={(event) => setForm({ ...form, image_url: event.target.value })} /></label>
        <label>Image alt text<input value={form.image_alt} onChange={(event) => setForm({ ...form, image_alt: event.target.value })} /></label>
        <label className="admin-upload-box">Upload main image<input type="file" accept="image/*" onChange={(event) => uploadMain(event).catch((error) => setMessage(error.message))} /><span>{form.image_url || "No image selected"}</span></label>
        <label className="admin-editor-form__wide">Summary<textarea required rows="3" value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} /></label>
        <label>Offerings<span className="admin-help">One item per line</span><textarea rows="5" value={form.offerings} onChange={(event) => setForm({ ...form, offerings: event.target.value })} /></label>
        <label>Fabrics / Materials<span className="admin-help">One item per line</span><textarea rows="5" value={form.materials} onChange={(event) => setForm({ ...form, materials: event.target.value })} /></label>
        <label className="admin-editor-form__wide">Options<span className="admin-help">One item per line</span><textarea rows="4" value={form.options} onChange={(event) => setForm({ ...form, options: event.target.value })} /></label>
        <label>Sort order<input type="number" min="0" value={form.sort_order} onChange={(event) => setForm({ ...form, sort_order: event.target.value })} /></label>
        <label className="admin-upload-box">Gallery uploads<input type="file" accept="image/*" multiple onChange={(event) => uploadGallery(event).catch((error) => setMessage(error.message))} /><span>{form.gallery.length} gallery images</span></label>
        <div className="admin-editor-form__wide admin-form-actions"><button type="button" className="admin-link-button" onClick={() => setOpen(false)}>Cancel</button><button className="btn btn--gold" disabled={saving}>{saving ? "Saving..." : editing ? "Save changes" : "Create product"}</button></div>
      </form>
    </section></div>}
  </div>;
}
