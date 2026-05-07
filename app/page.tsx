import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import NewArrivalsSection from '@/components/home/NewArrivalsSection';
import BestSellersSection from '@/components/home/BestSellersSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import ReviewsSection from '@/components/home/ReviewsSection';
import BrandStorySection from '@/components/home/BrandStorySection';
import MarqueeBar from '@/components/home/MarqueeBar';

export const metadata: Metadata = {
  title: 'SteelLuxe — Premium Stainless Steel Jewelry',
  description: 'Discover premium 316L stainless steel jewelry. Tarnish-free, water-resistant necklaces, earrings, rings & bracelets.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MarqueeBar />
      <NewArrivalsSection />
      <CategoriesSection />
      <BestSellersSection />
      <BrandStorySection />
      <ReviewsSection />
    </>
  );
}
