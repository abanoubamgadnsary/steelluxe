import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const {
      orderNumber,
      customerName,
      customerPhone,
      customerEmail,
      total,
      items,
    } = await req.json();

    const itemsList = items
      .map(
        (item: any) =>
          `• ${item.productName} x${item.quantity} — ${item.price * item.quantity} EGP`,
      )
      .join("\n");

    await resend.emails.send({
      from: "SteelLuxe Orders <onboarding@resend.dev>",
      to: process.env.ADMIN_NOTIFICATION_EMAIL!,
      subject: `🛍️ New Order: ${orderNumber}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #B8860B;">New Order Received! 🎉</h2>
          <p><strong>Order Number:</strong> ${orderNumber}</p>
          <p><strong>Customer:</strong> ${customerName}</p>
          <p><strong>Phone:</strong> ${customerPhone}</p>
          <p><strong>Email:</strong> ${customerEmail}</p>
          <hr />
          <h3>Items:</h3>
          <pre style="background: #f5f5f5; padding: 12px; border-radius: 8px;">${itemsList}</pre>
          <hr />
          <p style="font-size: 18px;"><strong>Total: ${total} EGP</strong></p>
          <p style="margin-top: 24px;">
            <a href="https://steelluxe.vercel.app/admin/orders"
               style="background: #B8860B; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none;">
              View Order in Dashboard
            </a>
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to send notification email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }
}
