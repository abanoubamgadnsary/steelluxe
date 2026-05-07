'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';

const SLIDES = [
  {
    headline: 'Wear What\nEndures',
    sub: 'Premium 316L Stainless Steel Jewelry',
    cta: 'Discover New Arrivals',
    href: '/products?filter=new',
    bg: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1800&q=90',
    accent: 'Tarnish-free · Water-resistant · Forever yours',
  },
  {
    headline: 'Crafted for\nHer',
    sub: 'Necklaces, Earrings, Rings & Bracelets',
    cta: 'Shop Collections',
    href: '/products',
    bg: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1800&q=90',
    accent: 'New collection — Spring 2024',
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded]   = useState(false);

  useEffect(() => {
    setLoaded(true);
    const interval = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), 6000);
    return () => clearInterval(interval);
  }, []);

  const slide = SLIDES[current];

  return (
    <section className="relative h-[90vh] min-h-[600px] overflow-hidden">
      {/* Background images */}
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <img
            src={s.bg}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Multi-layer gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/80 via-charcoal-900/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 via-transparent to-transparent" />
        </div>
      ))}

      {/* Decorative radial glow */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">

            {/* Eyebrow */}
            <div
              className={`flex items-center gap-3 mb-6 transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              <div className="w-8 h-px bg-gold-400" />
              <span className="text-gold-300 text-xs tracking-[0.3em] uppercase font-body">{slide.accent}</span>
            </div>

            {/* Headline */}
            <h1
              className={`font-display text-6xl sm:text-7xl lg:text-8xl font-light text-cream-50 leading-none mb-6 whitespace-pre-line transition-all duration-700 delay-100 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            >
              {slide.headline}
            </h1>

            {/* Sub */}
            <p
              className={`text-cream-200 text-lg font-body font-light mb-8 max-w-md transition-all duration-700 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            >
              {slide.sub}
            </p>

            {/* CTAs */}
            <div
              className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            >
              <Link
                href={slide.href}
                className="btn-gold px-8 py-4 rounded-full font-body font-medium text-sm tracking-wider uppercase inline-flex items-center gap-2"
              >
                {slide.cta}
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/category/necklaces"
                className="px-8 py-4 rounded-full font-body font-medium text-sm tracking-wider uppercase inline-flex items-center gap-2 border border-cream-200/40 text-cream-200 hover:border-gold-400 hover:text-gold-300 transition-all duration-200"
              >
                View Necklaces
              </Link>
            </div>

            {/* Stats */}
            <div
              className={`flex gap-8 mt-12 pt-8 border-t border-cream-200/20 transition-all duration-700 delay-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            >
              {[
                { value: '5,000+', label: 'Happy Customers' },
                { value: '316L',   label: 'Steel Grade'     },
                { value: '1 Year', label: 'Guarantee'       },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="font-display text-2xl text-gold-300 font-light">{value}</p>
                  <p className="text-xs text-cream-300/60 uppercase tracking-wider mt-1 font-body">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all duration-300 rounded-full ${i === current ? 'w-8 h-2 bg-gold-400' : 'w-2 h-2 bg-cream-200/50 hover:bg-cream-200/80'}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 flex flex-col items-center gap-2 text-cream-200/50 animate-float">
        <span className="text-2xs tracking-widest uppercase rotate-90">Scroll</span>
        <ChevronDown size={16} />
      </div>
    </section>
  );
}
