"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductGrid from "@/components/product/ProductGrid";
import type { Product } from "@/types";
import { getProducts } from "@/lib/db";

export default function NewArrivalsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        // جيب كل المنتجات وفلتر على isNew
        const { products } = await getProducts({}, 100);
        const newProducts = products
          .filter((p) => p.isNew === true)
          .slice(0, 8);
        setProducts(newProducts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-2xs tracking-[0.3em] uppercase text-gold-500 mb-2 font-body">
            Just Landed
          </p>
          <h2 className="font-display text-4xl sm:text-5xl text-charcoal-900 font-light leading-tight">
            New <em>In</em>
          </h2>
        </div>
        <Link
          href="/products?filter=new"
          className="hidden sm:flex items-center gap-2 text-sm text-charcoal-600 hover:text-charcoal-900 transition-colors group font-body"
        >
          View all
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>

      <ProductGrid
        products={products}
        loading={loading}
        skeletonCount={4}
        cols={4}
      />

      <Link
        href="/products?filter=new"
        className="sm:hidden mt-8 flex items-center justify-center gap-2 text-sm text-charcoal-600 hover:text-charcoal-900 transition-colors font-body"
      >
        View all new arrivals
        <ArrowRight size={16} />
      </Link>
    </section>
  );
}
