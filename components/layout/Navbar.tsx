'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Search, Heart, User, Menu, X, ChevronDown } from 'lucide-react';
import { useCartStore, useUIStore, useAuthStore } from '@/store';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'New In',     href: '/products?filter=new' },
  { label: 'Necklaces',  href: '/category/necklaces'  },
  { label: 'Earrings',   href: '/category/earrings'   },
  { label: 'Rings',      href: '/category/rings'      },
  { label: 'Bracelets',  href: '/category/bracelets'  },
  { label: 'Sale',       href: '/products?filter=sale', accent: true },
];

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const pathname = usePathname();
  const itemCount  = useCartStore(s => s.itemCount());
  const { openCart, openSearch } = useUIStore();
  const { user }  = useAuthStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const isHome = pathname === '/';

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-charcoal-900 text-gold-300 text-center py-2 px-4 text-xs tracking-widest uppercase font-body overflow-hidden">
        <div className="flex items-center justify-center gap-8 animate-marquee whitespace-nowrap">
          {Array(3).fill('✦ Free shipping on orders over 1,500 EGP  ✦  100% Stainless Steel  ✦  Water resistant  ✦  30-day returns').map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </div>

      {/* Main navbar */}
      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-400',
          scrolled
            ? 'glass shadow-soft border-b border-gold-100/40'
            : 'bg-cream-50/95 backdrop-blur-sm'
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 text-charcoal-700 hover:text-gold-500 transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex-1 lg:flex-none flex justify-center lg:justify-start items-center group">
              <div className="flex flex-col items-center lg:items-start">
                <span className="font-display text-2xl lg:text-3xl font-light tracking-[0.12em] text-charcoal-900 group-hover:text-gold-500 transition-colors duration-300">
                  STEEL<span className="text-gradient-gold">LUXE</span>
                </span>
                <span className="text-2xs tracking-[0.25em] text-charcoal-400 uppercase hidden lg:block -mt-1">
                  Fine Steel Jewelry
                </span>
              </div>
            </Link>

            {/* Desktop nav links */}
            <ul className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      'text-xs tracking-widest uppercase font-medium transition-all duration-200 relative group',
                      link.accent ? 'text-gold-500' : 'text-charcoal-600 hover:text-charcoal-900',
                      pathname === link.href && 'text-charcoal-900'
                    )}
                  >
                    {link.label}
                    <span className={cn(
                      'absolute -bottom-1 left-0 h-px bg-gold-400 transition-all duration-300',
                      pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                    )} />
                  </Link>
                </li>
              ))}
            </ul>

            {/* Actions */}
            <div className="flex items-center gap-1 lg:gap-2">
              <button
                onClick={openSearch}
                className="p-2 text-charcoal-600 hover:text-charcoal-900 transition-colors rounded-full hover:bg-cream-200"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              <Link
                href="/wishlist"
                className="p-2 text-charcoal-600 hover:text-charcoal-900 transition-colors rounded-full hover:bg-cream-200"
                aria-label="Wishlist"
              >
                <Heart size={20} />
              </Link>

              <Link
                href={user ? '/account' : '/auth/login'}
                className="p-2 text-charcoal-600 hover:text-charcoal-900 transition-colors rounded-full hover:bg-cream-200"
                aria-label="Account"
              >
                {user?.photoURL
                  ? <img src={user.photoURL} alt="" className="w-5 h-5 rounded-full object-cover" />
                  : <User size={20} />
                }
              </Link>

              <button
                onClick={openCart}
                className="relative p-2 text-charcoal-600 hover:text-charcoal-900 transition-colors rounded-full hover:bg-cream-200"
                aria-label="Cart"
              >
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold-500 text-white text-2xs flex items-center justify-center rounded-full font-medium animate-pulse-gold">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile menu */}
        <div className={cn(
          'lg:hidden overflow-hidden transition-all duration-300 ease-luxury',
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}>
          <div className="border-t border-gold-100 bg-cream-50 px-4 py-4 space-y-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block px-3 py-3 text-sm tracking-wider uppercase font-medium transition-colors rounded-lg',
                  link.accent ? 'text-gold-500' : 'text-charcoal-700 hover:text-charcoal-900 hover:bg-cream-200',
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-gold-100 mt-2">
              <Link href={user ? '/account' : '/auth/login'} className="block px-3 py-3 text-sm text-charcoal-700 hover:text-charcoal-900 hover:bg-cream-200 rounded-lg transition-colors">
                {user ? `My Account (${user.displayName})` : 'Login / Register'}
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
