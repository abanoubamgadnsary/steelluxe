'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Package, Heart, MapPin, LogOut, ChevronRight, ExternalLink } from 'lucide-react';
import { useAuthStore } from '@/store';
import { useAuth } from '@/hooks/useAuth';
import { getUserOrders } from '@/lib/db';
import { formatPrice, formatDate } from '@/lib/utils';
import type { Order } from '@/types';

const STATUS_COLORS: Record<string, string> = {
  pending:    'bg-amber-100 text-amber-700',
  confirmed:  'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped:    'bg-indigo-100 text-indigo-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-700',
};

export default function AccountPage() {
  const router = useRouter();
  const { user, loading } = useAuthStore();
  const { logout } = useAuth();
  const [orders, setOrders]       = useState<Order[]>([]);
  const [ordersLoading, setOL]    = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'wishlist'>('orders');

  useEffect(() => {
    if (!loading && !user) { router.push('/auth/login'); return; }
    if (user) {
      getUserOrders(user.uid)
        .then(setOrders)
        .catch(console.error)
        .finally(() => setOL(false));
    }
  }, [user, loading, router]);

  const handleLogout = async () => { await logout(); router.push('/'); };

  if (loading) return (
    <div className="flex justify-center py-24">
      <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-2xs tracking-[0.3em] uppercase text-gold-500 mb-1 font-body">My Account</p>
          <h1 className="font-display text-4xl text-charcoal-900 font-light">
            Hello, <em>{user.displayName.split(' ')[0]}</em>
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-charcoal-500 hover:text-red-400 transition-colors font-body"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-cream-100 p-1 rounded-2xl w-fit">
        {([
          { key: 'orders',  label: 'Orders',  icon: Package },
          { key: 'profile', label: 'Profile', icon: User    },
          { key: 'wishlist',label: 'Wishlist',icon: Heart   },
        ] as const).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-body font-medium transition-all ${
              activeTab === key ? 'bg-white shadow-card text-charcoal-900' : 'text-charcoal-500 hover:text-charcoal-700'
            }`}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {/* Orders tab */}
      {activeTab === 'orders' && (
        <div>
          <h2 className="font-display text-2xl text-charcoal-900 font-light mb-5">Order History</h2>
          {ordersLoading ? (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl shadow-card">
              <Package size={40} className="text-charcoal-200 mx-auto mb-4" />
              <p className="font-display text-2xl text-charcoal-400 font-light mb-2">No orders yet</p>
              <p className="text-charcoal-400 text-sm font-body mb-6">Your orders will appear here once you start shopping</p>
              <Link href="/products" className="btn-gold px-6 py-3 rounded-full text-sm font-body font-medium">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map(order => (
                <div key={order.id} className="bg-white rounded-2xl shadow-card p-5 hover:shadow-hover transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-display text-lg text-charcoal-900">{order.orderNumber}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium font-body capitalize ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-700'}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-charcoal-400 font-body">{formatDate(order.createdAt)} · {order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-display text-xl text-charcoal-900">{formatPrice(order.total)}</span>
                      <Link
                        href={`/order-confirmation?id=${order.id}`}
                        className="flex items-center gap-1 text-sm text-gold-500 hover:text-gold-600 transition-colors font-body"
                      >
                        View <ExternalLink size={13} />
                      </Link>
                    </div>
                  </div>
                  {/* Item thumbnails */}
                  <div className="flex gap-2 mt-4">
                    {order.items.slice(0, 4).map((item, i) => (
                      <img key={i} src={item.productImage} alt={item.productName} className="w-12 h-12 rounded-lg object-cover bg-cream-200" />
                    ))}
                    {order.items.length > 4 && (
                      <div className="w-12 h-12 rounded-lg bg-cream-200 flex items-center justify-center text-xs text-charcoal-500 font-body">
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile tab */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl shadow-card p-8">
          <h2 className="font-display text-2xl text-charcoal-900 font-light mb-6">Profile Details</h2>
          <div className="flex items-center gap-5 mb-8">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gold-gradient flex items-center justify-center text-white font-display text-2xl">
              {user.photoURL ? <img src={user.photoURL} alt="" className="w-full h-full object-cover" /> : user.displayName[0]}
            </div>
            <div>
              <p className="font-medium text-charcoal-900 font-body text-lg">{user.displayName}</p>
              <p className="text-charcoal-400 font-body text-sm">{user.email}</p>
              <span className="text-2xs font-body px-2 py-0.5 rounded-full bg-gold-100 text-gold-600 capitalize">{user.role}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Full Name',  value: user.displayName },
              { label: 'Email',      value: user.email       },
              { label: 'Phone',      value: user.phone ?? 'Not set' },
              { label: 'Member Since', value: formatDate(user.createdAt) },
            ].map(({ label, value }) => (
              <div key={label} className="p-4 bg-cream-50 rounded-xl">
                <p className="text-xs uppercase tracking-wider text-charcoal-400 font-body mb-1">{label}</p>
                <p className="text-sm font-medium text-charcoal-800 font-body">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Wishlist tab */}
      {activeTab === 'wishlist' && (
        <div>
          <h2 className="font-display text-2xl text-charcoal-900 font-light mb-5">My Wishlist</h2>
          <div className="text-center py-16 bg-white rounded-3xl shadow-card">
            <Heart size={40} className="text-charcoal-200 mx-auto mb-4" />
            <p className="font-display text-2xl text-charcoal-400 font-light mb-2">Wishlist</p>
            <p className="text-charcoal-400 text-sm font-body mb-6">Items you've saved will appear here</p>
            <Link href="/wishlist" className="btn-gold px-6 py-3 rounded-full text-sm font-body font-medium">
              View My Wishlist
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
