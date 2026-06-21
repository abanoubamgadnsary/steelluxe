"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Truck,
  ChevronDown,
  Lock,
  CheckCircle,
} from "lucide-react";
import { useCartStore, useAuthStore } from "@/store";
import {
  formatPrice,
  EGYPT_GOVERNORATES,
  generateOrderNumber,
} from "@/lib/utils";
import { createOrder } from "@/lib/db";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const schema = z.object({
  fullName: z.string().min(2, "Full name required"),
  phone: z.string().min(10, "Valid phone number required").max(15),
  addressLine1: z.string().min(5, "Address required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City required"),
  governorate: z.string().min(2, "Governorate required"),
  notes: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

type PaymentMethod = "cod" | "card";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    subtotal,
    total,
    discountAmount,
    couponCode,
    shippingGovernorate,
    setGovernorate,
    clearCart,
  } = useCartStore();
  const { user } = useAuthStore();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [placing, setPlacing] = useState(false);
  const [step, setStep] = useState<"address" | "payment" | "review">("address");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: user?.displayName ?? "",
      phone: user?.phone ?? "",
      governorate: shippingGovernorate,
    },
  });

  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items.length, router]);

  const watchedGov = watch("governorate");
  const sub = subtotal();
  const ship =
    EGYPT_GOVERNORATES.find((g) => g.governorate === watchedGov)?.cost ?? 70;
  const disc = discountAmount;
  const tot = Math.max(0, sub + (sub >= 1500 ? 0 : ship) - disc);

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast.error("Please log in to place an order");
      router.push("/auth/login");
      return;
    }
    setPlacing(true);
    try {
      const orderItems = items.map((i) => ({
        productId: i.productId,
        productName: i.product.name,
        productImage: i.product.images[0],
        price: i.product.discount
          ? Math.round(i.product.price * (1 - i.product.discount / 100))
          : i.product.price,
        quantity: i.quantity,
        // ✅ استخدم null بدل undefined
        selectedSize: i.selectedSize || undefined,
      }));

      const orderId = await createOrder({
        orderNumber: generateOrderNumber(),
        userId: user.uid,
        userEmail: user.email,
        items: orderItems,
        shippingAddress: {
          fullName: data.fullName,
          phone: data.phone,
          addressLine1: data.addressLine1,
          // ✅ استخدم null بدل undefined
          addressLine2: data.addressLine2 || undefined,
          city: data.city,
          governorate: data.governorate,
        },
        status: "pending",
        paymentMethod,
        paymentStatus: "pending",
        subtotal: sub,
        discount: disc,
        shippingCost: sub >= 1500 ? 0 : ship,
        total: tot,
        // ✅ استخدم null بدل undefined
        couponCode: couponCode || undefined,
        notes: data.notes || undefined,
      });

      clearCart();
      router.push(`/order-confirmation?id=${orderId}`);
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-4xl sm:text-5xl text-charcoal-900 font-light mb-2">
        Checkout
      </h1>
      <p className="text-charcoal-400 font-body text-sm mb-8 flex items-center gap-1.5">
        <Lock size={13} className="text-gold-500" /> Secure & encrypted checkout
      </p>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {(["address", "payment", "review"] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <button
              onClick={() =>
                i < ["address", "payment", "review"].indexOf(step) + 1 &&
                setStep(s)
              }
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium font-body transition-all",
                step === s
                  ? "bg-charcoal-900 text-cream-50"
                  : i < ["address", "payment", "review"].indexOf(step)
                    ? "bg-gold-500 text-white"
                    : "bg-cream-200 text-charcoal-400",
              )}
            >
              {i < ["address", "payment", "review"].indexOf(step) ? (
                <CheckCircle size={14} />
              ) : (
                i + 1
              )}
            </button>
            <span
              className={cn(
                "text-xs capitalize font-body hidden sm:block",
                step === s
                  ? "text-charcoal-900 font-medium"
                  : "text-charcoal-400",
              )}
            >
              {s}
            </span>
            {i < 2 && <div className="w-8 h-px bg-cream-300 mx-1" />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Address */}
            <section className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="font-display text-xl text-charcoal-900 mb-5 font-light flex items-center gap-2">
                <Truck size={18} className="text-gold-500" /> Delivery Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-charcoal-500 font-body mb-1.5">
                    Full Name *
                  </label>
                  <input
                    {...register("fullName")}
                    className="w-full input-luxury rounded-xl px-4 py-3 text-sm font-body"
                    placeholder="Sara Mohamed"
                  />
                  {errors.fullName && (
                    <p className="text-red-400 text-xs mt-1 font-body">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-charcoal-500 font-body mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    {...register("phone")}
                    type="tel"
                    className="w-full input-luxury rounded-xl px-4 py-3 text-sm font-body"
                    placeholder="01012345678"
                  />
                  {errors.phone && (
                    <p className="text-red-400 text-xs mt-1 font-body">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-charcoal-500 font-body mb-1.5">
                    Governorate *
                  </label>
                  <div className="relative">
                    <select
                      {...register("governorate")}
                      onChange={(e) => {
                        setValue("governorate", e.target.value);
                        setGovernorate(e.target.value);
                      }}
                      className="w-full input-luxury rounded-xl px-4 py-3 text-sm font-body appearance-none"
                    >
                      {EGYPT_GOVERNORATES.map((g) => (
                        <option key={g.governorate}>{g.governorate}</option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-400 pointer-events-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-charcoal-500 font-body mb-1.5">
                    City *
                  </label>
                  <input
                    {...register("city")}
                    className="w-full input-luxury rounded-xl px-4 py-3 text-sm font-body"
                    placeholder="Maadi"
                  />
                  {errors.city && (
                    <p className="text-red-400 text-xs mt-1 font-body">
                      {errors.city.message}
                    </p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-charcoal-500 font-body mb-1.5">
                    Street Address *
                  </label>
                  <input
                    {...register("addressLine1")}
                    className="w-full input-luxury rounded-xl px-4 py-3 text-sm font-body"
                    placeholder="123 Tahrir Street, Apartment 4B"
                  />
                  {errors.addressLine1 && (
                    <p className="text-red-400 text-xs mt-1 font-body">
                      {errors.addressLine1.message}
                    </p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-charcoal-500 font-body mb-1.5">
                    Landmark / Additional Info
                  </label>
                  <input
                    {...register("addressLine2")}
                    className="w-full input-luxury rounded-xl px-4 py-3 text-sm font-body"
                    placeholder="Near X, opposite Y..."
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-charcoal-500 font-body mb-1.5">
                    Order Notes (optional)
                  </label>
                  <textarea
                    {...register("notes")}
                    rows={2}
                    className="w-full input-luxury rounded-xl px-4 py-3 text-sm font-body resize-none"
                    placeholder="Any special instructions..."
                  />
                </div>
              </div>
            </section>

            {/* Payment method */}
            <section className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="font-display text-xl text-charcoal-900 mb-5 font-light flex items-center gap-2">
                <CreditCard size={18} className="text-gold-500" /> Payment
                Method
              </h2>
              <div className="space-y-3">
                {[
                  {
                    value: "cod",
                    label: "Cash on Delivery (COD)",
                    desc: "Pay when your order arrives",
                    icon: "💵",
                  },
                  // 🔒 Card payment hidden temporarily - re-enable when Stripe is ready
                  // { value: 'card', label: 'Credit / Debit Card (Online)', desc: 'Visa, Mastercard — via Stripe', icon: '💳' },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
                      paymentMethod === opt.value
                        ? "border-charcoal-900 bg-charcoal-50"
                        : "border-cream-200 hover:border-gold-300",
                    )}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={opt.value}
                      checked={paymentMethod === opt.value}
                      onChange={() =>
                        setPaymentMethod(opt.value as PaymentMethod)
                      }
                      className="sr-only"
                    />
                    <span className="text-2xl">{opt.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-charcoal-900 font-body">
                        {opt.label}
                      </p>
                      <p className="text-xs text-charcoal-400 font-body">
                        {opt.desc}
                      </p>
                    </div>
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                        paymentMethod === opt.value
                          ? "border-charcoal-900"
                          : "border-charcoal-300",
                      )}
                    >
                      {paymentMethod === opt.value && (
                        <div className="w-2.5 h-2.5 rounded-full bg-charcoal-900" />
                      )}
                    </div>
                  </label>
                ))}
              </div>

              {paymentMethod === "card" && (
                <div className="mt-4 p-4 rounded-xl bg-cream-100 border border-gold-100">
                  <p className="text-xs text-charcoal-500 font-body text-center">
                    🔒 You will be redirected to Stripe's secure payment page
                    after placing your order.
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Right: order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-card p-6 sticky top-24">
              <h2 className="font-display text-xl text-charcoal-900 mb-5 font-light">
                Order Summary
              </h2>

              {/* Items */}
              <ul className="space-y-3 mb-5">
                {items.map((item) => {
                  const price = item.product.discount
                    ? Math.round(
                        item.product.price * (1 - item.product.discount / 100),
                      )
                    : item.product.price;
                  return (
                    <li
                      key={`${item.productId}-${item.selectedSize}`}
                      className="flex items-center gap-3"
                    >
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-cream-200 shrink-0">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-charcoal-800 text-cream-50 text-2xs flex items-center justify-center rounded-full">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-charcoal-900 truncate font-body">
                          {item.product.name}
                        </p>
                        {item.selectedSize && (
                          <p className="text-2xs text-charcoal-400 font-body">
                            Size: {item.selectedSize}
                          </p>
                        )}
                      </div>
                      <span className="text-xs font-medium font-body shrink-0">
                        {formatPrice(price * item.quantity)}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <hr className="divider-gold mb-4" />

              <div className="space-y-2 mb-5">
                <div className="flex justify-between text-sm font-body">
                  <span className="text-charcoal-500">Subtotal</span>
                  <span>{formatPrice(sub)}</span>
                </div>
                {disc > 0 && (
                  <div className="flex justify-between text-sm font-body text-green-600">
                    <span>Discount ({couponCode})</span>
                    <span>- {formatPrice(disc)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-body">
                  <span className="text-charcoal-500">Shipping</span>
                  <span
                    className={
                      sub >= 1500 ? "line-through text-charcoal-400" : ""
                    }
                  >
                    {formatPrice(ship)}
                  </span>
                </div>
                {sub >= 1500 && (
                  <div className="text-right text-xs text-green-600 font-body">
                    Free shipping!
                  </div>
                )}
                <hr className="divider-gold" />
                <div className="flex justify-between font-body">
                  <span className="font-semibold">Total</span>
                  <span className="font-display text-xl text-gradient-gold">
                    {formatPrice(tot)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={placing}
                className="btn-gold w-full py-4 rounded-full font-body font-medium text-sm tracking-wide flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {placing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Placing Order...
                  </span>
                ) : (
                  <>
                    <Lock size={14} />
                    Place Order — {formatPrice(tot)}
                  </>
                )}
              </button>

              <p className="text-center text-2xs text-charcoal-400 mt-3 font-body">
                By placing your order you agree to our Terms & Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
