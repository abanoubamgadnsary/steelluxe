'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import ProductGrid from '@/components/product/ProductGrid';
import { DEMO_PRODUCTS, formatPrice } from '@/lib/utils';
import type { Product, ProductFilters, Category } from '@/types';
import { cn } from '@/lib/utils';

const CATEGORIES: { label: string; value: Category | 'all' }[] = [
  { label: 'All',       value: 'all'       },
  { label: 'Necklaces', value: 'necklaces' },
  { label: 'Earrings',  value: 'earrings'  },
  { label: 'Rings',     value: 'rings'     },
  { label: 'Bracelets', value: 'bracelets' },
];

const SORT_OPTIONS = [
  { label: 'Newest',       value: 'newest'     },
  { label: 'Price: Low',   value: 'price-asc'  },
  { label: 'Price: High',  value: 'price-desc' },
  { label: 'Best Selling', value: 'popular'    },
  { label: 'Top Rated',    value: 'rating'     },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products,   setProducts]   = useState<Product[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [filters,    setFilters]    = useState<ProductFilters>({
    category:  (searchParams.get('category') as Category) ?? 'all',
    sortBy:    'newest',
    minPrice:  0,
    maxPrice:  5000,
  });
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    let items = DEMO_PRODUCTS.map((p, i) => ({
      ...p, id: `p-${i}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })) as Product[];

    const search = searchParams.get('search');
    const filter = searchParams.get('filter');

    if (search) items = items.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    if (filter === 'new')        items = items.filter(p => p.isNew);
    if (filter === 'bestseller') items = items.filter(p => p.isBestSeller);
    if (filter === 'sale')       items = items.filter(p => p.discount);
    if (filters.category && filters.category !== 'all') items = items.filter(p => p.category === filters.category);
    if (filters.minPrice) items = items.filter(p => p.price >= (filters.minPrice ?? 0));
    if (filters.maxPrice) items = items.filter(p => p.price <= (filters.maxPrice ?? 9999));

    if (filters.sortBy === 'price-asc')  items.sort((a, b) => a.price - b.price);
    if (filters.sortBy === 'price-desc') items.sort((a, b) => b.price - a.price);
    if (filters.sortBy === 'popular')    items.sort((a, b) => b.sold - a.sold);
    if (filters.sortBy === 'rating')     items.sort((a, b) => b.rating - a.rating);

    setTimeout(() => { setProducts(items); setLoading(false); }, 500);
  }, [filters, searchParams]);

  const search = searchParams.get('search');
  const filter = searchParams.get('filter');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page header */}
      <div className="mb-8">
        <p className="text-2xs tracking-[0.3em] uppercase text-gold-500 mb-1 font-body">Collection</p>
        <h1 className="font-display text-4xl sm:text-5xl text-charcoal-900 font-light">
          {search ? `"${search}"` : filter === 'new' ? 'New Arrivals' : filter === 'sale' ? 'Sale' : filter === 'bestseller' ? 'Best Sellers' : 'All Jewelry'}
        </h1>
        <p className="text-sm text-charcoal-400 mt-2 font-body">{products.length} pieces</p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setFilters(f => ({ ...f, category: cat.value }))}
            className={cn(
              'px-5 py-2 rounded-full text-xs tracking-widest uppercase whitespace-nowrap transition-all duration-200 font-body font-medium',
              filters.category === cat.value
                ? 'bg-charcoal-900 text-cream-50'
                : 'bg-cream-200 text-charcoal-600 hover:bg-cream-300'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filters — desktop */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24 space-y-6">
            <div>
              <h3 className="text-xs tracking-widest uppercase text-charcoal-500 mb-3 font-body">Sort By</h3>
              <ul className="space-y-1">
                {SORT_OPTIONS.map(opt => (
                  <li key={opt.value}>
                    <button
                      onClick={() => setFilters(f => ({ ...f, sortBy: opt.value as ProductFilters['sortBy'] }))}
                      className={cn(
                        'w-full text-left px-3 py-2 text-sm rounded-lg transition-colors font-body',
                        filters.sortBy === opt.value ? 'bg-cream-200 text-charcoal-900 font-medium' : 'text-charcoal-600 hover:bg-cream-100'
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
              <h3 className="text-xs tracking-widest uppercase text-charcoal-500 mb-3 font-body">Price Range</h3>
              <div className="space-y-3">
                {[[0, 500], [500, 1000], [1000, 2000], [2000, 5000]].map(([min, max]) => (
                  <button
                    key={`${min}-${max}`}
                    onClick={() => setFilters(f => ({ ...f, minPrice: min, maxPrice: max }))}
                    className={cn(
                      'w-full text-left px-3 py-2 text-sm rounded-lg transition-colors font-body',
                      filters.minPrice === min && filters.maxPrice === max
                        ? 'bg-cream-200 text-charcoal-900 font-medium' : 'text-charcoal-600 hover:bg-cream-100'
                    )}
                  >
                    {formatPrice(min)} — {formatPrice(max)}
                  </button>
                ))}
                <button
                  onClick={() => setFilters(f => ({ ...f, minPrice: 0, maxPrice: 5000 }))}
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
          {/* Mobile filter bar */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-cream-300 rounded-full text-sm text-charcoal-700 hover:border-gold-400 transition-colors font-body"
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>
            <select
              value={filters.sortBy}
              onChange={e => setFilters(f => ({ ...f, sortBy: e.target.value as ProductFilters['sortBy'] }))}
              className="flex-1 px-4 py-2 border border-cream-300 rounded-full text-sm text-charcoal-700 bg-white focus:border-gold-400 focus:outline-none font-body appearance-none"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {products.length === 0 && !loading ? (
            <div className="text-center py-24">
              <p className="font-display text-3xl text-charcoal-400 mb-3">No results found</p>
              <p className="text-charcoal-400 text-sm font-body">Try adjusting your filters or search term</p>
            </div>
          ) : (
            <ProductGrid products={products} loading={loading} cols={3} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-24"><div className="skeleton w-24 h-4 rounded" /></div>}>
      <ProductsContent />
    </Suspense>
  );
}
