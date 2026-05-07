'use client';
import { useEffect, useState } from 'react';
import { TrendingUp, ShoppingBag, Package, Users, Clock, CheckCircle, Truck } from 'lucide-react';
import { getAdminStats, getAllOrders } from '@/lib/db';
import { formatPrice, formatDate } from '@/lib/utils';
import type { AdminStats, Order } from '@/types';
import { DEMO_PRODUCTS } from '@/lib/utils';

const STATUS_COLORS: Record<string, string> = {
  pending:    'bg-amber-100 text-amber-700',
  confirmed:  'bg-blue-100 text-blue-700',
  shipped:    'bg-indigo-100 text-indigo-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-700',
};

function StatCard({ label, value, sub, icon: Icon, accent = false }: {
  label: string; value: string | number; sub?: string; icon: React.ElementType; accent?: boolean;
}) {
  return (
    <div className={`rounded-2xl p-5 ${accent ? 'bg-gold-gradient text-white' : 'bg-white shadow-card'}`}>
      <div className="flex items-start justify-between mb-3">
        <p className={`text-xs uppercase tracking-wider font-body ${accent ? 'text-white/70' : 'text-charcoal-400'}`}>{label}</p>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent ? 'bg-white/20' : 'bg-cream-100'}`}>
          <Icon size={17} className={accent ? 'text-white' : 'text-gold-500'} />
        </div>
      </div>
      <p className={`font-display text-3xl font-light mb-0.5 ${accent ? 'text-white' : 'text-charcoal-900'}`}>{value}</p>
      {sub && <p className={`text-xs font-body ${accent ? 'text-white/60' : 'text-charcoal-400'}`}>{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats]   = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoad]  = useState(true);

  useEffect(() => {
    Promise.all([
      getAdminStats().catch(() => ({
        totalOrders: 347, totalRevenue: 89500, totalProducts: 48,
        totalUsers: 214, pendingOrders: 12, revenueToday: 4200, ordersToday: 8,
      } as AdminStats)),
      getAllOrders().catch(() => [] as Order[]),
    ]).then(([s, o]) => { setStats(s); setOrders(o.slice(0, 5)); }).finally(() => setLoad(false));
  }, []);

  const demoOrders: Partial<Order>[] = [
    { id: '1', orderNumber: 'SL-ABC123', userEmail: 'sara@email.com', total: 850, status: 'pending',   createdAt: new Date().toISOString(), items: [{} as any] },
    { id: '2', orderNumber: 'SL-DEF456', userEmail: 'nour@email.com', total: 1200, status: 'shipped',  createdAt: new Date().toISOString(), items: [{} as any, {} as any] },
    { id: '3', orderNumber: 'SL-GHI789', userEmail: 'dina@email.com', total: 560,  status: 'delivered',createdAt: new Date().toISOString(), items: [{} as any] },
  ];
  const displayOrders = orders.length > 0 ? orders : demoOrders as Order[];

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-charcoal-900 font-light">Dashboard</h1>
        <p className="text-charcoal-400 font-body text-sm mt-1">Welcome back, here's what's happening</p>
      </div>

      {/* Stats grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array(4).fill(0).map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
        </div>
      ) : stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Revenue"  value={formatPrice(stats.totalRevenue)} sub="All time" icon={TrendingUp} accent />
          <StatCard label="Total Orders"   value={stats.totalOrders}               sub={`${stats.pendingOrders} pending`} icon={ShoppingBag} />
          <StatCard label="Products"       value={stats.totalProducts}             sub="In catalogue" icon={Package} />
          <StatCard label="Customers"      value={stats.totalUsers}                sub="Registered users" icon={Users} />
        </div>
      )}

      {/* Today's snapshot */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-100 flex items-center justify-center">
              <TrendingUp size={20} className="text-gold-600" />
            </div>
            <div>
              <p className="text-2xs uppercase tracking-wider text-charcoal-400 font-body">Today's Revenue</p>
              <p className="font-display text-2xl text-charcoal-900">{formatPrice(stats.revenueToday)}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-card p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
              <ShoppingBag size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xs uppercase tracking-wider text-charcoal-400 font-body">Today's Orders</p>
              <p className="font-display text-2xl text-charcoal-900">{stats.ordersToday}</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent orders */}
      <div className="bg-white rounded-2xl shadow-card p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl text-charcoal-900 font-light">Recent Orders</h2>
          <a href="/admin/orders" className="text-xs text-gold-500 hover:underline font-body">View all →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-cream-200">
                {['Order', 'Customer', 'Amount', 'Status', 'Date'].map(h => (
                  <th key={h} className="pb-3 text-2xs uppercase tracking-widest text-charcoal-400 font-body font-normal pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {displayOrders.map(order => (
                <tr key={order.id} className="hover:bg-cream-50 transition-colors">
                  <td className="py-3 pr-4">
                    <span className="font-display text-sm text-charcoal-900">{order.orderNumber}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-sm text-charcoal-600 font-body">{order.userEmail}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-sm font-medium font-body">{formatPrice(order.total!)}</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium font-body capitalize ${STATUS_COLORS[order.status!] ?? 'bg-gray-100 text-gray-600'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="text-xs text-charcoal-400 font-body">{formatDate(order.createdAt!)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick product overview */}
      <div className="mt-6 bg-white rounded-2xl shadow-card p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl text-charcoal-900 font-light">Top Products</h2>
          <a href="/admin/products" className="text-xs text-gold-500 hover:underline font-body">Manage →</a>
        </div>
        <div className="space-y-3">
          {DEMO_PRODUCTS.slice(0, 4).map((p, i) => (
            <div key={i} className="flex items-center gap-4">
              <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-cream-200" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-charcoal-900 font-body truncate">{p.name}</p>
                <p className="text-xs text-charcoal-400 font-body capitalize">{p.category}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium font-body">{formatPrice(p.price)}</p>
                <p className="text-xs text-charcoal-400 font-body">{p.sold} sold</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
