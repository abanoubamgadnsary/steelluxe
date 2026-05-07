'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import { Heart, ShoppingBag, Star, Shield, Truck, RefreshCw, ChevronLeft, ChevronRight, Plus, Minus, Share2 } from 'lucide-react';
import { useCartStore, useWishlistStore, useUIStore } from '@/store';
import { DEMO_PRODUCTS, formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';
import ProductGrid from '@/components/product/ProductGrid';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const params    = useParams<{ id: string }>();
  const [product, setProduct]       = useState<Product | null>(null);
  const [related,  setRelated]      = useState<Product[]>([]);
  const [loading,  setLoading]      = useState(true);
  const [imgIndex, setImgIndex]     = useState(0);
  const [quantity, setQuantity]     = useState(1);
  const [selSize,  setSelSize]      = useState<string>('');
  const [tab,      setTab]          = useState<'desc'|'care'|'shipping'>('desc');

  const addItem      = useCartStore(s => s.addItem);
  const { toggle, has } = useWishlistStore();
  const { openCart } = useUIStore();

  useEffect(() => {
    const demo = DEMO_PRODUCTS.map((p, i) => ({
      ...p, id: `p-${i}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    })) as Product[];

    const found = demo.find(p => p.slug === params.id || p.id === params.id);
    if (found) {
      setProduct(found);
      setRelated(demo.filter(p => p.category === found.category && p.id !== found.id).slice(0, 4));
      if (found.sizes?.length) setSelSize(found.sizes.find(s => s.inStock)?.label ?? '');
    }
    setLoading(false);
  }, [params.id]);

  if (loading) return <ProductDetailSkeleton />;
  if (!product) return notFound();

  const price = product.discount
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price;

  const wished = has(product.id);

  const handleAddToCart = () => {
    if (product.sizes?.length && !selSize) { toast.error('Please select a size'); return; }
    addItem(product, quantity, selSize || undefined);
    openCart();
    toast.success('Added to your bag!');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success('Link copied!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-charcoal-400 mb-8 font-body">
        <Link href="/" className="hover:text-charcoal-700 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-charcoal-700 transition-colors">Shop</Link>
        <span>/</span>
        <Link href={`/category/${product.category}`} className="hover:text-charcoal-700 transition-colors capitalize">{product.category}</Link>
        <span>/</span>
        <span className="text-charcoal-700 truncate max-w-[160px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

        {/* ── Image Gallery ─────────────────────────────── */}
        <div className="space-y-3">
          {/* Main image */}
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-cream-200 group">
            <Image
              src={product.images[imgIndex]}
              alt={product.name}
              fill
              className="object-cover transition-all duration-500"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              {product.isNew     && <span className="badge-new">New</span>}
              {product.discount  && <span className="badge-sale">-{product.discount}%</span>}
            </div>

            {/* Nav arrows */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => setImgIndex(i => (i - 1 + product.images.length) % product.images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-card"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setImgIndex(i => (i + 1) % product.images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-card"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIndex(i)}
                  className={cn(
                    'relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 shrink-0',
                    imgIndex === i ? 'border-gold-500 shadow-gold' : 'border-transparent opacity-60 hover:opacity-100'
                  )}
                >
                  <Image src={img} alt={`View ${i + 1}`} fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Product Info ────────────────────────────────── */}
        <div className="lg:sticky lg:top-24 lg:self-start space-y-6">

          {/* Category + Rating */}
          <div className="flex items-center justify-between">
            <Link href={`/category/${product.category}`} className="text-xs tracking-widest uppercase text-gold-500 hover:text-gold-600 transition-colors font-body capitalize">
              {product.category}
            </Link>
            {product.reviewCount > 0 && (
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {Array(5).fill(0).map((_, i) => (
                    <Star key={i} size={13} className={i < Math.floor(product.rating) ? 'fill-gold-400 text-gold-400' : 'text-charcoal-200'} />
                  ))}
                </div>
                <span className="text-xs text-charcoal-500 font-body">{product.rating} ({product.reviewCount})</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl sm:text-4xl text-charcoal-900 font-light leading-snug">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="font-display text-3xl text-charcoal-900">{formatPrice(price)}</span>
            {product.discount && (
              <>
                <span className="text-lg text-charcoal-400 line-through font-body">{formatPrice(product.price)}</span>
                <span className="badge-sale">Save {product.discount}%</span>
              </>
            )}
          </div>

          <hr className="divider-gold" />

          {/* Material */}
          <div className="flex items-center gap-2 text-sm text-charcoal-500 font-body">
            <span className="font-medium text-charcoal-700">Material:</span>
            <span>{product.material}</span>
          </div>

          {/* Size selector (rings) */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-charcoal-700 font-body">Ring Size</span>
                <Link href="/size-guide" className="text-xs text-gold-500 hover:underline font-body">Size Guide →</Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size.label}
                    onClick={() => size.inStock && setSelSize(size.label)}
                    disabled={!size.inStock}
                    className={cn(
                      'w-11 h-11 rounded-xl border text-sm font-body font-medium transition-all duration-200',
                      !size.inStock && 'opacity-30 cursor-not-allowed line-through',
                      selSize === size.label
                        ? 'border-charcoal-900 bg-charcoal-900 text-cream-50 shadow-soft'
                        : 'border-cream-300 text-charcoal-700 hover:border-gold-400 hover:text-gold-600'
                    )}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <span className="text-sm font-medium text-charcoal-700 font-body mb-3 block">Quantity</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-cream-300 rounded-full">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-charcoal-600 hover:text-charcoal-900 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center font-medium font-body">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="w-10 h-10 flex items-center justify-center text-charcoal-600 hover:text-charcoal-900 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              <span className="text-xs text-charcoal-400 font-body">{product.stock} in stock</span>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 btn-gold py-4 rounded-full font-body font-medium text-sm tracking-wider uppercase flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={18} />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Bag'}
            </button>
            <button
              onClick={() => { toggle(product.id); toast.success(wished ? 'Removed from wishlist' : 'Added to wishlist ♡'); }}
              className={cn(
                'px-5 py-4 rounded-full border font-body font-medium text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-200',
                wished ? 'border-red-300 text-red-400 bg-red-50' : 'border-cream-300 text-charcoal-700 hover:border-gold-400 hover:text-gold-500'
              )}
            >
              <Heart size={18} className={wished ? 'fill-red-400' : ''} />
              <span className="hidden sm:inline">{wished ? 'Wishlisted' : 'Wishlist'}</span>
            </button>
            <button
              onClick={handleShare}
              className="px-4 py-4 rounded-full border border-cream-300 text-charcoal-600 hover:border-gold-400 hover:text-gold-500 transition-all duration-200"
            >
              <Share2 size={18} />
            </button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { icon: Shield,    text: 'Quality Guarantee' },
              { icon: Truck,     text: 'Fast Delivery'     },
              { icon: RefreshCw, text: '30-Day Returns'    },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-cream-100 text-center">
                <Icon size={16} className="text-gold-500" />
                <span className="text-2xs text-charcoal-500 font-body leading-tight">{text}</span>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="border-t border-cream-200 pt-6">
            <div className="flex gap-1 mb-4">
              {(['desc', 'care', 'shipping'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    'px-4 py-2 rounded-full text-xs tracking-wider uppercase font-body font-medium transition-all',
                    tab === t ? 'bg-charcoal-900 text-cream-50' : 'text-charcoal-500 hover:text-charcoal-700'
                  )}
                >
                  {t === 'desc' ? 'Description' : t === 'care' ? 'Care' : 'Shipping'}
                </button>
              ))}
            </div>
            <div className="text-sm text-charcoal-600 font-body leading-relaxed">
              {tab === 'desc' && <p>{product.description}</p>}
              {tab === 'care' && (
                <ul className="space-y-2">
                  <li>• Wipe clean with a soft, dry cloth after wearing</li>
                  <li>• Avoid harsh chemicals, perfumes, and chlorine</li>
                  <li>• Store in the provided pouch when not wearing</li>
                  <li>• Safe for swimming and showering</li>
                </ul>
              )}
              {tab === 'shipping' && (
                <div className="space-y-2">
                  <p><strong>Cairo & Giza:</strong> 1-2 business days — 60 EGP</p>
                  <p><strong>Alexandria & Delta:</strong> 2-3 business days — 70-80 EGP</p>
                  <p><strong>Upper Egypt:</strong> 3-5 business days — 85-100 EGP</p>
                  <p className="text-gold-600 font-medium mt-3">Free shipping on orders over 1,500 EGP!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-20 sm:mt-28">
          <div className="mb-8">
            <p className="text-2xs tracking-[0.3em] uppercase text-gold-500 mb-1 font-body">You May Also Like</p>
            <h2 className="font-display text-3xl text-charcoal-900 font-light">Related <em>Pieces</em></h2>
          </div>
          <ProductGrid products={related} cols={4} />
        </section>
      )}
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-3">
          <div className="skeleton aspect-[4/5] rounded-3xl" />
          <div className="flex gap-2">{Array(3).fill(0).map((_, i) => <div key={i} className="skeleton w-20 h-20 rounded-xl" />)}</div>
        </div>
        <div className="space-y-4">
          <div className="skeleton h-4 w-24 rounded" />
          <div className="skeleton h-10 w-64 rounded" />
          <div className="skeleton h-8 w-32 rounded" />
          <div className="skeleton h-px w-full rounded" />
          <div className="skeleton h-32 w-full rounded" />
          <div className="skeleton h-14 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}
