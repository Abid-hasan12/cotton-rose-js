"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { diversifiedProductGroups, diversifiedProducts } from "@/data/diversifiedProducts";

export default function DiversifiedProductCatalogue() {
  const [activeGroup, setActiveGroup] = useState("All");
  const visibleProducts = useMemo(
    () => activeGroup === "All" ? diversifiedProducts : diversifiedProducts.filter(({ group }) => group === activeGroup),
    [activeGroup],
  );

  return (
    <div>
      <div className="mb-10 flex flex-wrap justify-center gap-2" role="toolbar" aria-label="Filter diversified product lines">
        {diversifiedProductGroups.map((group) => (
          <button
            type="button"
            key={group}
            onClick={() => setActiveGroup(group)}
            aria-pressed={activeGroup === group}
            className={`rounded-full border px-5 py-2.5 text-sm font-bold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 ${activeGroup === group ? "border-brand-navy bg-brand-navy text-white shadow-lg" : "border-brand-navy/10 bg-white text-brand-navy hover:-translate-y-0.5 hover:border-brand-gold hover:text-brand-gold"}`}
          >
            {group}
          </button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-live="polite">
        {visibleProducts.map((product, index) => (
          <Link
            href={`/diversified-products/${product.id}`}
            key={product.id}
            className="group relative isolate min-h-72 overflow-hidden rounded-2xl bg-brand-navy shadow-product-card transition-all duration-500 hover:-translate-y-2 hover:shadow-product-card-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-4"
          >
            <Image src={product.image} alt={product.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover transition duration-700 ease-out group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/30 to-transparent transition-colors duration-500 group-hover:via-brand-navy/45" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <div className="mb-3 flex items-center justify-between text-xs font-bold uppercase tracking-[0.16em] text-brand-gold"><span>{product.group}</span><span>{String(index + 1).padStart(2, "0")}</span></div>
              <h3 className="text-xl font-bold text-white">{product.name}</h3>
              <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-white/80 transition-colors group-hover:text-brand-gold">View sample gallery <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
