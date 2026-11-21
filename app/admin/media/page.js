"use client";

import { useEffect, useRef, useState } from "react";

export default function MediaPage() {
  const [assets, setAssets] = useState([]);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  async function load() {
    const response = await fetch("/api/admin/media"); const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Media could not be loaded.");
    setAssets(result);
  }
  useEffect(() => { load().catch((error) => setMessage(error.message)); }, []);
  async function upload(files) {
    setUploading(true); setMessage("");
    try {
      for (const file of files) {
        const form = new FormData(); form.append("file", file);
        const response = await fetch("/api/admin/media/upload", { method: "POST", body: form });
        const result = await response.json(); if (!response.ok) throw new Error(result.message || "Upload failed.");
      }
      await load();
    } catch (error) { setMessage(error.message); } finally { setUploading(false); }
  }
  return <div className="admin-content">
    <header className="admin-page-header"><div><p className="section-label">Assets</p><h1>Media library</h1><p className="admin-muted">Upload approved images and documents for your website.</p></div></header>
    {message && <p className="admin-alert" role="alert">{message}</p>}
    <section className="admin-upload-dropzone" onClick={() => inputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); upload([...event.dataTransfer.files]); }}>
      <input ref={inputRef} type="file" accept="image/*,application/pdf" multiple hidden onChange={(event) => upload([...event.target.files])} />
      <strong>{uploading ? "Uploading..." : "Drop files here or browse"}</strong><span>JPG, PNG, WEBP, GIF or PDF up to 10 MB</span>
    </section>
    <section className="admin-media-grid">{assets.map((asset) => <article className="admin-media-card" key={asset.id}>{asset.mimeType?.startsWith("image/") ? <img src={asset.url} alt={asset.alt || asset.name} /> : <div className="admin-media-file">PDF</div>}<div><strong>{asset.name}</strong><span>{Math.ceil(asset.size / 1024)} KB</span></div></article>)}{!assets.length && <p className="admin-empty">Your media library is empty.</p>}</section>
  </div>;
}
