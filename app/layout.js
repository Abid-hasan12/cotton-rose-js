import "@/css/style.css";
import "./profile.css";

export const metadata = {
  title: {
    default: "CottonRose | Premier Apparel Sourcing & SCM & Garment Exporter, Bangladesh",
    template: "%s | Cottonrose"
  },
  description:
    "CottonRose is a Dhaka-based apparel buying house connecting international fashion brands with compliant, quality-driven Bangladeshi garment factories."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
