# 💎 SteelLuxe — Premium Stainless Steel Jewelry E-Commerce

A full-stack, production-ready e-commerce web application for selling premium 316L stainless steel jewelry, built with Next.js 14, Firebase, Zustand, Stripe, and Tailwind CSS.

---

## ✨ Features

### 🛍️ Customer Features
- 🔐 Email/Password + Google OAuth authentication
- 🛒 Cart with quantity control, size selection, persistent across sessions
- ❤️ Wishlist with local + Firestore sync
- 🏷️ Coupon / discount code system
- 💳 Checkout with COD + Stripe card payment
- 📦 Order history with status tracking
- 👤 Account profile page
- 🔍 Search with recent & trending suggestions
- 📱 Fully mobile-responsive

### 🏪 Product System
- 4 categories: Necklaces, Earrings, Rings, Bracelets
- Product details: images, description, material, sizes, stock
- Image gallery with thumbnail navigation
- Related products section
- Real-time stock tracking
- Discount badge system

### 🏠 Homepage
- Auto-sliding cinematic hero section
- "New In" products section
- "Best Sellers" section
- Editorial category grid
- Customer reviews carousel
- Brand story / features section
- Animated marquee announcement bar

### ⚙️ Admin Dashboard
- `/admin` — Stats overview (revenue, orders, users, products)
- `/admin/products` — Add / Edit / Delete products + image upload
- `/admin/orders` — View & update order status with split panel
- `/admin/users` — View all registered users

### 🎨 UI/UX
- Cormorant Garamond serif + DM Sans body fonts
- Cream / Gold / Charcoal premium palette
- Framer-ready CSS animations (fade, slide, float, shimmer)
- Glass morphism navbar on scroll
- Skeleton loading states
- React Hot Toast notifications

---

## 🗂️ Project Structure

```
steelluxe/
├── app/
│   ├── layout.tsx                # Root layout + providers
│   ├── page.tsx                  # Homepage
│   ├── globals.css               # Global styles + CSS variables
│   ├── auth/
│   │   ├── login/page.tsx        # Login page
│   │   └── register/page.tsx     # Register page
│   ├── products/
│   │   ├── page.tsx              # Products listing + filters
│   │   └── [id]/page.tsx         # Product detail page
│   ├── category/
│   │   └── [slug]/page.tsx       # Category page
│   ├── cart/page.tsx             # Cart page
│   ├── wishlist/page.tsx         # Wishlist page
│   ├── checkout/page.tsx         # Checkout page
│   ├── order-confirmation/page.tsx
│   ├── account/page.tsx          # User account + orders
│   ├── admin/
│   │   ├── layout.tsx            # Admin sidebar layout
│   │   ├── page.tsx              # Dashboard
│   │   ├── products/page.tsx     # Product management
│   │   ├── orders/page.tsx       # Order management
│   │   └── users/page.tsx        # User management
│   └── api/
│       ├── create-payment-intent/route.ts
│       └── webhooks/stripe/route.ts
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── SearchModal.tsx
│   │   └── AuthProvider.tsx
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   └── ProductGrid.tsx
│   ├── cart/
│   │   └── CartDrawer.tsx
│   └── home/
│       ├── HeroSection.tsx
│       ├── MarqueeBar.tsx
│       ├── NewArrivalsSection.tsx
│       ├── BestSellersSection.tsx
│       ├── CategoriesSection.tsx
│       ├── BrandStorySection.tsx
│       └── ReviewsSection.tsx
├── hooks/
│   └── useAuth.ts
├── lib/
│   ├── firebase.ts               # Firebase init
│   ├── db.ts                     # Firestore service layer
│   └── utils.ts                  # Helpers + demo data
├── store/
│   └── index.ts                  # Zustand stores (cart, wishlist, auth, ui)
├── types/
│   └── index.ts                  # TypeScript types
├── scripts/
│   └── seed.js                   # Firestore seed script
├── firestore.rules
├── firestore.indexes.json
├── storage.rules
├── firebase.json
├── vercel.json
├── tailwind.config.js
└── .env.local.example
```

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install

