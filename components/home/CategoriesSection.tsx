import Link from "next/link";

const CATEGORIES = [
  {
    name: "Necklaces",
    slug: "necklaces",
    count: "42 styles",
    img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
    size: "large",
  },
  {
    name: "Earrings",
    slug: "earrings",
    count: "38 styles",
    img: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&q=80",
    size: "small",
  },
  {
    name: "Rings",
    slug: "rings",
    count: "24 styles",
    img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
    size: "small",
  },
  {
    name: "Bracelets",
    slug: "bracelets",
    count: "19 styles",
    img: "https://images.unsplash.com/photos/a-silver-bracelet-with-hearts-and-two-red-stones-mkqraXkMPSE?w=800&q=80",
    size: "wide",
  },
];

export default function CategoriesSection() {
  return (
    <section className="py-16 sm:py-24 bg-cream-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-2xs tracking-[0.3em] uppercase text-gold-500 mb-2 font-body">
            Browse by
          </p>
          <h2 className="font-display text-4xl sm:text-5xl text-charcoal-900 font-light">
            Shop by <em>Category</em>
          </h2>
        </div>

        {/* Desktop editorial grid */}
        <div className="hidden md:grid grid-cols-12 gap-4">
          {/* Necklaces — large */}
          <CategoryCard
            cat={CATEGORIES[0]}
            className="col-span-5 row-span-2"
            tall
          />
          {/* Earrings */}
          <CategoryCard cat={CATEGORIES[1]} className="col-span-4" />
          {/* Rings */}
          <CategoryCard cat={CATEGORIES[2]} className="col-span-3" />
          {/* Bracelets — wide */}
          <CategoryCard cat={CATEGORIES[3]} className="col-span-7" />
        </div>

        {/* Mobile: 2-col grid */}
        <div className="md:hidden grid grid-cols-2 gap-3">
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.slug} cat={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({
  cat,
  className = "",
  tall = false,
}: {
  cat: (typeof CATEGORIES)[0];
  className?: string;
  tall?: boolean;
}) {
  return (
    <Link
      href={`/category/${cat.slug}`}
      className={`group relative overflow-hidden rounded-2xl block ${className} ${tall ? "aspect-[3/4]" : "aspect-[4/3]"}`}
    >
      <img
        src={cat.img}
        alt={cat.name}
        className="absolute inset-0 w-full h-full object-cover product-img"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/70 via-charcoal-900/20 to-transparent" />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gold-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

      {/* Text */}
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
        <h3 className="font-display text-2xl sm:text-3xl text-cream-50 font-light mb-1 group-hover:text-gold-200 transition-colors duration-300">
          {cat.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-cream-300/70 font-body">
            {cat.count}
          </span>
          <span className="text-gold-400 opacity-0 group-hover:opacity-100 transition-all duration-300 text-xs">
            → Shop Now
          </span>
        </div>
      </div>
    </Link>
  );
}
