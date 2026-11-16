"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Login failed.");
      const next = new URLSearchParams(window.location.search).get("next");
      router.replace(next && next.startsWith("/") && !next.startsWith("//") ? next : "/admin");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-auth">
      <section className="admin-auth__card">
        <p className="section-label">CottonRose</p>
        <h1>Admin sign in</h1>
        <p className="admin-muted">Manage and respond to sourcing inquiries.</p>
        <form className="admin-form" onSubmit={submit}>
          <label htmlFor="username">Username</label>
          <input id="username" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} autoComplete="username" required />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} autoComplete="current-password" required />
          {message && <p className="admin-alert" role="alert">{message}</p>}
          <button className="btn btn--gold" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
        </form>
      </section>
    </main>
  );
}
