'use client';
import Link from 'next/link';
import Image from 'next/image';
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCartStore, useUIStore } from '@/store';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function CartDrawer() {
  const { cartOpen, closeCart } = useUIStore();
  const { items, removeItem, updateQuantity, subtotal, shipping, total, couponCode, discountAmount } = useCartStore();
  const sub = subtotal();

  return (
    <>
      {/* Backdrop */}
      {cartOpen && (
        <div
          className="fixed inset-0 bg-charcoal-900/50 backdrop-blur-sm z-[100] animate-fade-in"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <aside className={cn(
        'fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-cream-50 z-[101] flex flex-col',
        'transform transition-transform duration-400 ease-luxury shadow-hover',
        cartOpen ? 'translate-x-0' : 'translate-x-full'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gold-100">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} className="text-charcoal-700" />
            <h2 className="font-display text-xl text-charcoal-900">
              Your Bag
              {items.length > 0 && (
                <span className="ml-2 text-sm font-body text-charcoal-400 font-normal">({items.length})</span>
              )}
            </h2>
          </div>
          <button onClick={closeCart} className="p-2 hover:bg-cream-200 rounded-full transition-colors text-charcoal-600 hover:text-charcoal-900">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-16">
              <div className="w-20 h-20 rounded-full bg-cream-200 flex items-center justify-center">
                <ShoppingBag size={32} className="text-charcoal-300" />
              </div>
              <div>
                <p className="font-display text-2xl text-charcoal-700 mb-1">Your bag is empty</p>
                <p className="text-sm text-charcoal-400">Discover our beautiful collection</p>
              </div>
              <button
                onClick={closeCart}
                className="btn-gold px-6 py-3 rounded-full text-sm font-medium mt-2"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map(item => {
                const price = item.product.discount
                  ? Math.round(item.product.price * (1 - item.product.discount / 100))
                  : item.product.price;
                return (
                  <li key={`${item.productId}-${item.selectedSize}`} className="flex gap-4 py-4 border-b border-cream-200 last:border-0">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-cream-200 shrink-0">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-charcoal-900 truncate">{item.product.name}</p>
                      {item.selectedSize && (
                        <p className="text-xs text-charcoal-400 mt-0.5">Size: {item.selectedSize}</p>
                      )}
                      <p className="text-sm font-medium text-gold-600 mt-1">{formatPrice(price)}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 border border-cream-300 rounded-full px-1">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1, item.selectedSize)}
                            className="w-6 h-6 flex items-center justify-center text-charcoal-600 hover:text-charcoal-900 transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1, item.selectedSize)}
                            className="w-6 h-6 flex items-center justify-center text-charcoal-600 hover:text-charcoal-900 transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId, item.selectedSize)}
                          className="text-charcoal-300 hover:text-red-400 transition-colors p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Summary */}
        {items.length > 0 && (
          <div className="border-t border-gold-100 px-6 py-5 bg-white">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-charcoal-500">Subtotal</span>
                <span className="font-medium">{formatPrice(sub)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Coupon ({couponCode})</span>
                  <span>- {formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-charcoal-500">Shipping</span>
                <span className="font-medium text-charcoal-400 text-xs">Calculated at checkout</span>
              </div>
              <hr className="divider-gold" />
              <div className="flex justify-between font-medium text-base">
                <span>Total</span>
                <span className="text-gradient-gold font-display text-lg">{formatPrice(sub - discountAmount)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-gold w-full py-4 rounded-full flex items-center justify-center gap-2 font-medium text-sm tracking-wide"
            >
              Proceed to Checkout
              <ArrowRight size={16} />
            </Link>
            <button
              onClick={closeCart}
              className="w-full mt-3 py-3 text-sm text-charcoal-500 hover:text-charcoal-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
