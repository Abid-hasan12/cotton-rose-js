import { NextResponse } from "next/server";

const attempts = new Map();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const clean = (value, limit = 1000) => String(value || "").trim().slice(0, limit);
const escapeHtml = (value) => clean(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character]));

export async function POST(request) {
  const length = Number(request.headers.get("content-length") || 0);
  if (length > 50_000) return NextResponse.json({ message: "The inquiry is too large." }, { status: 413 });

  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const clientKey = forwarded || "local";
  const now = Date.now();
  const recent = (attempts.get(clientKey) || []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_ATTEMPTS) return NextResponse.json({ message: "Too many inquiries were submitted. Please try again later." }, { status: 429 });
  attempts.set(clientKey, [...recent, now]);

  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ message: "Invalid inquiry data." }, { status: 400 }); }
  if (clean(body.website)) return NextResponse.json({ delivered: true });

  const fields = {
    name: clean(body.name, 120), phone: clean(body.phone, 60), email: clean(body.email, 160), product: clean(body.product, 120),
    quantity: clean(body.quantity, 80), destination: clean(body.destination, 120), deliveryDate: clean(body.deliveryDate, 40), message: clean(body.message, 4000), privacy: clean(body.privacy, 20),
  };
  if (!fields.name || !fields.phone || !/^\S+@\S+\.\S+$/.test(fields.email) || !fields.product || !fields.message || fields.privacy !== "accepted") {
    return NextResponse.json({ message: "Please complete all required fields with valid information." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.CONTACT_RECIPIENT;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !recipient || !from) return NextResponse.json({ message: "The online inquiry service is not configured yet." }, { status: 503 });

  const html = `<h1>New CottonRose sourcing inquiry</h1><p><strong>Name:</strong> ${escapeHtml(fields.name)}</p><p><strong>Email:</strong> ${escapeHtml(fields.email)}</p><p><strong>Phone:</strong> ${escapeHtml(fields.phone)}</p><p><strong>Product:</strong> ${escapeHtml(fields.product)}</p><p><strong>Quantity:</strong> ${escapeHtml(fields.quantity || "Not supplied")}</p><p><strong>Destination:</strong> ${escapeHtml(fields.destination || "Not supplied")}</p><p><strong>Delivery date:</strong> ${escapeHtml(fields.deliveryDate || "Not supplied")}</p><p><strong>Requirement:</strong></p><p>${escapeHtml(fields.message).replace(/\n/g, "<br>")}</p>`;
  const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ from, to: [recipient], reply_to: fields.email, subject: `CottonRose inquiry: ${fields.product}`, html }) });
  if (!response.ok) return NextResponse.json({ message: "The inquiry service could not confirm delivery." }, { status: 502 });
  return NextResponse.json({ delivered: true });
}
