/**
 * SteelLuxe — Firestore Seed Script
 * Run: node scripts/seed.js
 * Requires: GOOGLE_APPLICATION_CREDENTIALS env var pointing to your service account JSON
 */

const admin = require('firebase-admin');
const serviceAccount = require('../service-account.json'); // download from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const PRODUCTS = [
  {
    name: 'Celestial Chain Necklace', slug: 'celestial-chain-necklace',
    price: 450, comparePrice: 600, category: 'necklaces',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800',
    ],
    description: 'A delicate stainless steel chain adorned with a celestial star pendant. Crafted from premium 316L surgical steel — water-resistant, tarnish-free, and built to be worn every day.',
    shortDescription: 'Delicate star pendant necklace',
    material: '316L Stainless Steel',
    tags: ['necklace', 'star', 'celestial', 'pendant'],
    stock: 50, sold: 120, rating: 4.8, reviewCount: 45,
    isNew: true, isBestSeller: true, isFeatured: true, discount: 25,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    name: 'Pearl Drop Earrings', slug: 'pearl-drop-earrings',
    price: 280, category: 'earrings',
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800',
      'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800',
    ],
    description: 'Elegant pearl drop earrings set in polished stainless steel. The synthetic pearls are AAA quality and won\'t yellow or lose their lustre.',
    shortDescription: 'Elegant pearl drop earrings',
    material: '316L Stainless Steel + AAA Synthetic Pearl',
    tags: ['earrings', 'pearl', 'elegant', 'drop'],
    stock: 35, sold: 89, rating: 4.9, reviewCount: 32,
    isNew: false, isBestSeller: true, isFeatured: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    name: 'Twisted Band Ring', slug: 'twisted-band-ring',
    price: 320, category: 'rings',
    images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800'],
    description: 'A beautifully twisted stainless steel band that catches the light with every movement. Available in US ring sizes 5–9.',
    shortDescription: 'Twisted steel band ring',
    material: '316L Stainless Steel',
    sizes: [
      { label: '5', inStock: true }, { label: '6', inStock: true },
      { label: '7', inStock: true }, { label: '8', inStock: false },
      { label: '9', inStock: true },
    ],
    tags: ['ring', 'band', 'minimal', 'twisted'],
    stock: 40, sold: 67, rating: 4.7, reviewCount: 28,
    isNew: true, isBestSeller: false, isFeatured: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    name: 'Herringbone Bracelet', slug: 'herringbone-bracelet',
    price: 395, comparePrice: 495, category: 'bracelets',
    images: ['https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=800'],
    description: 'Classic herringbone-pattern bracelet in mirror-polished stainless steel. Bold statement piece that pairs with everything.',
    shortDescription: 'Herringbone chain bracelet',
    material: '316L Stainless Steel',
    tags: ['bracelet', 'herringbone', 'bold', 'chain'],
    stock: 25, sold: 145, rating: 4.9, reviewCount: 61,
    isNew: false, isBestSeller: true, isFeatured: false, discount: 20,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    name: 'Layered Moon Necklace', slug: 'layered-moon-necklace',
    price: 520, category: 'necklaces',
    images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800'],
    description: 'A stunning multi-layer necklace set featuring crescent moon and star pendants on three different chain lengths.',
    shortDescription: 'Multi-layer moon & star necklace',
    material: '316L Stainless Steel',
    tags: ['necklace', 'moon', 'layered', 'set', 'celestial'],
    stock: 20, sold: 78, rating: 4.6, reviewCount: 22,
    isNew: true, isBestSeller: false, isFeatured: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    name: 'Hoop Earrings Set', slug: 'hoop-earrings-set',
    price: 240, category: 'earrings',
    images: ['https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800'],
    description: 'A set of 3 graduated hoop earrings — small, medium, and large. Mix and match for the perfect stacked ear look.',
    shortDescription: 'Set of 3 graduated hoop earrings',
    material: '316L Stainless Steel',
    tags: ['earrings', 'hoops', 'set', 'graduated'],
    stock: 60, sold: 203, rating: 4.8, reviewCount: 87,
    isNew: false, isBestSeller: true, isFeatured: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    name: 'Signet Ring', slug: 'signet-ring',
    price: 380, category: 'rings',
    images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800'],
    description: 'Classic flat-top signet ring in brushed stainless steel. A timeless design that never goes out of style.',
    shortDescription: 'Classic brushed signet ring',
    material: '316L Stainless Steel',
    sizes: [
      { label: '6', inStock: true }, { label: '7', inStock: true },
      { label: '8', inStock: true }, { label: '9', inStock: true },
    ],
    tags: ['ring', 'signet', 'classic', 'brushed'],
    stock: 30, sold: 55, rating: 4.5, reviewCount: 19,
    isNew: false, isBestSeller: false, isFeatured: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    name: 'Snake Chain Bracelet', slug: 'snake-chain-bracelet',
    price: 350, comparePrice: 420, category: 'bracelets',
    images: ['https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=800'],
    description: 'Sleek snake chain bracelet with a polished stainless steel lobster clasp. Elegant and lightweight.',
    shortDescription: 'Sleek snake chain bracelet',
    material: '316L Stainless Steel',
    tags: ['bracelet', 'snake', 'chain', 'sleek'],
    stock: 45, sold: 92, rating: 4.7, reviewCount: 38,
    isNew: true, isBestSeller: false, isFeatured: false, discount: 16,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  },
];

const COUPONS = [
  {
    code: 'WELCOME10', type: 'percentage', value: 10,
    minOrderAmount: 0, maxUses: 1000, usedCount: 0,
    expiresAt: '2025-12-31', isActive: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    code: 'SAVE50', type: 'fixed', value: 50,
    minOrderAmount: 500, maxUses: 500, usedCount: 0,
    expiresAt: '2025-12-31', isActive: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
  {
    code: 'VIP20', type: 'percentage', value: 20,
    minOrderAmount: 800, maxUses: 100, usedCount: 0,
    isActive: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  },
];

async function seed() {
  console.log('🌱 Seeding Firestore...\n');

  // Seed products
  console.log('📦 Adding products...');
  const productBatch = db.batch();
  for (const product of PRODUCTS) {
    const ref = db.collection('products').doc();
    productBatch.set(ref, product);
    console.log(`  ✓ ${product.name}`);
  }
  await productBatch.commit();

  // Seed coupons
  console.log('\n🎟️  Adding coupons...');
  const couponBatch = db.batch();
  for (const coupon of COUPONS) {
    const ref = db.collection('coupons').doc();
    couponBatch.set(ref, coupon);
    console.log(`  ✓ ${coupon.code}`);
  }
  await couponBatch.commit();

  console.log('\n✅ Seeding complete!');
  console.log('   Products:', PRODUCTS.length);
  console.log('   Coupons: ', COUPONS.length);
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
