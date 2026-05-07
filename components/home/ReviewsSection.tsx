'use client';
import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const REVIEWS = [
  { name: 'Sara M.',     location: 'Cairo',        rating: 5, text: "I bought the celestial necklace and I haven't taken it off since. It's been through gym sessions, swimming, everything — still looks brand new. Absolutely obsessed!",       product: 'Celestial Chain Necklace', avatar: 'S' },
  { name: 'Nour A.',     location: 'Alexandria',   rating: 5, text: 'The pearl drop earrings are exactly as described — elegant, lightweight, and the quality is exceptional for the price. Will definitely be ordering more.',              product: 'Pearl Drop Earrings',       avatar: 'N' },
  { name: 'Dina K.',     location: 'Giza',         rating: 5, text: "Finally found a bracelet that doesn't turn my wrist green! The herringbone bracelet is stunning and the shipping was super fast. 10/10 recommend.",                    product: 'Herringbone Bracelet',      avatar: 'D' },
  { name: 'Rana T.',     location: 'Port Said',    rating: 4, text: 'Love the ring, it fits perfectly and the twisted design is so unique. Took a few days extra to arrive but totally worth the wait.',                                     product: 'Twisted Band Ring',         avatar: 'R' },
  { name: 'Amira H.',    location: 'Luxor',        rating: 5, text: "The hoop earring set is incredible value. Three pairs that mix and match beautifully. I get compliments every day. SteelLuxe has become my go-to for jewelry.",         product: 'Hoop Earrings Set',         avatar: 'A' },
];

export default function ReviewsSection() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent(c => (c - 1 + REVIEWS.length) % REVIEWS.length);
  const next = () => setCurrent(c => (c + 1) % REVIEWS.length);

  const review = REVIEWS[current];

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-cream-100 overflow-hidden relative">
      <div className="absolute inset-0 bg-radial-gold pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <p className="text-2xs tracking-[0.3em] uppercase text-gold-500 mb-2 font-body">Real Customers</p>
          <h2 className="font-display text-4xl sm:text-5xl text-charcoal-900 font-light">
            What They <em>Say</em>
          </h2>
          <div className="flex items-center justify-center gap-1 mt-4">
            {Array(5).fill(0).map((_, i) => <Star key={i} size={16} className="fill-gold-400 text-gold-400" />)}
            <span className="ml-2 text-sm text-charcoal-500 font-body">4.9 / 5 — 500+ reviews</span>
          </div>
        </div>

        {/* Main review card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-card relative">
          <Quote size={48} className="text-gold-200 absolute top-6 left-8" strokeWidth={1} />

          <div className="relative z-10">
            {/* Stars */}
            <div className="flex gap-1 mb-6">
              {Array(review.rating).fill(0).map((_, i) => (
                <Star key={i} size={18} className="fill-gold-400 text-gold-400" />
              ))}
            </div>

            {/* Review text */}
            <blockquote className="font-display text-xl sm:text-2xl text-charcoal-700 font-light leading-relaxed mb-8 italic">
              "{review.text}"
            </blockquote>

            {/* Author */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gold-gradient flex items-center justify-center text-white font-display text-lg">
                {review.avatar}
              </div>
              <div>
                <p className="font-medium text-charcoal-900 font-body">{review.name}</p>
                <p className="text-xs text-charcoal-400 font-body">{review.location} · Verified purchase</p>
              </div>
              <div className="ml-auto">
                <p className="text-xs text-gold-500 font-body">{review.product}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={prev}
            className="p-3 rounded-full border border-charcoal-200 hover:border-gold-400 hover:text-gold-500 transition-all text-charcoal-600"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex gap-2">
            {REVIEWS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`transition-all duration-300 rounded-full ${i === current ? 'w-6 h-2 bg-gold-500' : 'w-2 h-2 bg-charcoal-200 hover:bg-gold-300'}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="p-3 rounded-full border border-charcoal-200 hover:border-gold-400 hover:text-gold-500 transition-all text-charcoal-600"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
