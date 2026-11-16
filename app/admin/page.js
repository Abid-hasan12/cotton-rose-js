"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const statusOptions = ["Pending", "Contacted", "Closed"];
const productCategories = ["Knitwear", "Woven Wear", "Sweaters", "Activewear", "Diversified Products"];
const emptyProduct = { title: "", category: productCategories[0], description: "", image_url: "" };

export default function AdminDashboardPage() {
  const router = useRouter();
  const [inquiries, setInquiries] = useState([]);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("inquiries");
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productLoading, setProductLoading] = useState(false);

  async function loadInquiries() {
    const response = await fetch("/api/admin/inquiries");
    if (response.status === 401) return router.replace("/admin/login");
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Could not load inquiries.");
    setInquiries(result);
  }

  useEffect(() => {
    loadInquiries().catch((error) => setMessage(error.message));
  }, []);

  async function loadProducts() {
    const response = await fetch("/api/admin/products");
    if (response.status === 401) return router.replace("/admin/login");
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Could not load products.");
    setProducts(result);
  }

  useEffect(() => {
    if (activeTab === "products") loadProducts().catch((error) => setMessage(error.message));
  }, [activeTab]);

  const visible = useMemo(() => filter === "All" ? inquiries : inquiries.filter((inquiry) => inquiry.status === filter), [filter, inquiries]);
  const pendingCount = inquiries.filter((inquiry) => inquiry.status === "Pending").length;

  async function updateStatus(id, status) {
    const response = await fetch("/api/admin/inquiries", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    if (response.status === 401) return router.replace("/admin/login");
    if (!response.ok) {
      const result = await response.json();
      setMessage(result.message || "Could not update inquiry.");
      return;
    }
    setInquiries((current) => current.map((inquiry) => inquiry.id === id ? { ...inquiry, status } : inquiry));
    setSelected((current) => current?.id === id ? { ...current, status } : current);
  }

  async function removeInquiry(id) {
    if (!window.confirm("Delete this inquiry permanently?")) return;
    const response = await fetch(`/api/admin/inquiries?id=${id}`, { method: "DELETE" });
    if (!response.ok) {
      const result = await response.json();
      setMessage(result.message || "Could not delete inquiry.");
      return;
    }
    setInquiries((current) => current.filter((inquiry) => inquiry.id !== id));
    setSelected(null);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  function editProduct(product) {
    setEditingProduct(product.id);
    setProductForm({ title: product.title, category: product.category, description: product.description, image_url: product.image_url });
  }

  function resetProductForm() {
    setEditingProduct(null);
    setProductForm(emptyProduct);
  }

  function selectProductImage(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage("Please select an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setProductForm((current) => ({ ...current, image_url: String(reader.result) }));
    reader.onerror = () => setMessage("The image could not be read.");
    reader.readAsDataURL(file);
  }

  async function saveProduct(event) {
    event.preventDefault();
    setProductLoading(true);
    setMessage("");
    const response = await fetch("/api/admin/products", {
      method: editingProduct ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingProduct ? { id: editingProduct, ...productForm } : productForm),
    });
    const result = await response.json();
    setProductLoading(false);
    if (response.status === 401) return router.replace("/admin/login");
    if (!response.ok) return setMessage(result.message || "Could not save product.");
    setProducts((current) => editingProduct ? current.map((product) => product.id === editingProduct ? result : product) : [result, ...current]);
    resetProductForm();
  }

  async function removeProduct(id) {
    if (!window.confirm("Delete this product permanently?")) return;
    const response = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    const result = await response.json();
    if (response.status === 401) return router.replace("/admin/login");
    if (!response.ok) return setMessage(result.message || "Could not delete product.");
    setProducts((current) => current.filter((product) => product.id !== id));
    if (editingProduct === id) resetProductForm();
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div><p className="section-label">CottonRose</p><h1>Admin dashboard</h1></div>
        <button className="admin-link-button" onClick={logout}>Log out</button>
      </header>
      <nav className="admin-tabs" aria-label="Admin sections">
        <button className={activeTab === "inquiries" ? "admin-tab admin-tab--active" : "admin-tab"} onClick={() => setActiveTab("inquiries")}>Inquiries</button>
        <button className={activeTab === "products" ? "admin-tab admin-tab--active" : "admin-tab"} onClick={() => setActiveTab("products")}>Products</button>
      </nav>
      {activeTab === "inquiries" ? <>
      <section className="admin-stats">
        <div><span>Total inquiries</span><strong>{inquiries.length}</strong></div>
        <div><span>Pending follow-up</span><strong>{pendingCount}</strong></div>
      </section>
      {message && <p className="admin-alert" role="alert">{message}</p>}
      <section className="admin-panel">
        <div className="admin-toolbar"><h2>Recent inquiries</h2><label>Filter <select value={filter} onChange={(event) => setFilter(event.target.value)}><option>All</option>{statusOptions.map((status) => <option key={status}>{status}</option>)}</select></label></div>
        {visible.length === 0 ? <p className="admin-muted">No inquiries match this filter.</p> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Received</th><th>Name</th><th>Product</th><th>Contact</th><th>Status</th><th /></tr></thead><tbody>{visible.map((inquiry) => <tr key={inquiry.id}><td>{new Date(inquiry.created_at).toLocaleString()}</td><td><button className="admin-name" onClick={() => setSelected(inquiry)}>{inquiry.name}</button></td><td>{inquiry.product}</td><td><a href={`mailto:${inquiry.email}`}>{inquiry.email}</a><br />{inquiry.phone}</td><td><select className={`admin-status admin-status--${inquiry.status.toLowerCase()}`} value={inquiry.status} onChange={(event) => updateStatus(inquiry.id, event.target.value)}>{statusOptions.map((status) => <option key={status}>{status}</option>)}</select></td><td><button className="admin-delete" onClick={() => removeInquiry(inquiry.id)}>Delete</button></td></tr>)}</tbody></table></div>}
      </section>
      {selected && <div className="admin-modal-backdrop" role="presentation" onClick={() => setSelected(null)}><section className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="inquiry-title" onClick={(event) => event.stopPropagation()}><button className="admin-modal__close" onClick={() => setSelected(null)} aria-label="Close inquiry">×</button><p className="section-label">Inquiry #{selected.id}</p><h2 id="inquiry-title">{selected.name}</h2><p className="admin-muted">{selected.email} · {selected.phone}</p><dl className="admin-details"><dt>Product</dt><dd>{selected.product}</dd><dt>Received</dt><dd>{new Date(selected.created_at).toLocaleString()}</dd><dt>Message</dt><dd>{selected.message}</dd></dl><select className="admin-status" value={selected.status} onChange={(event) => updateStatus(selected.id, event.target.value)}>{statusOptions.map((status) => <option key={status}>{status}</option>)}</select></section></div>}
      </> : <section className="admin-products">
        <section className="admin-panel">
          <div className="admin-toolbar"><h2>{editingProduct ? "Edit product" : "Add product"}</h2>{editingProduct && <button className="admin-link-button" onClick={resetProductForm}>Cancel edit</button>}</div>
          <form className="admin-product-form" onSubmit={saveProduct}>
            <label>Title<input value={productForm.title} onChange={(event) => setProductForm({ ...productForm, title: event.target.value })} required /></label>
            <label>Category<select value={productForm.category} onChange={(event) => setProductForm({ ...productForm, category: event.target.value })}>{productCategories.map((category) => <option key={category}>{category}</option>)}</select></label>
            <label className="admin-product-form__wide">Description<textarea value={productForm.description} onChange={(event) => setProductForm({ ...productForm, description: event.target.value })} rows="4" required /></label>
            <label className="admin-product-form__wide">Image URL<input type="text" value={productForm.image_url} onChange={(event) => setProductForm({ ...productForm, image_url: event.target.value })} placeholder="https://..." required /><span className="admin-upload-label">Or upload an image<input type="file" accept="image/*" onChange={selectProductImage} /></span></label>
            <div className="admin-product-form__wide admin-product-form__actions"><button className="btn btn--gold" disabled={productLoading}>{productLoading ? "Saving..." : editingProduct ? "Update product" : "Add product"}</button></div>
          </form>
        </section>
        <section className="admin-panel">
          <div className="admin-toolbar"><h2>Products</h2><span className="admin-muted">{products.length} total</span></div>
          {products.length === 0 ? <p className="admin-muted">No products have been added yet.</p> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Image</th><th>Title</th><th>Category</th><th>Description</th><th /></tr></thead><tbody>{products.map((product) => <tr key={product.id}><td><img className="admin-product-thumb" src={product.image_url} alt="" /></td><td>{product.title}</td><td>{product.category}</td><td>{product.description}</td><td className="admin-actions"><button className="admin-link-button" onClick={() => editProduct(product)}>Edit</button><button className="admin-delete" onClick={() => removeProduct(product.id)}>Delete</button></td></tr>)}</tbody></table></div>}
        </section>
      </section>}
    </main>
  );
}
