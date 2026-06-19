"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import ProductGrid from "@/components/product/ProductGrid";
import { getProducts } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import type { Product, ProductFilters, Category } from "@/types";
import { cn } from "@/lib/utils";

const CATEGORIES: { label: string; value: Category | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Necklaces", value: "necklaces" },
  { label: "Earrings", value: "earrings" },
  { label: "Rings", value: "rings" },
  { label: "Bracelets", value: "bracelets" },
];

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low", value: "price-asc" },
  { label: "Price: High", value: "price-desc" },
  { label: "Best Selling", value: "popular" },
  { label: "Top Rated", value: "rating" },
];

export default function CategoryProductsView({
  category,
}: {
  category: string;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState<Category | "all">(
    category as Category,
  );
  const [sortBy, setSortBy] = useState<ProductFilters["sortBy"]>("newest");
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const filters: ProductFilters = {
          ...(activeCat !== "all" ? { category: activeCat } : {}),
          sortBy,
          ...(priceRange
            ? { minPrice: priceRange[0], maxPrice: priceRange[1] }
            : {}),
        };
        const { products: firestoreProducts } = await getProducts(filters, 100);
        setProducts(firestoreProducts);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCat, sortBy, priceRange]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <p className="text-sm text-charcoal-400 mb-6 font-body">
        {products.length} pieces
      </p>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCat(cat.value)}
            className={cn(
              "px-5 py-2 rounded-full text-xs tracking-widest uppercase whitespace-nowrap transition-all duration-200 font-body font-medium",
              activeCat === cat.value
                ? "bg-charcoal-900 text-cream-50"
                : "bg-cream-200 text-charcoal-600 hover:bg-cream-300",
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24 space-y-6">
            <div>
              <h3 className="text-xs tracking-widest uppercase text-charcoal-500 mb-3 font-body">
                Sort By
              </h3>
              <ul className="space-y-1">
                {SORT_OPTIONS.map((opt) => (
                  <li key={opt.value}>
                    <button
                      onClick={() =>
                        setSortBy(opt.value as ProductFilters["sortBy"])
                      }
                      className={cn(
                        "w-full text-left px-3 py-2 text-sm rounded-lg transition-colors font-body",
                        sortBy === opt.value
                          ? "bg-cream-200 text-charcoal-900 font-medium"
                          : "text-charcoal-600 hover:bg-cream-100",
                      )}
                    >
                      {opt.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <hr className="divider-gold" />

            <div>
              <h3 className="text-xs tracking-widest uppercase text-charcoal-500 mb-3 font-body">
                Price Range
              </h3>
              <div className="space-y-3">
                {[
                  [0, 500],
                  [500, 1000],
                  [1000, 2000],
                  [2000, 5000],
                ].map(([min, max]) => (
                  <button
                    key={`${min}-${max}`}
                    onClick={() => setPriceRange([min, max])}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm rounded-lg transition-colors font-body",
                      priceRange?.[0] === min && priceRange?.[1] === max
                        ? "bg-cream-200 text-charcoal-900 font-medium"
                        : "text-charcoal-600 hover:bg-cream-100",
                    )}
                  >
                    {formatPrice(min)} — {formatPrice(max)}
                  </button>
                ))}
                <button
                  onClick={() => setPriceRange(null)}
                  className="text-xs text-gold-500 hover:text-gold-600 transition-colors font-body"
                >
                  Clear price filter
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main grid */}
        <div className="flex-1 min-w-0">
          {/* Mobile sort */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as ProductFilters["sortBy"])
              }
              className="flex-1 px-4 py-2 border border-cream-300 rounded-full text-sm text-charcoal-700 bg-white focus:border-gold-400 focus:outline-none font-body appearance-none"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {products.length === 0 && !loading ? (
            <div className="text-center py-24">
              <p className="font-display text-3xl text-charcoal-400 mb-3">
                No products in this category yet
              </p>
              <p className="text-charcoal-400 text-sm font-body">
                Check back soon!
              </p>
            </div>
          ) : (
            <ProductGrid products={products} loading={loading} cols={3} />
          )}
        </div>
      </div>
    </div>
  );
}
