import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ShippingZone } from "@/types";

// ─── Tailwind class merge ─────────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Currency ────────────────────────────────────────────────────────────────
export function formatPrice(amount: number, currency = "EGP"): string {
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPriceAr(amount: number): string {
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(amount);
}

// ─── Slug ────────────────────────────────────────────────────────────────────
export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ─── Order number ─────────────────────────────────────────────────────────────
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SL-${timestamp}-${random}`;
}

// ─── Egypt governorates & shipping ───────────────────────────────────────────
export const EGYPT_GOVERNORATES: ShippingZone[] = [
  { governorate: "Cairo", cost: 60, estimatedDays: "1-2" },
  { governorate: "Giza", cost: 60, estimatedDays: "1-2" },
  { governorate: "Alexandria", cost: 70, estimatedDays: "2-3" },
  { governorate: "Qalyubia", cost: 60, estimatedDays: "1-2" },
  { governorate: "Sharqia", cost: 75, estimatedDays: "2-3" },
  { governorate: "Dakahlia", cost: 75, estimatedDays: "2-3" },
  { governorate: "Beheira", cost: 75, estimatedDays: "2-3" },
  { governorate: "Gharbia", cost: 75, estimatedDays: "2-3" },
  { governorate: "Monufia", cost: 75, estimatedDays: "2-3" },
  { governorate: "Kafr El Sheikh", cost: 80, estimatedDays: "2-3" },
  { governorate: "Damietta", cost: 80, estimatedDays: "2-3" },
  { governorate: "Port Said", cost: 80, estimatedDays: "2-3" },
  { governorate: "Ismailia", cost: 75, estimatedDays: "2-3" },
  { governorate: "Suez", cost: 80, estimatedDays: "2-3" },
  { governorate: "Sinai (North)", cost: 100, estimatedDays: "3-5" },
  { governorate: "Sinai (South)", cost: 100, estimatedDays: "3-5" },
  { governorate: "Red Sea", cost: 90, estimatedDays: "3-4" },
  { governorate: "Matrouh", cost: 100, estimatedDays: "3-5" },
  { governorate: "Luxor", cost: 90, estimatedDays: "3-4" },
  { governorate: "Aswan", cost: 100, estimatedDays: "4-5" },
  { governorate: "Sohag", cost: 90, estimatedDays: "3-4" },
  { governorate: "Qena", cost: 90, estimatedDays: "3-4" },
  { governorate: "Assiut", cost: 85, estimatedDays: "3-4" },
  { governorate: "Minya", cost: 80, estimatedDays: "2-3" },
  { governorate: "Beni Suef", cost: 75, estimatedDays: "2-3" },
  { governorate: "Fayoum", cost: 75, estimatedDays: "2-3" },
  { governorate: "New Valley", cost: 120, estimatedDays: "5-7" },
];

export function getShippingCost(governorate: string): number {
  return (
    EGYPT_GOVERNORATES.find((g) => g.governorate === governorate)?.cost ?? 80
  );
}

export function getDeliveryEstimate(governorate: string): string {
  return (
    EGYPT_GOVERNORATES.find((g) => g.governorate === governorate)
      ?.estimatedDays ?? "3-5"
  );
}

// ─── Discount calculation ─────────────────────────────────────────────────────
export function calculateDiscount(price: number, discount: number): number {
  return Math.round(price * (1 - discount / 100));
}

export function getDiscountAmount(
  type: "percentage" | "fixed",
  value: number,
  total: number,
): number {
  return type === "percentage"
    ? Math.round((total * value) / 100)
    : Math.min(value, total);
}

// ─── Date ─────────────────────────────────────────────────────────────────────
// handles both strings AND Firestore Timestamps
export function formatDate(dateInput: string | any): string {
  try {
    let date: Date;

    // Handle Firestore Timestamp object
    if (dateInput && typeof dateInput === "object" && dateInput.toDate) {
      date = dateInput.toDate(); // Firestore Timestamp has toDate() method
    }
    // Handle string dates
    else if (typeof dateInput === "string") {
      date = new Date(dateInput);
    }
    // Handle regular Date objects
    else if (dateInput instanceof Date) {
      date = dateInput;
    }
    // Invalid input
    else {
      return "Invalid date";
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    return new Intl.DateTimeFormat("en-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  } catch {
    return "Invalid date";
  }
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// ─── WhatsApp Link ──────────────────────────────────────────────────────
export function generateWhatsAppLink(
  phone: string,
  orderNumber: string,
  total: number,
): string {
  // تنظيف رقم التليفون
  let cleanPhone = phone.replace(/\D/g, "");
  if (cleanPhone.startsWith("0")) {
    cleanPhone = "2" + cleanPhone; // 01012345678 → 201012345678
  }

  const message = `مرحباً! 🎉

تم استلام طلبك بنجاح من SteelLuxe ✨

رقم الطلب: ${orderNumber}
الإجمالي: ${total} جنيه

لتأكيد الطلب، نحتاج إلى دفع مقدم (Deposit 50%) من إجمالي المبلغ.

برجاء الرد على هذه الرسالة لمعرفة طريقة الدفع المتاحة 💳

شكراً لثقتك بنا! 💎`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

// ─── Demo product seed data ───────────────────────────────────────────────────
export const DEMO_PRODUCTS = [
  {
    name: "Celestial Chain Necklace",
    slug: "celestial-chain-necklace",
    price: 450,
    comparePrice: 600,
    category: "necklaces",
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800",
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800",
    ],
    description:
      "Delicate stainless steel chain with a celestial star pendant. Water-resistant and tarnish-free.",
    shortDescription: "Celestial star pendant necklace",
    material: "316L Stainless Steel",
    tags: ["necklace", "star", "celestial"],
    stock: 50,
    sold: 120,
    rating: 4.8,
    reviewCount: 45,
    isNew: true,
    isBestSeller: true,
    isFeatured: true,
    discount: 25,
  },
  {
    name: "Pearl Drop Earrings",
    slug: "pearl-drop-earrings",
    price: 280,
    category: "earrings",
    images: [
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800",
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800",
    ],
    description:
      "Elegant pearl drop earrings set in polished stainless steel. Perfect for every occasion.",
    shortDescription: "Elegant pearl drop earrings",
    material: "316L Stainless Steel + Synthetic Pearl",
    tags: ["earrings", "pearl", "elegant"],
    stock: 35,
    sold: 89,
    rating: 4.9,
    reviewCount: 32,
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
  },
  {
    name: "Twisted Band Ring",
    slug: "twisted-band-ring",
    price: 320,
    category: "rings",
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800",
    ],
    description:
      "A beautifully twisted stainless steel band ring. Available in multiple sizes.",
    shortDescription: "Twisted steel band ring",
    material: "316L Stainless Steel",
    sizes: [
      { label: "5", inStock: true },
      { label: "6", inStock: true },
      { label: "7", inStock: true },
      { label: "8", inStock: false },
      { label: "9", inStock: true },
    ],
    tags: ["ring", "band", "minimal"],
    stock: 40,
    sold: 67,
    rating: 4.7,
    reviewCount: 28,
    isNew: true,
    isBestSeller: false,
    isFeatured: true,
  },
  {
    name: "Herringbone Bracelet",
    slug: "herringbone-bracelet",
    price: 395,
    comparePrice: 495,
    category: "bracelets",
    images: [
      "https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=800",
    ],
    description:
      "Classic herringbone-pattern stainless steel bracelet. Bold yet refined.",
    shortDescription: "Herringbone chain bracelet",
    material: "316L Stainless Steel",
    tags: ["bracelet", "herringbone", "bold"],
    stock: 25,
    sold: 145,
    rating: 4.9,
    reviewCount: 61,
    isNew: false,
    isBestSeller: true,
    isFeatured: false,
    discount: 20,
  },
  {
    name: "Layered Moon Necklace",
    slug: "layered-moon-necklace",
    price: 520,
    category: "necklaces",
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800",
    ],
    description:
      "Multi-layer necklace set featuring crescent moon and star pendants.",
    shortDescription: "Multi-layer moon necklace set",
    material: "316L Stainless Steel",
    tags: ["necklace", "moon", "layered", "set"],
    stock: 20,
    sold: 78,
    rating: 4.6,
    reviewCount: 22,
    isNew: true,
    isBestSeller: false,
    isFeatured: true,
  },
  {
    name: "Hoop Earrings Set",
    slug: "hoop-earrings-set",
    price: 240,
    category: "earrings",
    images: [
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800",
    ],
    description:
      "Set of 3 graduated hoop earrings. Mix and match for the perfect look.",
    shortDescription: "Set of 3 hoop earrings",
    material: "316L Stainless Steel",
    tags: ["earrings", "hoops", "set"],
    stock: 60,
    sold: 203,
    rating: 4.8,
    reviewCount: 87,
    isNew: false,
    isBestSeller: true,
    isFeatured: false,
  },
  {
    name: "Signet Ring",
    slug: "signet-ring",
    price: 380,
    category: "rings",
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800",
    ],
    description:
      "Classic flat-top signet ring in brushed stainless steel. Timeless design.",
    shortDescription: "Classic brushed signet ring",
    material: "316L Stainless Steel",
    sizes: [
      { label: "6", inStock: true },
      { label: "7", inStock: true },
      { label: "8", inStock: true },
      { label: "9", inStock: true },
    ],
    tags: ["ring", "signet", "classic"],
    stock: 30,
    sold: 55,
    rating: 4.5,
    reviewCount: 19,
    isNew: false,
    isBestSeller: false,
    isFeatured: false,
  },
  {
    name: "Snake Chain Bracelet",
    slug: "snake-chain-bracelet",
    price: 350,
    comparePrice: 420,
    category: "bracelets",
    images: [
      "https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=800",
    ],
    description: "Sleek snake chain bracelet with a delicate lobster clasp.",
    shortDescription: "Sleek snake chain bracelet",
    material: "316L Stainless Steel",
    tags: ["bracelet", "snake", "chain"],
    stock: 45,
    sold: 92,
    rating: 4.7,
    reviewCount: 38,
    isNew: true,
    isBestSeller: false,
    isFeatured: false,
    discount: 16,
  },
];
