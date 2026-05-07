export default function MarqueeBar() {
  const items = [
    '✦ FREE SHIPPING ON ORDERS OVER 1,500 EGP',
    '✦ 100% 316L STAINLESS STEEL',
    '✦ TARNISH-FREE GUARANTEE',
    '✦ WATER RESISTANT',
    '✦ 30-DAY FREE RETURNS',
    '✦ SECURE CHECKOUT',
  ];

  return (
    <div className="bg-charcoal-800 py-3 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="text-gold-300 text-2xs tracking-[0.2em] mx-6 font-body">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
