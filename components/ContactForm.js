"use client";

import { cloneElement, useState } from "react";
import FadeIn from "./FadeIn";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[0-9+()\-\s]{7,}$/;

export default function ContactForm() {
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    setSuccess(false);
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    const nextErrors = {};
    if (!values.name.trim()) nextErrors.name = "Please enter your name.";
    if (!values.phone.trim() || !phonePattern.test(values.phone.trim())) nextErrors.phone = "Please enter a valid phone number.";
    if (!values.email.trim() || !emailPattern.test(values.email.trim())) nextErrors.email = "Please enter a valid email address.";
    if (!values.product) nextErrors.product = "Please select a product category.";
    if (!values.message.trim()) nextErrors.message = "Please add a short message.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setSuccess(true);
    form.reset();
    requestAnimationFrame(() => form.querySelector(".form__success")?.scrollIntoView({ behavior: "smooth", block: "center" }));
  };

  return (
    <FadeIn as="form" className="form" noValidate onSubmit={submit}>
      <div className={`form__success${success ? " form__success--visible" : ""}`} role="status">{success ? "Thank you! Your inquiry has been received. Our merchandising team will contact you within 1–2 business days." : ""}</div>
      <div className="form__row">
        <Field label="Full Name" id="name" error={errors.name}><input type="text" id="name" name="name" placeholder="Your name" /></Field>
        <Field label="Phone Number" id="phone" error={errors.phone}><input type="tel" id="phone" name="phone" placeholder="+1 555 000 0000" /></Field>
      </div>
      <div className="form__row">
        <Field label="Email Address" id="email" error={errors.email}><input type="email" id="email" name="email" placeholder="you@company.com" /></Field>
        <Field label="Product Interest" id="product" error={errors.product}>
          <select id="product" name="product" defaultValue=""><option value="">Select a category</option><option value="knitwear">Knitwear</option><option value="woven">Woven</option><option value="denim">Denim</option><option value="sweater">Sweater</option><option value="outerwear">Outerwear</option><option value="activewear">Activewear</option></select>
        </Field>
      </div>
      <Field label="Estimated Quantity" id="quantity"><input type="text" id="quantity" name="quantity" placeholder="e.g. 5,000 pcs" /></Field>
      <Field label="Message" id="message" error={errors.message}><textarea id="message" name="message" placeholder="Tell us about your sourcing requirements..." /></Field>
      <button type="submit" className="btn btn--navy">Send Inquiry</button>
    </FadeIn>
  );
}

function Field({ label, id, error, children }) {
  const errorId = `${id}-error`;
  return <div className="form__group"><label htmlFor={id}>{label}</label>{cloneElement(children, {
    "aria-describedby": error ? errorId : undefined,
    "aria-invalid": Boolean(error)
  })}<div className="form__error" id={errorId}>{error || ""}</div></div>;
}
