"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const navigation = [
  ["Dashboard", "/admin"],
  ["Leadership", "/admin/leadership"],
  ["Products", "/admin/products"],
  ["Category", "/admin/categories"],
  ["Inquiries", "/admin/inquiries"],
];

function normalizePathname(pathname) {
  return pathname?.replace(/\/+$/, "") || "/";
}

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const normalizedPathname = normalizePathname(pathname);
  const isLoginPage = normalizedPathname === "/admin/login";
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(!isLoginPage);

  useEffect(() => {
    if (normalizePathname(pathname) === "/admin/login") {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch("/api/admin/me")
      .then((response) => {
        if (!response.ok) throw new Error("Authentication required.");
        return response.json();
      })
      .then(setAdmin)
      .catch(() => {
        const nextPath = normalizePathname(pathname) === "/admin/login" ? "/admin" : pathname;
        router.replace(`/admin/login?next=${encodeURIComponent(nextPath)}`);
      })
      .finally(() => setLoading(false));
  }, [pathname, router]);

  if (isLoginPage) return children;
  if (loading || !admin) return <main className="admin-loading">Loading your workspace...</main>;

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  return (
    <div className="admin-app">
      <aside className="admin-sidebar">
        <Link href="/admin" className="admin-brand">Cotton<span>Rose</span></Link>
        <p className="admin-sidebar__caption">Content workspace</p>
        <nav className="admin-sidebar__nav" aria-label="Admin navigation">
          {navigation.map(([label, href]) => (
            <Link key={href} href={href} className={pathname.startsWith(href) ? "admin-nav-link admin-nav-link--active" : "admin-nav-link"}>{label}</Link>
          ))}
        </nav>
        <div className="admin-sidebar__footer">
          <span>{admin.username}</span>
          <button onClick={logout}>Sign out</button>
        </div>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
