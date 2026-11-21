"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState({ inquiries: [], products: [] });
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([fetch("/api/admin/inquiries"), fetch("/api/admin/products")])
      .then(async ([inquiriesResponse, productsResponse]) => {
        if (!inquiriesResponse.ok || !productsResponse.ok) throw new Error("Dashboard data could not be loaded.");
        return Promise.all([inquiriesResponse.json(), productsResponse.json()]);
      })
      .then(([inquiries, products]) => setSummary({ inquiries, products }))
      .catch((reason) => setError(reason.message));
  }, []);

  const pending = summary.inquiries.filter((item) => item.status === "Pending").length;
  return (
    <div className="admin-content">
      <header className="admin-page-header">
        <div><p className="section-label">Overview</p><h1>Good morning</h1><p className="admin-muted">Keep your catalogue and buyer conversations up to date.</p></div>
        <Link href="/admin/products" className="btn btn--gold">Add product</Link>
      </header>
      {error && <p className="admin-alert" role="alert">{error}</p>}
      <section className="admin-stats">
        <div><span>Total products</span><strong>{summary.products.length}</strong><Link href="/admin/products">Manage catalogue</Link></div>
        <div><span>Open inquiries</span><strong>{pending}</strong><Link href="/admin/inquiries">Review inquiries</Link></div>
        <div><span>Total inquiries</span><strong>{summary.inquiries.length}</strong><Link href="/admin/inquiries">View all</Link></div>
      </section>
      <section className="admin-panel admin-welcome">
        <p className="section-label">Quick links</p><h2>Manage your website</h2>
        <div className="admin-quick-links">
          <Link href="/admin/company">Update company profile</Link>
          <Link href="/admin/leadership">Edit leadership team</Link>
          <Link href="/admin/services">Maintain services</Link>
          <Link href="/admin/media">Browse media library</Link>
        </div>
      </section>
    </div>
  );
}
