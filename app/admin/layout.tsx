'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LayoutDashboard, Package, ShoppingBag, Users, Tag, Settings, LogOut, ChevronRight, TrendingUp } from 'lucide-react';
import { useAuthStore } from '@/store';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

const NAV = [
  { label: 'Dashboard', href: '/admin',          icon: LayoutDashboard },
  { label: 'Products',  href: '/admin/products',  icon: Package         },
  { label: 'Orders',    href: '/admin/orders',    icon: ShoppingBag     },
  { label: 'Users',     href: '/admin/users',     icon: Users           },
  { label: 'Coupons',   href: '/admin/coupons',   icon: Tag             },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthStore();
  const { logout }       = useAuth();
  const router           = useRouter();
  const pathname         = usePathname();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="flex min-h-screen bg-charcoal-50">
      {/* Sidebar */}
      <aside className="w-60 bg-charcoal-900 text-cream-100 flex flex-col shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div className="px-6 py-6 border-b border-charcoal-700">
          <span className="font-display text-xl font-light tracking-[0.1em] text-cream-50">
            STEEL<span className="text-gradient-gold">LUXE</span>
          </span>
          <p className="text-2xs text-charcoal-400 tracking-widest uppercase mt-0.5 font-body">Admin Panel</p>
        </div>

        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-1">
            {NAV.map(({ label, href, icon: Icon }) => {
              const active = pathname === href || (href !== '/admin' && pathname.startsWith(href));
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-body transition-all duration-200',
                      active
                        ? 'bg-gold-500/15 text-gold-300 border border-gold-500/20'
                        : 'text-charcoal-400 hover:text-cream-100 hover:bg-charcoal-800'
                    )}
                  >
                    <Icon size={16} />
                    {label}
                    {active && <ChevronRight size={13} className="ml-auto text-gold-400" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="px-3 py-4 border-t border-charcoal-700">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center text-white text-sm font-display">
              {user.displayName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-cream-100 font-body truncate">{user.displayName}</p>
              <p className="text-2xs text-charcoal-400 font-body">Administrator</p>
            </div>
          </div>
          <button
            onClick={async () => { await logout(); router.push('/'); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-body text-charcoal-400 hover:text-red-400 hover:bg-charcoal-800 transition-all"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
