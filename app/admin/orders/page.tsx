'use client';
import { useState, useEffect } from 'react';
import { Search, ChevronDown, Filter } from 'lucide-react';
import { getAllOrders, updateOrderStatus } from '@/lib/db';
import { formatPrice, formatDate } from '@/lib/utils';
import type { Order, OrderStatus } from '@/types';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const STATUSES: OrderStatus[] = ['pending','confirmed','processing','shipped','delivered','cancelled'];
const STATUS_COLORS: Record<string, string> = {
  pending:    'bg-amber-100 text-amber-700',
  confirmed:  'bg-blue-100  text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped:    'bg-indigo-100 text-indigo-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100   text-red-700',
};

// Demo orders
const DEMO_ORDERS: Order[] = Array.from({ length: 8 }, (_, i) => ({
  id: `order-${i}`, orderNumber: `SL-${(1000 + i).toString(36).toUpperCase()}`,
  userId: `user-${i}`, userEmail: `customer${i + 1}@email.com`,
  items: Array.from({ length: (i % 3) + 1 }, (_, j) => ({
    productId: `p-${j}`, productName: ['Celestial Necklace','Pearl Earrings','Twisted Ring'][j] ?? 'Bracelet',
    productImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100',
    price: 300 + j * 100, quantity: 1,
  })),
  shippingAddress: {
    fullName: `Customer ${i + 1}`, phone: `0101234567${i}`,
    addressLine1: `${i + 1} Example Street`, city: 'Cairo', governorate: 'Cairo',
  },
  status: STATUSES[i % STATUSES.length],
  paymentMethod: i % 2 === 0 ? 'cod' : 'card',
  paymentStatus: i % 3 === 0 ? 'pending' : 'paid',
  subtotal: 600 + i * 150, discount: 0, shippingCost: 60, total: 660 + i * 150,
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  updatedAt: new Date().toISOString(),
}));

