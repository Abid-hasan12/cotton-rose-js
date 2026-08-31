import Image from "next/image";
import Link from "next/link";

import BackToTop from "@/components/BackToTop";
import FadeIn from "@/components/FadeIn";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

const secondaryEmail = "info@cottonrosebd.com";
const landPhone = "+88 02 224471434";

function ContactCard({ label, children, icon }) {
  return (
    <div className="profile-contact-card">
      <span className="profile-contact-icon" aria-hidden="true">{icon}</span>
      <div>
        <strong>{label}</strong>
        {children}
      </div>
    </div>
  );
}

export default function LeadershipProfile({ name, role, email, whatsappHref, whatsappLabel }) {
  return (
    <>
      <SiteHeader />
      <main className="profile-page">
        <section className="profile-hero">
          <div className="container profile-hero__inner">
            <div className="profile-hero__portrait">
              <div className="profile-hero__portrait-frame">
                <Image src="/images/ceo.png" fill sizes="(max-width: 640px) 220px, 300px" alt={name} priority />
              </div>
            </div>
            <div className="profile-hero__content">
              <span className="profile-eyebrow">Cottonrose Leadership</span>
              <h1>{name}</h1>
              <p>{role} - Cottonrose</p>
              <div className="profile-hero__rule" />
              <Link href="/about" className="profile-back profile-back--hero">
                <span aria-hidden="true">←</span> Back to Leadership Team
              </Link>
            </div>
          </div>
        </section>

        <section className="profile-body section">
          <div className="container profile-layout">
            <FadeIn as="aside" className="profile-contact-panel">
              <span className="section-label">Get in touch</span>
              <h2 className="profile-section-title">Direct Contact Information</h2>
              <div className="profile-contact-list">
                <ContactCard label="Primary Email" icon="@">
                  <a href={`mailto:${email}`}>{email}</a>
                </ContactCard>
                <ContactCard label="WhatsApp" icon="W">
                  <a href={whatsappHref} target="_blank" rel="noreferrer">{whatsappLabel}</a>
                </ContactCard>
                <ContactCard label="Secondary Email" icon="@">
                  <a href={`mailto:${secondaryEmail}`}>{secondaryEmail}</a>
                </ContactCard>
                <ContactCard label="Land Phone" icon="T">
                  <span>{landPhone}</span>
                </ContactCard>
              </div>
            </FadeIn>

            <FadeIn className="profile-message-panel">
              <span className="section-label">Start a conversation</span>
              <h2 className="profile-section-title">Send a Direct Message</h2>
              <div className="profile-form-container">
                <form action="#" method="POST">
                  <div className="profile-form-row">
                    <div className="profile-form-group">
                      <label htmlFor="name">Your Name</label>
                      <input type="text" id="name" name="name" className="profile-form-control" placeholder="Enter your full name" required />
                    </div>
                    <div className="profile-form-group">
                      <label htmlFor="email">Your Email</label>
                      <input type="email" id="email" name="email" className="profile-form-control" placeholder="Enter your email address" required />
                    </div>
                  </div>
                  <div className="profile-form-group">
                    <label htmlFor="subject">Subject</label>
                    <input type="text" id="subject" name="subject" className="profile-form-control" placeholder="Enter message subject" required />
                  </div>
                  <div className="profile-form-group">
                    <label htmlFor="message">Message</label>
                    <textarea id="message" name="message" className="profile-form-control" placeholder="Write your message here..." required />
                  </div>
                  <button type="submit" className="profile-submit">
                    Send Message <span aria-hidden="true">→</span>
                  </button>
                </form>
              </div>
              <Link href="/about" className="profile-back profile-back--mobile">
                <span aria-hidden="true">←</span> Back to Leadership Team
              </Link>
            </FadeIn>
          </div>
        </section>
      </main>
      <SiteFooter />
      <BackToTop />
    </>
  );
}
