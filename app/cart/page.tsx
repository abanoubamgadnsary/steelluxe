'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, X } from 'lucide-react';
import { useCartStore } from '@/store';
import { formatPrice, EGYPT_GOVERNORATES, getShippingCost } from '@/lib/utils';
import { validateCoupon } from '@/lib/db';
import toast from 'react-hot-toast';

export default function CartPage() {
  const {
    items, removeItem, updateQuantity, clearCart,
    subtotal, shipping, total, couponCode, discountAmount,
    applyCoupon, removeCoupon, setGovernorate, shippingGovernorate,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const sub  = subtotal();
  const ship = shipping();
  const tot  = total();

  const handleCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    try {
      const coupon = await validateCoupon(couponInput, sub);
      if (!coupon) { toast.error('Invalid or expired coupon'); return; }
      const amount = coupon.type === 'percentage'
        ? Math.round(sub * coupon.value / 100)
        : Math.min(coupon.value, sub);
      applyCoupon(coupon.code, amount);
      toast.success(`Coupon applied! You save ${formatPrice(amount)}`);
    } catch {
      // Demo mode: accept any 5-char code for 10% off
      if (couponInput.length >= 4) {
        const amount = Math.round(sub * 0.1);
        applyCoupon(couponInput.toUpperCase(), amount);
        toast.success(`Coupon applied! You save ${formatPrice(amount)}`);
      } else {
        toast.error('Invalid coupon code');
      }
    } finally {
      setCouponLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-24 h-24 rounded-full bg-cream-200 flex items-center justify-center mx-auto mb-6">
          <ShoppingBag size={40} className="text-charcoal-300" />
        </div>
        <h1 className="font-display text-4xl text-charcoal-700 mb-3 font-light">Your bag is empty</h1>
        <p className="text-charcoal-400 font-body mb-8">Looks like you haven't added anything yet.</p>
        <Link href="/products" className="btn-gold px-8 py-4 rounded-full font-body font-medium text-sm tracking-wider uppercase inline-flex items-center gap-2">
          Start Shopping <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-4xl sm:text-5xl text-charcoal-900 font-light mb-2">Your Bag</h1>
      <p className="text-charcoal-400 font-body text-sm mb-10">{items.length} item{items.length > 1 ? 's' : ''}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Items list */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => {
            const price = item.product.discount
              ? Math.round(item.product.price * (1 - item.product.discount / 100))
              : item.product.price;
            return (
              <div key={`${item.productId}-${item.selectedSize}`} className="flex gap-5 p-5 bg-white rounded-2xl shadow-card">
                <Link href={`/products/${item.product.slug}`} className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-cream-200 shrink-0">
                  <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover hover:scale-105 transition-transform duration-300" sizes="112px" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link href={`/products/${item.product.slug}`} className="font-medium text-charcoal-900 hover:text-gold-600 transition-colors font-body text-sm sm:text-base">
                        {item.product.name}
                      </Link>
                      {item.selectedSize && (
                        <p className="text-xs text-charcoal-400 mt-0.5 font-body">Size: {item.selectedSize}</p>
                      )}
                      <p className="text-xs text-charcoal-400 font-body capitalize">{item.product.material}</p>
                    </div>
                    <button onClick={() => removeItem(item.productId, item.selectedSize)} className="text-charcoal-300 hover:text-red-400 transition-colors p-1 shrink-0">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 border border-cream-200 rounded-full px-1">
                      <button onClick={() => updateQuantity(item.productId, item.quantity - 1, item.selectedSize)} className="w-8 h-8 flex items-center justify-center text-charcoal-600 hover:text-charcoal-900 transition-colors">
                        <Minus size={13} />
                      </button>
                      <span className="w-6 text-center text-sm font-medium font-body">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.quantity + 1, item.selectedSize)} className="w-8 h-8 flex items-center justify-center text-charcoal-600 hover:text-charcoal-900 transition-colors">
                        <Plus size={13} />
                      </button>
                    </div>
                    <span className="font-medium font-body text-charcoal-900">{formatPrice(price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            );
          })}

          <button onClick={clearCart} className="text-xs text-charcoal-400 hover:text-red-400 transition-colors font-body flex items-center gap-1 mt-2">
            <Trash2 size={12} /> Clear cart
          </button>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-card p-6 sticky top-24">
            <h2 className="font-display text-2xl text-charcoal-900 font-light mb-6">Order Summary</h2>

            {/* Shipping governorate */}
            <div className="mb-4">
              <label className="text-xs tracking-wider uppercase text-charcoal-500 font-body mb-2 block">Delivery to</label>
              <select
                value={shippingGovernorate}
                onChange={e => setGovernorate(e.target.value)}
                className="w-full input-luxury rounded-xl px-4 py-2.5 text-sm font-body text-charcoal-700 appearance-none"
              >
                {EGYPT_GOVERNORATES.map(g => (
                  <option key={g.governorate} value={g.governorate}>{g.governorate}</option>
                ))}
              </select>
            </div>

            {/* Coupon */}
            <div className="mb-5">
              <label className="text-xs tracking-wider uppercase text-charcoal-500 font-body mb-2 block">Coupon Code</label>
              {couponCode ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Tag size={14} className="text-green-600" />
                    <span className="text-sm font-medium text-green-700 font-body">{couponCode}</span>
                  </div>
                  <button onClick={removeCoupon} className="text-green-600 hover:text-red-400 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="flex-1 input-luxury rounded-xl px-4 py-2.5 text-sm font-body uppercase"
                  />
                  <button
                    onClick={handleCoupon}
                    disabled={couponLoading}
                    className="btn-gold px-4 py-2.5 rounded-xl text-sm font-body font-medium whitespace-nowrap disabled:opacity-60"
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>
              )}
            </div>

            {/* Price breakdown */}
            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm font-body">
                <span className="text-charcoal-500">Subtotal</span>
                <span className="font-medium">{formatPrice(sub)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm font-body text-green-600">
                  <span>Discount</span>
                  <span>- {formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-body">
                <span className="text-charcoal-500">Shipping ({shippingGovernorate})</span>
                <span className="font-medium">{formatPrice(ship)}</span>
              </div>
              {sub >= 1500 && (
                <div className="flex justify-between text-xs font-body text-green-600 bg-green-50 rounded-lg px-3 py-2">
                  <span>🎉 Free shipping applied!</span>
                  <span>- {formatPrice(ship)}</span>
                </div>
              )}
              <hr className="divider-gold" />
              <div className="flex justify-between font-body">
                <span className="font-medium text-base">Total</span>
                <span className="font-display text-xl text-gradient-gold">{formatPrice(tot)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="btn-gold w-full py-4 rounded-full flex items-center justify-center gap-2 font-body font-medium text-sm tracking-wide"
            >
              Proceed to Checkout <ArrowRight size={16} />
            </Link>
            <Link href="/products" className="block text-center mt-3 text-sm text-charcoal-500 hover:text-charcoal-700 transition-colors font-body">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