export default function AdminOrdersPage() {
  const [orders,      setOrders]      = useState<Order[]>(DEMO_ORDERS);
  const [search,      setSearch]      = useState('');
  const [statusFilter,setStatusFilter]= useState<OrderStatus | 'all'>('all');
  const [selected,    setSelected]    = useState<Order | null>(null);
  const [updating,    setUpdating]    = useState<string | null>(null);

  useEffect(() => {
    getAllOrders().then(o => { if (o.length > 0) setOrders(o); }).catch(() => {});
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdating(orderId);
    try {
      await updateOrderStatus(orderId, newStatus).catch(() => {});
      setOrders(os => os.map(o => o.id === orderId ? { ...o, status: newStatus, updatedAt: new Date().toISOString() } : o));
      if (selected?.id === orderId) setSelected(s => s ? { ...s, status: newStatus } : null);
      toast.success(`Order updated to ${newStatus}`);
    } catch { toast.error('Failed to update order'); }
    finally { setUpdating(null); }
  };

  const filtered = orders.filter(o => {
    const matchSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.userEmail.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-charcoal-900 font-light">Orders</h1>
        <p className="text-charcoal-400 font-body text-sm mt-1">{orders.length} total orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-400" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by order # or email..."
            className="w-full input-luxury rounded-xl pl-11 pr-4 py-3 text-sm font-body"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['all', ...STATUSES] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'px-4 py-2 rounded-full text-xs font-body font-medium capitalize transition-all',
                statusFilter === s ? 'bg-charcoal-900 text-cream-50' : 'bg-cream-200 text-charcoal-600 hover:bg-cream-300'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Orders list */}
        <div className="xl:col-span-2 space-y-3">
          {filtered.map(order => (
            <div
              key={order.id}
              onClick={() => setSelected(order)}
              className={cn(
                'bg-white rounded-2xl shadow-card p-4 cursor-pointer hover:shadow-hover transition-all border-2',
                selected?.id === order.id ? 'border-gold-300' : 'border-transparent'
              )}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-display text-base text-charcoal-900">{order.orderNumber}</p>
                  <p className="text-xs text-charcoal-400 font-body">{order.userEmail}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium font-body text-sm">{formatPrice(order.total)}</p>
                  <p className="text-xs text-charcoal-400 font-body">{formatDate(order.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-body font-medium capitalize ${STATUS_COLORS[order.status]}`}>
                    {order.status}
                  </span>
                  <span className="text-xs text-charcoal-400 font-body">{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                  <span className="text-xs text-charcoal-400 font-body">· {order.paymentMethod.toUpperCase()}</span>
                </div>
                {/* Quick status update */}
                <div className="relative">
                  <select
                    value={order.status}
                    onChange={e => { e.stopPropagation(); handleStatusChange(order.id, e.target.value as OrderStatus); }}
                    onClick={e => e.stopPropagation()}
                    disabled={updating === order.id}
                    className="text-xs border border-cream-200 rounded-lg px-2 py-1 font-body appearance-none pr-5 bg-cream-50 focus:outline-none focus:border-gold-300 disabled:opacity-50"
                  >
                    {STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                  </select>
                  <ChevronDown size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-charcoal-400 pointer-events-none" />
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl shadow-card">
              <p className="font-display text-2xl text-charcoal-400 font-light">No orders found</p>
            </div>
          )}
        </div>

        {/* Order detail panel */}
        <div className="xl:col-span-1">
          {selected ? (
            <div className="bg-white rounded-2xl shadow-card p-5 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-xl text-charcoal-900 font-light">{selected.orderNumber}</h2>
                <span className={`px-2.5 py-1 rounded-full text-xs font-body font-medium capitalize ${STATUS_COLORS[selected.status]}`}>
                  {selected.status}
                </span>
              </div>

              {/* Customer */}
              <div className="mb-4 p-3 bg-cream-50 rounded-xl">
                <p className="text-2xs uppercase tracking-wider text-charcoal-400 font-body mb-1">Customer</p>
                <p className="text-sm font-medium text-charcoal-900 font-body">{selected.shippingAddress.fullName}</p>
                <p className="text-xs text-charcoal-500 font-body">{selected.userEmail}</p>
                <p className="text-xs text-charcoal-500 font-body">{selected.shippingAddress.phone}</p>
              </div>

              {/* Items */}
              <div className="mb-4">
                <p className="text-2xs uppercase tracking-wider text-charcoal-400 font-body mb-2">Items</p>
                <div className="space-y-2">
                  {selected.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <img src={item.productImage} alt={item.productName} className="w-8 h-8 rounded-lg object-cover bg-cream-200" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-charcoal-900 font-body truncate">{item.productName}</p>
                        <p className="text-2xs text-charcoal-400 font-body">x{item.quantity}</p>
                      </div>
                      <span className="text-xs font-body">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Address */}
              <div className="mb-4 p-3 bg-cream-50 rounded-xl">
                <p className="text-2xs uppercase tracking-wider text-charcoal-400 font-body mb-1">Delivery Address</p>
                <p className="text-xs text-charcoal-600 font-body">{selected.shippingAddress.addressLine1}</p>
                <p className="text-xs text-charcoal-600 font-body">{selected.shippingAddress.city}, {selected.shippingAddress.governorate}</p>
              </div>

              {/* Totals */}
              <div className="space-y-1.5 mb-4 pt-3 border-t border-cream-200">
                <div className="flex justify-between text-xs font-body">
                  <span className="text-charcoal-500">Subtotal</span><span>{formatPrice(selected.subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs font-body">
                  <span className="text-charcoal-500">Shipping</span><span>{formatPrice(selected.shippingCost)}</span>
                </div>
                {selected.discount > 0 && (
                  <div className="flex justify-between text-xs font-body text-green-600">
                    <span>Discount</span><span>-{formatPrice(selected.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-body font-semibold text-sm pt-1 border-t border-cream-100">
                  <span>Total</span><span className="text-gradient-gold font-display">{formatPrice(selected.total)}</span>
                </div>
              </div>

              {/* Update status */}
              <div>
                <p className="text-2xs uppercase tracking-wider text-charcoal-400 font-body mb-2">Update Status</p>
                <div className="grid grid-cols-2 gap-2">
                  {STATUSES.map(s => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(selected.id, s)}
                      disabled={selected.status === s || !!updating}
                      className={cn(
                        'py-2 px-3 rounded-xl text-xs font-body font-medium capitalize transition-all',
                        selected.status === s
                          ? 'bg-charcoal-900 text-cream-50'
                          : 'bg-cream-100 text-charcoal-600 hover:bg-cream-200 disabled:opacity-50'
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-card p-8 text-center">
              <p className="text-charcoal-300 font-body text-sm">Click an order to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
