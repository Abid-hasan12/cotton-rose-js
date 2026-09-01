import "@/css/style.css";
import { company, companyAddress } from "@/data/company";

export const metadata = {
  metadataBase: new URL(company.website),
  title: {
    default: `${company.name} | ${company.tagline}, Bangladesh`,
    template: `%s | ${company.name}`,
  },
  description: company.description,
  applicationName: company.name,
  openGraph: {
    type: "website",
    siteName: company.name,
    title: `${company.name} | ${company.tagline}`,
    description: company.description,
    url: "/",
    images: [{ url: "/images/banner2.png", width: 1262, height: 848, alt: "CottonRose apparel sourcing and product development" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${company.name} | ${company.tagline}`,
    description: company.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    url: company.website,
    email: company.contact.email,
    telephone: company.contact.mobileHref,
    address: {
      "@type": "PostalAddress",
      streetAddress: company.address.street,
      addressLocality: company.address.city,
      postalCode: company.address.postcode,
      addressCountry: "BD",
    },
    description: company.description,
  };

  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
