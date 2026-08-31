import PageHero from "@/components/PageHero";
import FadeIn from "@/components/FadeIn";
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact Us",
  description: "Get in touch with Cottonrose for apparel sourcing inquiries, quotes, and factory partnership requests."
};

export default function ContactPage() {
  return <>
    <PageHero title="Contact Cottonrose" crumb="Contact" image="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1800&q=80" />
    <section className="section"><div className="container contact-grid">
      <FadeIn><span className="section-label">Get In Touch</span><h2>Our Office</h2>
        <div className="contact-info__item"><h4>Address</h4><p> House No. 45, Road No. 4, Sector No. 11, Uttara Model Town, Uttara, Dhaka-1330, Bangladesh.</p></div>
        <div className="contact-info__item"><h4>Phone</h4><a href="tel:+8801976694113">+880 1976694113</a></div>
        <div className="contact-info__item"><h4>Telephone</h4><a href="tel:+8802224471434">+880 2224471434</a></div>
        <div className="contact-info__item"><h4>Email</h4><a href="mailto:support@cottonrosebd.com">support@cottonrosebd.com</a></div>
        <div className="contact-info__item"><h4>Office Hours</h4><p>Sunday – Thursday, 9:00 AM – 6:00 PM (GMT+6)</p></div>
        <div className="contact-info__item"><h4>WhatsApp</h4><a className="whatsapp-link" href="https://wa.me/8801976694113" target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a></div>
        <div className="contact-info__item"><h4>Follow Us</h4><div className="social-row"><a href="#" aria-label="LinkedIn">in</a><a href="#" aria-label="Facebook">f</a><a href="#" aria-label="Instagram">ig</a></div></div>
        <div className="contact-info__item"><h4>Find Us</h4><iframe className="contact-info__map" src="https://www.google.com/maps?q=Uttara,Dhaka,Bangladesh&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Cottonrose office location map" /></div>
      </FadeIn>
      <ContactForm />
    </div></section>
  </>;
}
