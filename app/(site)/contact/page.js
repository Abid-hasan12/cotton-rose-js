import PageHero from "@/components/PageHero";
import FadeIn from "@/components/FadeIn";
import ContactForm from "@/components/ContactForm";
import { company, companyAddress } from "@/data/company";

export const metadata = {
  title: "Contact Us",
  description: "Contact CottonRose for apparel sourcing, product development, quality-assurance, and order-management inquiries.",
};

export default function ContactPage() {
  const mapQuery = encodeURIComponent(companyAddress);
  return <>
    <PageHero title="Contact CottonRose" crumb="Contact" image="/images/banner2.png" />
    <section className="section"><div className="container">
      <div className="contact-grid">
        <FadeIn className="contact-panel"><span className="section-label">Get in touch</span><h2>Dhaka Office</h2><p className="contact-panel__intro">Share your buyer brief, product category, target quantity, destination, and required delivery date. Our team will review the request before confirming the next step.</p>
          <address>
            <div className="contact-info__item"><h3>Address</h3><p>{companyAddress}</p></div>
            <div className="contact-info__item"><h3>Mobile</h3><a href={`tel:${company.contact.mobileHref}`}>{company.contact.mobileDisplay}</a></div>
            <div className="contact-info__item"><h3>Land phone</h3><a href={`tel:${company.contact.landHref}`}>{company.contact.landDisplay}</a></div>
            <div className="contact-info__item"><h3>Email</h3><a href={`mailto:${company.contact.email}`}>{company.contact.email}</a></div>
            <div className="contact-info__item"><h3>Office hours</h3><p>{company.officeHours}</p></div>
          </address>
          <a className="btn btn--gold" href={company.contact.whatsapp} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
        </FadeIn>
        <ContactForm />
      </div>
      <FadeIn className="contact-map-block"><div><span className="section-label">Directions</span><h2>Find CottonRose</h2><a href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} target="_blank" rel="noreferrer">Open directions in Google Maps →</a></div><iframe className="contact-info__map" src={`https://www.google.com/maps?q=${mapQuery}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="CottonRose office location map" /></FadeIn>
    </div></section>
  </>;
}
