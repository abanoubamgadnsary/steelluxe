'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { useCartStore, useWishlistStore, useUIStore } from '@/store';
import { cn, formatPrice } from '@/lib/utils';
import type { Product } from '@/types';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  className?: string;
  priority?: boolean;
}

export default function ProductCard({ product, className, priority = false }: ProductCardProps) {
  const router         = useRouter();
  const addItem        = useCartStore(s => s.addItem);
  const { toggle, has } = useWishlistStore();
  const { openCart }   = useUIStore();
  const wished          = has(product.id);

  const price = product.discount
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    // If product has sizes, navigate to product page
    if (product.sizes && product.sizes.length > 0) {
      window.location.href = `/products/${product.slug}`;
      return;
    }
    addItem(product, 1);
    openCart();
    toast.success('Added to bag!');
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggle(product.id);
    toast.success(wished ? 'Removed from wishlist' : 'Added to wishlist ♡');
  };

  return (
    <div className={cn('product-card group relative', className)}>
      <Link href={`/products/${product.slug}`} className="block">
        {/* Image container */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-cream-200 mb-3">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="product-img object-cover"
            priority={priority}
          />

          {/* Second image on hover */}
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt={`${product.name} – alternate view`}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="product-img object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 absolute inset-0"
            />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNew      && <span className="badge-new">New</span>}
            {product.discount   && <span className="badge-sale">-{product.discount}%</span>}
            {product.isBestSeller && !product.isNew && <span className="badge-new" style={{background:'#1C1A17'}}>Best Seller</span>}
          </div>

          {/* Actions overlay */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-3 group-hover:translate-x-0 transition-all duration-300">
            <button
              onClick={handleWishlist}
              className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-card hover:bg-white transition-colors"
              aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart
                size={16}
                className={cn('transition-colors', wished ? 'fill-red-400 text-red-400' : 'text-charcoal-600')}
              />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); router.push(`/products/${product.slug}`); }}
              className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-card hover:bg-white transition-colors"
              aria-label="Quick view"
            >
              <Eye size={16} className="text-charcoal-600" />
            </button>
          </div>

          {/* Quick add to cart */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 left-3 right-3 py-2.5 bg-charcoal-900/90 text-cream-50 text-xs font-medium tracking-widest uppercase rounded-xl
                       opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300
                       hover:bg-charcoal-900 flex items-center justify-center gap-2 backdrop-blur-sm"
          >
            <ShoppingBag size={14} />
            {product.sizes?.length ? 'Select Size' : 'Add to Bag'}
          </button>
        </div>

        {/* Info */}
        <div>
          <p className="text-2xs text-charcoal-400 uppercase tracking-widest mb-1 font-body">
            {product.category}
          </p>
          <h3 className="text-sm font-medium text-charcoal-900 group-hover:text-gold-600 transition-colors leading-snug line-clamp-2 font-body mb-2">
            {product.name}
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-medium text-charcoal-900 font-body">{formatPrice(price)}</span>
              {product.comparePrice && (
                <span className="text-xs text-charcoal-400 line-through">{formatPrice(product.comparePrice)}</span>
              )}
              {product.discount && product.comparePrice == null && (
                <span className="text-xs text-charcoal-400 line-through">{formatPrice(product.price)}</span>
              )}
            </div>

            {product.reviewCount > 0 && (
              <div className="flex items-center gap-1">
                <Star size={11} className="fill-gold-400 text-gold-400" />
                <span className="text-xs text-charcoal-400">{product.rating}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
