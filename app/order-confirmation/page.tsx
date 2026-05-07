'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Truck, MapPin, ArrowRight, Home } from 'lucide-react';
import { getOrderById } from '@/lib/db';
import { formatPrice, formatDate } from '@/lib/utils';
import type { Order } from '@/types';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) { setLoading(false); return; }
    getOrderById(orderId)
      .then(setOrder)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-charcoal-400 font-body">Loading your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      {/* Success icon */}
      <div className="relative inline-flex mb-8">
        <div className="w-24 h-24 rounded-full bg-gold-100 flex items-center justify-center animate-fade-in">
          <CheckCircle size={48} className="text-gold-500" strokeWidth={1.5} />
        </div>
        <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
          <span className="text-lg">✓</span>
        </div>
      </div>

      <p className="text-2xs tracking-[0.3em] uppercase text-gold-500 mb-2 font-body animate-fade-up animation-delay-100">Order Confirmed</p>
      <h1 className="font-display text-4xl sm:text-5xl text-charcoal-900 font-light mb-3 animate-fade-up animation-delay-200">
        Thank You!
      </h1>
      <p className="text-charcoal-500 font-body mb-8 animate-fade-up animation-delay-300">
        Your order has been placed successfully. We'll send you a confirmation shortly.
      </p>

      {order ? (
        <div className="bg-white rounded-3xl shadow-card p-6 sm:p-8 text-left mb-8 animate-fade-up animation-delay-400">
          {/* Order number */}
          <div className="flex items-center justify-between mb-5 pb-5 border-b border-cream-200">
            <div>
              <p className="text-xs text-charcoal-400 font-body uppercase tracking-widest">Order Number</p>
              <p className="font-display text-2xl text-charcoal-900 mt-0.5">{order.orderNumber}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium font-body capitalize ${
              order.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
            }`}>
              {order.status}
            </span>
          </div>

          {/* Items */}
          <div className="space-y-3 mb-5">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <img src={item.productImage} alt={item.productName} className="w-12 h-12 rounded-lg object-cover bg-cream-200" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-charcoal-900 font-body truncate">{item.productName}</p>
                  {item.selectedSize && <p className="text-xs text-charcoal-400 font-body">Size: {item.selectedSize}</p>}
                  <p className="text-xs text-charcoal-400 font-body">Qty: {item.quantity}</p>
                </div>
                <span className="text-sm font-medium font-body">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <hr className="divider-gold mb-4" />

          {/* Totals */}
          <div className="space-y-2 mb-5">
            <div className="flex justify-between text-sm font-body">
              <span className="text-charcoal-500">Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm font-body text-green-600">
                <span>Discount</span>
                <span>- {formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-body">
              <span className="text-charcoal-500">Shipping</span>
              <span>{formatPrice(order.shippingCost)}</span>
            </div>
            <div className="flex justify-between font-body font-semibold text-base">
              <span>Total</span>
              <span className="text-gradient-gold font-display text-xl">{formatPrice(order.total)}</span>
            </div>
          </div>

          <hr className="divider-gold mb-4" />

          {/* Address */}
          <div className="flex items-start gap-3">
            <MapPin size={16} className="text-gold-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs uppercase tracking-wider text-charcoal-400 font-body mb-1">Delivering to</p>
              <p className="text-sm text-charcoal-700 font-body">{order.shippingAddress.fullName}</p>
              <p className="text-sm text-charcoal-500 font-body">{order.shippingAddress.addressLine1}</p>
              <p className="text-sm text-charcoal-500 font-body">{order.shippingAddress.city}, {order.shippingAddress.governorate}</p>
              <p className="text-sm text-charcoal-500 font-body">{order.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Payment */}
          <div className="flex items-center gap-3 mt-4 p-3 bg-cream-50 rounded-xl">
            <Package size={16} className="text-gold-500" />
            <div>
              <p className="text-xs text-charcoal-400 font-body">Payment Method</p>
              <p className="text-sm font-medium text-charcoal-800 font-body">
                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card Payment'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-card p-8 mb-8 animate-fade-up animation-delay-400">
          <CheckCircle size={32} className="text-green-400 mx-auto mb-4" />
          <p className="font-body text-charcoal-600">Your order has been received and is being processed.</p>
        </div>
      )}

      {/* What's next */}
      <div className="grid grid-cols-3 gap-4 mb-10 animate-fade-up animation-delay-500">
        {[
          { icon: CheckCircle, label: 'Order Confirmed',  status: 'done'    },
          { icon: Package,     label: 'Being Prepared',   status: 'pending' },
          { icon: Truck,       label: 'On The Way',       status: 'pending' },
        ].map(({ icon: Icon, label, status }) => (
          <div key={label} className="flex flex-col items-center gap-2 p-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${status === 'done' ? 'bg-gold-gradient' : 'bg-cream-200'}`}>
              <Icon size={18} className={status === 'done' ? 'text-white' : 'text-charcoal-300'} />
            </div>
            <p className="text-xs text-charcoal-500 font-body text-center leading-tight">{label}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-up animation-delay-600">
        <Link href="/account/orders" className="btn-gold px-8 py-4 rounded-full font-body font-medium text-sm tracking-wide flex items-center justify-center gap-2">
          Track My Order <ArrowRight size={16} />
        </Link>
        <Link href="/" className="px-8 py-4 rounded-full border border-cream-300 text-charcoal-700 hover:border-gold-400 hover:text-gold-500 transition-all font-body font-medium text-sm tracking-wide flex items-center justify-center gap-2">
          <Home size={16} /> Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-24"><div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" /></div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
