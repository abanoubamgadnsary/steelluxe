import ProductCard from './ProductCard';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';

function ProductSkeleton() {
  return (
    <div className="space-y-3">
      <div className="skeleton aspect-[3/4] rounded-2xl" />
      <div className="skeleton h-3 w-20 rounded" />
      <div className="skeleton h-4 w-40 rounded" />
      <div className="skeleton h-4 w-24 rounded" />
    </div>
  );
}

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  skeletonCount?: number;
  className?: string;
  cols?: 2 | 3 | 4;
}

export default function ProductGrid({
  products, loading = false, skeletonCount = 8, className, cols = 4,
}: ProductGridProps) {
  const gridClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }[cols];

  return (
    <div className={cn(`grid ${gridClass} gap-x-4 gap-y-8 sm:gap-x-6`, className)}>
      {loading
        ? Array.from({ length: skeletonCount }).map((_, i) => <ProductSkeleton key={i} />)
        : products.map((p, i) => <ProductCard key={p.id} product={p} priority={i < 4} />)
      }
    </div>
  );
}
