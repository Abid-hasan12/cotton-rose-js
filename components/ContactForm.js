"use client";

import Link from "next/link";
import { cloneElement, useEffect, useRef, useState } from "react";
import FadeIn from "./FadeIn";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[0-9+()\-\s]{7,}$/;
export default function ContactForm() {
  const [interests, setInterests] = useState([]);
  const [interestError, setInterestError] = useState("");
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const summaryRef = useRef(null);

  useEffect(() => {
    async function loadInterests() {
      try {
        const [coreResponse, diversifiedResponse] = await Promise.all([
          fetch("/api/products?group=core&limit=100"),
          fetch("/api/products?group=diversified&limit=100"),
        ]);
        const coreResult = await coreResponse.json();
        const diversifiedResult = await diversifiedResponse.json();
        if (!coreResponse.ok) throw new Error(coreResult.error || "Could not load product interests.");
        if (!diversifiedResponse.ok) throw new Error(diversifiedResult.error || "Could not load product interests.");
        setInterests([
          ...coreResult.data.map(({ slug, name }) => [slug, name]),
          ...diversifiedResult.data.map(({ slug, name }) => [`diversified-${slug}`, name]),
        ]);
      } catch (error) {
        setInterestError(error.message);
      }
    }

    loadInterests();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    const nextErrors = {};
    if (!values.name?.trim()) nextErrors.name = "Please enter your name.";
    if (!values.phone?.trim() || !phonePattern.test(values.phone.trim())) nextErrors.phone = "Please enter a valid phone number.";
    if (!values.email?.trim() || !emailPattern.test(values.email.trim())) nextErrors.email = "Please enter a valid email address.";
    if (!values.product) nextErrors.product = "Please select a product category.";
    if (!values.message?.trim()) nextErrors.message = "Please describe your sourcing requirement.";
    if (!values.privacy) nextErrors.privacy = "Please confirm that CottonRose may use these details to answer your inquiry.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setStatus({ type: "error", message: "Please correct the highlighted fields." });
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setStatus({ type: "loading", message: "Sending your inquiry…" });
    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, inquiryType: "contact" }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Your inquiry could not be delivered.");
      form.reset();
      setErrors({});
      setStatus({ type: "success", message: "Your inquiry was delivered successfully. CottonRose will review the details and follow up." });
    } catch (error) {
      setStatus({ type: "error", message: `${error.message} You can also email info@cottonrosebd.com.` });
    }
    requestAnimationFrame(() => summaryRef.current?.focus());
  };

  return (
    <FadeIn as="form" className="form" noValidate onSubmit={submit}>
      <div ref={summaryRef} className={`form__status form__status--${status.type}`} role={status.type === "error" ? "alert" : "status"} tabIndex="-1">{status.message}</div>
      <div className="form__honeypot" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" name="website" type="text" tabIndex="-1" autoComplete="off" /></div>
      <div className="form__row">
        <Field label="Full Name" id="name" error={errors.name} required><input type="text" id="name" name="name" autoComplete="name" /></Field>
        <Field label="Phone Number" id="phone" error={errors.phone} required><input type="tel" id="phone" name="phone" autoComplete="tel" /></Field>
      </div>
      <div className="form__row">
        <Field label="Email Address" id="email" error={errors.email} required><input type="email" id="email" name="email" autoComplete="email" /></Field>
        <Field label="Product Interest" id="product" error={errors.product} required><select id="product" name="product" defaultValue="" disabled={!interests.length}><option value="">{interestError || (interests.length ? "Select a category" : "Loading categories...")}</option>{interests.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></Field>
      </div>
      <div className="form__row">
        <Field label="Estimated Quantity" id="quantity"><input type="text" id="quantity" name="quantity" placeholder="e.g. 5,000 pieces" /></Field>
        <Field label="Destination Market" id="destination"><input type="text" id="destination" name="destination" placeholder="Country or region" /></Field>
      </div>
      <Field label="Required Delivery Date" id="deliveryDate"><input type="date" id="deliveryDate" name="deliveryDate" /></Field>
      <Field label="Sourcing Requirement" id="message" error={errors.message} required><textarea id="message" name="message" placeholder="Product, material, target price, testing, compliance, packaging, and delivery requirements" /></Field>
      <div className="form__group"><label className="form__check" htmlFor="privacy"><input type="checkbox" id="privacy" name="privacy" value="accepted" aria-describedby={errors.privacy ? "privacy-error" : undefined} aria-invalid={Boolean(errors.privacy)} /> <span>I agree that CottonRose may use these details to respond to this inquiry. Read the <Link href="/privacy">privacy notice</Link>.</span></label><div className="form__error" id="privacy-error">{errors.privacy || ""}</div></div>
      <button type="submit" className="btn btn--navy" disabled={status.type === "loading"}>{status.type === "loading" ? "Sending…" : "Send Inquiry"}</button>
    </FadeIn>
  );
}

function Field({ label, id, error, children, required = false }) {
  const errorId = `${id}-error`;
  return <div className="form__group">{label && <label htmlFor={id}>{label}{required ? " *" : ""}</label>}{cloneElement(children, { "aria-describedby": error ? errorId : undefined, "aria-invalid": Boolean(error), required })}<div className="form__error" id={errorId}>{error || ""}</div></div>;
}
