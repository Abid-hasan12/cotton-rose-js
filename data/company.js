export const company = {
  name: "CottonRose",
  legalDisplayName: "CottonRose",
  tagline: "Apparel Sourcing, Quality Assurance and Supply Chain Management",
  description:
    "CottonRose is a Bangladesh-based apparel buying house that represents buyers throughout product development, sourcing, quality assurance, order management, and shipment coordination.",
  address: {
    street: "House 45, Road 4, Sector 11, Uttara Model Town",
    city: "Uttara, Dhaka",
    postcode: "1230",
    country: "Bangladesh",
  },
  contact: {
    email: "info@cottonrosebd.com",
    mobileDisplay: "+880 1976-694113",
    mobileHref: "+8801976694113",
    landDisplay: "+880 2 224471434",
    landHref: "+8802224471434",
    whatsapp: "https://wa.me/8801976694113",
  },
  website: "https://www.cottonrosebd.com",
  officeHours: "Sunday–Thursday, 9:00 AM–6:00 PM (GMT+6)",
  markets: ["Europe", "North America", "Australia", "Asia"],
};

export const companyAddress = `${company.address.street}, ${company.address.city}-${company.address.postcode}, ${company.address.country}`;

export const primaryNavigation = [
  { href: "/", label: "Home", match: (pathname) => pathname === "/" },
  { href: "/about", label: "About", match: (pathname) => pathname.startsWith("/about") },
  { href: "/services", label: "Services", match: (pathname) => pathname.startsWith("/services") },
  { href: "/quality-compliance", label: "Quality & Compliance", match: (pathname) => pathname.startsWith("/quality-compliance") || pathname.startsWith("/sustainability") },
  { href: "/contact", label: "Contact", match: (pathname) => pathname.startsWith("/contact") },
];
 