```bash
git clone https://github.com/yourname/steelluxe.git
cd steelluxe
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (e.g. `steelluxe`)
3. Enable **Authentication** → Sign-in methods → Email/Password + Google
4. Enable **Firestore Database** (start in production mode)
5. Enable **Storage**
6. Go to **Project Settings → General → Your apps** → Add web app
7. Copy the config values

### 3. Environment Variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Seed Demo Data (Optional)

```bash
# Download service account from Firebase Console → Project Settings → Service accounts
# Save as service-account.json in project root (git-ignored)
node scripts/seed.js
```

### 5. Run Development Server

```bash
npm run dev
# Open http://localhost:3000
```

### 6. Create Admin User

After registering, manually update your user's role in Firestore:

```
Firestore → users → {your-uid} → role: "admin"
```

Then visit `/admin` to access the dashboard.

---

## 💳 Stripe Setup

### Test Mode

Use [Stripe test cards](https://stripe.com/docs/testing):
- ✅ Success: `4242 4242 4242 4242`
- ❌ Decline: `4000 0000 0000 0002`

### Webhook (Local Testing)

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Copy the webhook secret shown → paste into .env.local as STRIPE_WEBHOOK_SECRET
```

---

## 🌍 Deployment

### Option A: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel Dashboard:
# Settings → Environment Variables → add all from .env.local
```

Or connect your GitHub repo to [vercel.com](https://vercel.com) for automatic deployments.

### Option B: Firebase Hosting

```bash
# Install Firebase CLI
npm i -g firebase-tools

# Login
firebase login

# Build
npm run build

# Deploy
firebase deploy --only hosting
```

---

## 🔧 Customisation Guide

### Changing Colors

Edit `tailwind.config.js` → `theme.extend.colors`:

```js
gold: {
  500: '#YOUR_GOLD_COLOR',   // Primary gold
},
charcoal: {
  900: '#YOUR_DARK_COLOR',   // Dark background
},
```

### Adding Product Sizes

For necklaces (length):
```ts
sizes: [
  { label: '16in', inStock: true },
  { label: '18in', inStock: true },
  { label: '20in', inStock: false },
]
```

### Shipping Rates

Edit `lib/utils.ts` → `EGYPT_GOVERNORATES` array to adjust costs per governorate.

### Free Shipping Threshold

Search for `1500` in the codebase and update to your desired amount.

### Coupon Codes

Via Admin → Coupons, or directly in Firestore `coupons` collection:

```json
{
  "code": "SUMMER25",
  "type": "percentage",
  "value": 25,
  "minOrderAmount": 500,
  "maxUses": 200,
  "usedCount": 0,
  "isActive": true
}
```

---

## 🌐 Arabic (RTL) Support

The app is prepared for Arabic. To activate:

1. Add `dir="rtl"` to the `<html>` tag in `app/layout.tsx`
2. Add Cairo font for Arabic text in `globals.css`
3. Use the `i18next` package (already in dependencies) for translations

Example translation file at `public/locales/ar/common.json`:
```json
{
  "nav.home": "الرئيسية",
  "nav.shop": "تسوق",
  "cart.empty": "سلة التسوق فارغة"
}
```

---

## 📊 Analytics

To add Google Analytics:

```bash
npm install @next/third-parties
```

In `app/layout.tsx`:
```tsx
import { GoogleAnalytics } from '@next/third-parties/google';
// Add inside <body>:
<GoogleAnalytics gaId="G-XXXXXXXXXX" />
```

---

## 🔒 Security Checklist

- [x] Firestore security rules protect user data
- [x] Storage rules restrict image uploads to admins
- [x] Admin routes check `role === 'admin'` server-side
- [x] Environment variables never exposed to client (except `NEXT_PUBLIC_*`)
- [x] Stripe webhooks verified with signature
- [x] Input validation with Zod schemas on all forms
- [ ] Rate limiting on API routes (add with `@upstash/ratelimit`)
- [ ] CAPTCHA on auth forms (add reCAPTCHA v3)

---

## 📦 Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Framework   | Next.js 14 (App Router)             |
| Language    | TypeScript                          |
| Styling     | Tailwind CSS + Custom CSS Variables |
| Auth        | Firebase Authentication             |
| Database    | Firebase Firestore                  |
| Storage     | Firebase Storage                    |
| State       | Zustand (persist middleware)        |
| Forms       | React Hook Form + Zod               |
| Payments    | Stripe (+ COD option)               |
| Animations  | CSS Animations + Framer Motion ready|
| Hosting     | Vercel / Firebase Hosting           |
| Fonts       | Cormorant Garamond + DM Sans        |

---

## 📞 Support

Built by a senior full-stack developer for the Egyptian market. For customisation, Arabic localisation, or additional features, reach out at hello@steelluxe.com.

---

*Made with ♡ for the modern Egyptian woman.*
