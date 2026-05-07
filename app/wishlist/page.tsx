'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlistStore, useCartStore, useUIStore } from '@/store';
import { DEMO_PRODUCTS, formatPrice } from '@/lib/utils';
import type { Product } from '@/types';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const { items: wishIds, toggle } = useWishlistStore();
  const { addItem } = useCartStore();
  const { openCart } = useUIStore();

  const allProducts: Product[] = DEMO_PRODUCTS.map((p, i) => ({
    ...p, id: `p-${i}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  })) as Product[];

  const products = allProducts.filter(p => wishIds.includes(p.id));

  const handleMoveToCart = (product: Product) => {
    if (product.sizes?.length) { window.location.href = `/products/${product.slug}`; return; }
    addItem(product, 1);
    toggle(product.id);
    openCart();
    toast.success('Moved to bag!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <p className="text-2xs tracking-[0.3em] uppercase text-gold-500 mb-1 font-body">Saved Items</p>
        <h1 className="font-display text-4xl sm:text-5xl text-charcoal-900 font-light">My Wishlist</h1>
        <p className="text-charcoal-400 font-body text-sm mt-1">{products.length} saved piece{products.length !== 1 ? 's' : ''}</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-24 h-24 rounded-full bg-cream-200 flex items-center justify-center mx-auto mb-6">
            <Heart size={40} className="text-charcoal-300" />
          </div>
          <h2 className="font-display text-3xl text-charcoal-500 font-light mb-3">Your wishlist is empty</h2>
          <p className="text-charcoal-400 text-sm font-body mb-8">Save pieces you love by clicking the ♡ on any product</p>
          <Link href="/products" className="btn-gold px-8 py-4 rounded-full font-body font-medium text-sm tracking-wider uppercase inline-flex items-center gap-2">
            Browse Collection <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => {
            const price = product.discount
              ? Math.round(product.price * (1 - product.discount / 100))
              : product.price;
            return (
              <div key={product.id} className="group">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-cream-200 mb-3">
                  <Link href={`/products/${product.slug}`}>
                    <Image src={product.images[0]} alt={product.name} fill className="object-cover product-img" sizes="(max-width: 768px) 50vw, 25vw" />
                  </Link>
                  <button
                    onClick={() => { toggle(product.id); toast.success('Removed from wishlist'); }}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-card hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
                <Link href={`/products/${product.slug}`} className="block">
                  <p className="text-xs text-charcoal-400 uppercase tracking-widest mb-1 font-body">{product.category}</p>
                  <p className="text-sm font-medium text-charcoal-900 hover:text-gold-600 transition-colors font-body mb-2 line-clamp-2">{product.name}</p>
                  <p className="font-medium font-body">{formatPrice(price)}</p>
                </Link>
                <button
                  onClick={() => handleMoveToCart(product)}
                  className="w-full mt-3 py-2.5 border border-charcoal-200 rounded-xl text-xs font-body font-medium tracking-wider uppercase text-charcoal-700 hover:border-gold-400 hover:text-gold-600 transition-all flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag size={13} /> Add to Bag
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
