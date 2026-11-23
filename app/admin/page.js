"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState({ inquiries: [], products: [], leadership: [] });
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/inquiries"),
      fetch("/api/admin/products"),
      fetch("/api/admin/leadership"),
    ])
      .then(async ([inquiriesResponse, productsResponse, leadershipResponse]) => {
        if (!inquiriesResponse.ok || !productsResponse.ok || !leadershipResponse.ok) {
          throw new Error("Dashboard data could not be loaded.");
        }
        return Promise.all([inquiriesResponse.json(), productsResponse.json(), leadershipResponse.json()]);
      })
      .then(([inquiries, products, leadership]) => setSummary({ inquiries, products, leadership }))
      .catch((reason) => setError(reason.message));
  }, []);

  const coreProducts = summary.products.filter((item) => item.category_group === "core");
  const diversifiedItems = summary.products.filter((item) => item.category_group === "diversified");
  const openInquiries = summary.inquiries.filter((item) =>
    !["closed", "replied", "Closed", "Replied"].includes(item.status),
  ).length;
  const recentInquiries = summary.inquiries.slice(0, 5);

  return (
    <div className="admin-content">
      <header className="admin-page-header">
        <div><p className="section-label">Overview</p><h1>Admin Dashboard</h1><p className="admin-muted">Manage leadership, the public catalogue, categories, and buyer inquiries.</p></div>
        <Link href="/admin/products" className="btn btn--gold">Add core product</Link>
      </header>
      {error && <p className="admin-alert" role="alert">{error}</p>}
      <section className="admin-stats">
        <div><span>Leadership</span><strong>{summary.leadership.length}</strong><Link href="/admin/leadership">Manage team</Link></div>
        <div><span>Core products</span><strong>{coreProducts.length}</strong><Link href="/admin/products">Manage products</Link></div>
        <div><span>Category items</span><strong>{diversifiedItems.length}</strong><Link href="/admin/categories">Manage categories</Link></div>
        <div><span>Open / Total inquiries</span><strong>{openInquiries} / {summary.inquiries.length}</strong><Link href="/admin/inquiries">Open inbox</Link></div>
      </section>
      <section className="admin-panel admin-welcome">
        <p className="section-label">Quick links</p><h2>Manage your website</h2>
        <div className="admin-quick-links">
          <Link href="/admin/leadership">Leadership profiles</Link>
          <Link href="/admin/products">Core product offerings</Link>
          <Link href="/admin/categories">Diversified catalogue</Link>
          <Link href="/admin/inquiries">Inquiry inbox</Link>
        </div>
      </section>
      <section className="admin-panel" style={{ marginTop: 24 }}>
        <div className="admin-toolbar"><h2>Recent inquiries</h2><Link href="/admin/inquiries" className="admin-link-button">View inbox</Link></div>
        {!recentInquiries.length && <p className="admin-empty">No inquiries yet.</p>}
        {!!recentInquiries.length && <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Received</th><th>Buyer</th><th>Product</th><th>Status</th></tr></thead><tbody>
          {recentInquiries.map((item) => <tr key={item.id}><td>{item.created_at ? new Date(item.created_at).toLocaleDateString() : "—"}</td><td><strong>{item.name}</strong><br /><span className="admin-muted">{item.email}</span></td><td>{item.product || "General inquiry"}</td><td>{item.status || "new"}</td></tr>)}
        </tbody></table></div>}
      </section>
    </div>
  );
}
