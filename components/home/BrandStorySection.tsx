import { Shield, Droplets, RefreshCw, Gem } from 'lucide-react';

const FEATURES = [
  { icon: Gem,       title: 'Premium 316L Steel',  desc: 'The same grade used in medical and marine industries. Built to last generations.' },
  { icon: Droplets,  title: 'Water Resistant',      desc: 'Swim, shower, sweat — your jewelry stays flawless.' },
  { icon: Shield,    title: 'Tarnish-Free',         desc: 'No discoloration, no fading. Forever brilliant.' },
  { icon: RefreshCw, title: '30-Day Returns',       desc: "Not in love? We'll take it back, no questions asked." },
];

export default function BrandStorySection() {
  return (
    <section className="py-16 sm:py-24 bg-charcoal-900 overflow-hidden relative">
      {/* Decorative */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-gold-500/5 blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-gold-500/5 blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Text block */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-2xs tracking-[0.3em] uppercase text-gold-400 mb-3 font-body">Why SteelLuxe</p>
          <h2 className="font-display text-4xl sm:text-5xl text-cream-50 font-light mb-5 leading-snug">
            Jewelry That Tells <br /><em className="text-gold-300">Your Story</em>
          </h2>
          <p className="text-charcoal-400 font-body leading-relaxed">
            Every piece is crafted from premium 316L surgical stainless steel — the same material trusted in medical and marine environments. Because you deserve jewelry as resilient as you are.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="group p-6 rounded-2xl border border-charcoal-700 hover:border-gold-500/40 transition-all duration-300 hover:bg-charcoal-800">
              <div className="w-11 h-11 rounded-xl bg-charcoal-800 group-hover:bg-gold-500/10 border border-charcoal-700 group-hover:border-gold-500/30 flex items-center justify-center mb-4 transition-all duration-300">
                <Icon size={20} className="text-gold-400" />
              </div>
              <h3 className="font-display text-lg text-cream-100 mb-2 font-normal">{title}</h3>
              <p className="text-sm text-charcoal-400 font-body leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Quote / editorial block */}
        <div className="mt-16 text-center">
          <p className="font-display text-2xl sm:text-3xl text-cream-200 font-light italic max-w-xl mx-auto leading-relaxed">
            "Designed for the woman who values elegance without compromise."
          </p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="w-12 h-px bg-gold-500/50" />
            <span className="text-gold-400 text-xs tracking-widest uppercase font-body">SteelLuxe</span>
            <div className="w-12 h-px bg-gold-500/50" />
          </div>
        </div>
      </div>
    </section>
  );
}
