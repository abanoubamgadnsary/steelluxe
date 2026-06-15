"use client";

import Link from "next/link";
import {
  Instagram,
  Facebook,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-charcoal-900 text-charcoal-200">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <span className="font-display text-3xl font-light tracking-[0.12em] text-cream-50">
                STEEL<span className="text-gradient-gold">LUXE</span>
              </span>
              <p className="text-2xs tracking-[0.25em] text-charcoal-400 uppercase mt-0.5">
                Fine Steel Jewelry
              </p>
            </div>
            <p className="text-sm text-charcoal-400 leading-relaxed mb-6 font-body">
              Premium 316L stainless steel jewelry crafted for the modern woman.
              Tarnish-free, water-resistant, made to last forever.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Twitter, href: "#", label: "Twitter" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-charcoal-700 flex items-center justify-center text-charcoal-400 hover:border-gold-400 hover:text-gold-400 transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-display text-lg font-normal text-cream-100 mb-5 tracking-wide">
              Shop
            </h3>
            <ul className="space-y-3">
              {[
                { label: "New In", href: "/products?filter=new" },
                { label: "Necklaces", href: "/category/necklaces" },
                { label: "Earrings", href: "/category/earrings" },
                { label: "Rings", href: "/category/rings" },
                { label: "Bracelets", href: "/category/bracelets" },
                { label: "Sale", href: "/products?filter=sale" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-charcoal-400 hover:text-gold-300 transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-display text-lg font-normal text-cream-100 mb-5 tracking-wide">
              Help
            </h3>
            <ul className="space-y-3">
              {[
                { label: "FAQ", href: "/faq" },
                { label: "Shipping Info", href: "/shipping" },
                { label: "Returns Policy", href: "/returns" },
                { label: "Size Guide", href: "/size-guide" },
                { label: "Contact Us", href: "/contact" },
                { label: "Privacy Policy", href: "/privacy" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-charcoal-400 hover:text-gold-300 transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-lg font-normal text-cream-100 mb-5 tracking-wide">
              Contact
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-charcoal-400">
                <Mail size={16} className="mt-0.5 text-gold-400 shrink-0" />
                <a
                  href="mailto:hello@steelluxe.com"
                  className="hover:text-gold-300 transition-colors"
                >
                  hello@steelluxe.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-charcoal-400">
                <Phone size={16} className="mt-0.5 text-gold-400 shrink-0" />
                <a
                  href="tel:+201234567890"
                  className="hover:text-gold-300 transition-colors"
                >
                  +20 123 456 7890
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-charcoal-400">
                <MapPin size={16} className="mt-0.5 text-gold-400 shrink-0" />
                <span>Cairo, Egypt 🇪🇬</span>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-xs text-charcoal-400 mb-3 tracking-wide">
                SUBSCRIBE FOR UPDATES
              </p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 min-w-0 bg-charcoal-800 border border-charcoal-700 rounded px-3 py-2 text-sm text-cream-100 placeholder:text-charcoal-500 focus:border-gold-400 focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  className="btn-gold px-3 py-2 rounded text-sm font-medium whitespace-nowrap"
                >
                  →
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <hr className="divider-gold opacity-20" />

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-charcoal-500">
            © {year} SteelLuxe. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-charcoal-500 text-xs font-body">
              <span>💳 Visa</span>
              <span>💳 Mastercard</span>
              <span>💵 COD</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-charcoal-500">
              <span>🔒</span>
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
