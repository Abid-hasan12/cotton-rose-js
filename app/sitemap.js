import { company } from "@/data/company";
import { products } from "@/data/products";
import { diversifiedProducts } from "@/data/diversifiedProducts";

export default function sitemap() {
  const base = company.website.replace(/\/$/, "");
  const staticRoutes = ["", "/about", "/products", "/diversified-products", "/services", "/quality-compliance", "/contact", "/privacy"];
  return [
    ...staticRoutes.map((path) => ({ url: `${base}${path}`, changeFrequency: path === "" ? "weekly" : "monthly", priority: path === "" ? 1 : 0.7 })),
    ...products.map(({ id }) => ({ url: `${base}/products/${id}`, changeFrequency: "monthly", priority: 0.7 })),
    ...diversifiedProducts.map(({ id }) => ({ url: `${base}/diversified-products/${id}`, changeFrequency: "monthly", priority: 0.6 })),
  ];
}
