import { Suspense } from "react";
import type { Metadata } from "next";
import CategoryProductsView from "@/components/product/CategoryProductsView";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const name = slug.charAt(0).toUpperCase() + slug.slice(1);
  return {
    title: `${name} — SteelLuxe`,
    description: `Shop premium stainless steel ${slug} at SteelLuxe.`,
  };
}

const CATEGORY_INFO: Record<string, { heading: string; desc: string }> = {
  necklaces: {
    heading: "Necklaces",
    desc: "Delicate chains, statement pendants & layering pieces.",
  },
  earrings: {
    heading: "Earrings",
    desc: "Studs, hoops, drops & ear climbers.",
  },
  rings: {
    heading: "Rings",
    desc: "Bands, stacking rings & statement pieces.",
  },
  bracelets: { heading: "Bracelets", desc: "Chains, cuffs & charm bracelets." },
};

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const info = CATEGORY_INFO[slug] ?? { heading: slug, desc: "" };

  return (
    <div>
      {/* Category hero */}
      <div className="bg-cream-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-2xs tracking-[0.3em] uppercase text-gold-500 mb-2 font-body">
            Collection
          </p>
          <h1 className="font-display text-5xl sm:text-6xl text-charcoal-900 font-light">
            {info.heading}
          </h1>
          <p className="text-charcoal-500 font-body mt-2">{info.desc}</p>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="flex justify-center py-24">
            <div className="skeleton w-32 h-4 rounded" />
          </div>
        }
      >
        <CategoryProductsView category={slug} />
      </Suspense>
    </div>
  );
}
