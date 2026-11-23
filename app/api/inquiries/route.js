import { NextResponse } from "next/server";
import { query, tableColumns } from "@/lib/db";

const attempts = new Map();
const emailPattern = /^\S+@\S+\.\S+$/;
const phonePattern = /^[0-9+()\-\s]{7,}$/;
const clean = (value, limit) => String(value ?? "").trim().slice(0, limit);
const escapeHtml = (value) => clean(value, 5000).replace(/[&<>'"]/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
}[character]));

export async function POST(request) {
  const length = Number(request.headers.get("content-length") || 0);
  if (length > 50_000) return NextResponse.json({ message: "The inquiry is too large." }, { status: 413 });
  const clientKey = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const recent = (attempts.get(clientKey) || []).filter((time) => now - time < 15 * 60 * 1000);
  if (recent.length >= 5) return NextResponse.json({ message: "Too many inquiries were submitted. Please try again later." }, { status: 429 });
  attempts.set(clientKey, [...recent, now]);

  let body;
  try { body = await request.json(); } catch { return NextResponse.json({ message: "Invalid inquiry data." }, { status: 400 }); }
  if (clean(body.website, 100)) return NextResponse.json({ delivered: true });

  const inquiry = {
    name: clean(body.name, 120),
    email: clean(body.email, 160).toLowerCase(),
    phone: clean(body.phone, 60),
    productId: Number.isInteger(Number(body.productId)) ? Number(body.productId) : null,
    product: clean(body.product || body.productId, 255),
    quantity: clean(body.quantity, 80),
    destination: clean(body.destination, 120),
    deliveryDate: clean(body.deliveryDate, 40),
    message: clean(body.message, 4000),
    privacyConsent: body.privacyConsent === true || body.privacyConsent === "accepted" || body.privacy === "accepted",
    inquiryType: ["contact", "quote", "product"].includes(clean(body.inquiryType || body.source, 30).toLowerCase())
      ? clean(body.inquiryType || body.source, 30).toLowerCase()
      : "contact",
  };
  if (!inquiry.name || !emailPattern.test(inquiry.email) || !phonePattern.test(inquiry.phone)
    || !inquiry.product || !inquiry.message || !inquiry.privacyConsent) {
    return NextResponse.json({ message: "Please complete all required fields with valid information." }, { status: 400 });
  }

  try {
    const columns = await tableColumns("inquiries");
    const hasInquiryType = columns.has("inquiry_type");
    const inquiryTypeColumn = hasInquiryType ? ", inquiry_type" : "";
    const inquiryTypePlaceholder = hasInquiryType ? ", ?" : "";
    await query(
      `INSERT INTO inquiries
       (name, email, phone, product_id, product, quantity, destination, delivery_date,
         message, privacy_consent, status${inquiryTypeColumn})
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new'${inquiryTypePlaceholder})`,
      [
         inquiry.name, inquiry.email, inquiry.phone, inquiry.productId, inquiry.product,
         inquiry.quantity, inquiry.destination, inquiry.deliveryDate || null, inquiry.message,
         inquiry.privacyConsent ? 1 : 0,
         ...(hasInquiryType ? [inquiry.inquiryType] : []),
      ],
    );
  } catch (error) {
    console.error("Could not save inquiry:", error);
    return NextResponse.json({ message: "The inquiry could not be saved. Please try again later." }, { status: 500 });
  }

  const html = `<h1>New CottonRose sourcing inquiry</h1><p><strong>Name:</strong> ${escapeHtml(inquiry.name)}</p><p><strong>Email:</strong> ${escapeHtml(inquiry.email)}</p><p><strong>Phone:</strong> ${escapeHtml(inquiry.phone)}</p><p><strong>Product:</strong> ${escapeHtml(inquiry.product)}</p><p><strong>Quantity:</strong> ${escapeHtml(inquiry.quantity || "Not supplied")}</p><p><strong>Destination:</strong> ${escapeHtml(inquiry.destination || "Not supplied")}</p><p><strong>Delivery date:</strong> ${escapeHtml(inquiry.deliveryDate || "Not supplied")}</p><p>${escapeHtml(inquiry.message).replace(/\n/g, "<br>")}</p>`;
  if (process.env.RESEND_API_KEY && process.env.CONTACT_RECIPIENT && process.env.CONTACT_FROM_EMAIL) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: process.env.CONTACT_FROM_EMAIL, to: [process.env.CONTACT_RECIPIENT], reply_to: inquiry.email, subject: `CottonRose inquiry: ${inquiry.product}`, html }),
      });
      if (!response.ok) console.error("Resend rejected inquiry notification:", response.status);
    } catch (error) { console.error("Could not send inquiry notification:", error); }
  }
  return NextResponse.json({ delivered: true });
}
