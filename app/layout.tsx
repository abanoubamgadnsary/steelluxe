import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import SearchModal from '@/components/layout/SearchModal';
import AuthProvider from '@/components/layout/AuthProvider';

export const metadata: Metadata = {
  title: {
    default: 'SteelLuxe — Premium Stainless Steel Jewelry',
    template: '%s | SteelLuxe',
  },
  description:
    'Discover premium stainless steel jewelry — necklaces, earrings, rings & bracelets. Tarnish-free, water-resistant, made to last forever.',
  keywords: ['stainless steel jewelry', 'necklaces', 'earrings', 'rings', 'bracelets', 'Egypt jewelry', 'مجوهرات'],
  openGraph: {
    type: 'website',
    siteName: 'SteelLuxe',
    title: 'SteelLuxe — Premium Stainless Steel Jewelry',
    description: 'Premium stainless steel jewelry. Tarnish-free, water-resistant, made to last.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://steelluxe.com'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-cream-50 text-charcoal-700 font-body antialiased">
        <AuthProvider>
          {/* Global UI */}
          <Navbar />
          <CartDrawer />
          <SearchModal />

          {/* Page content */}
          <main className="min-h-screen">{children}</main>

          <Footer />

          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1C1A17',
                color: '#FAF5EB',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.875rem',
                border: '1px solid rgba(212,175,108,0.2)',
                borderRadius: '8px',
              },
              success: { iconTheme: { primary: '#D4AF6C', secondary: '#1C1A17' } },
              error: { iconTheme: { primary: '#ef4444', secondary: 'white' } },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
