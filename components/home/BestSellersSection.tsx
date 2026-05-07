'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductGrid from '@/components/product/ProductGrid';
import { DEMO_PRODUCTS } from '@/lib/utils';
import type { Product } from '@/types';

export default function BestSellersSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const demo = DEMO_PRODUCTS.filter(p => p.isBestSeller).slice(0, 4).map((p, i) => ({
        ...p, id: `bs-${i}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      })) as Product[];
      setProducts(demo);
      setLoading(false);
    }, 400);
  }, []);

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-2xs tracking-[0.3em] uppercase text-gold-500 mb-2 font-body">Customer Favourites</p>
          <h2 className="font-display text-4xl sm:text-5xl text-charcoal-900 font-light leading-tight">
            Best <em>Sellers</em>
          </h2>
        </div>
        <Link
          href="/products?filter=bestseller"
          className="hidden sm:flex items-center gap-2 text-sm text-charcoal-600 hover:text-charcoal-900 transition-colors group font-body"
        >
          View all
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      <ProductGrid products={products} loading={loading} skeletonCount={4} cols={4} />
    </section>
  );
}
