import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function sendOrderConfirmation({ to, order }) {
  const formatPrice = (n) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(n || 0)

  const itemRows = order.items.map(item => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #eee">${item.name}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.color || "-"} ${item.size ? `/ ${item.size}` : ""}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${formatPrice(item.price)}</td>
    </tr>
  `).join("")

  const html = `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:24px">
      <h2 style="color:#005770">Order Confirmed ✅</h2>
      <p>Hi ${order.shippingAddress?.fullName || order.guestInfo?.fullName || "Customer"},</p>
      <p>Your order <strong>#${String(order._id).slice(-8).toUpperCase()}</strong> has been confirmed and is being processed.</p>

      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <thead>
          <tr style="background:#f8f9fa">
            <th style="padding:8px;text-align:left">Item</th>
            <th style="padding:8px;text-align:center">Variant</th>
            <th style="padding:8px;text-align:center">Qty</th>
            <th style="padding:8px;text-align:right">Price</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>

      <p style="text-align:right;font-size:16px"><strong>Total: ${formatPrice(order.totalAmount)}</strong></p>

      <div style="background:#f0f9ff;padding:16px;border-radius:8px;margin-top:16px">
        <p style="margin:0;font-size:14px;color:#005770">🚚 Delivery within 24 hours across Abuja via GIG</p>
      </div>

      <p style="margin-top:24px;font-size:12px;color:#999">
        Questions? WhatsApp us at +2349065941258<br/>
        Malltiply — Your Abuja Fashion Marketplace
      </p>
    </div>
  `

    await transporter.sendMail({
        from: `"Malltiply" <${process.env.EMAIL_USER}>`,
        to,
        subject: `Order Confirmed #${String(order._id).slice(-8).toUpperCase()} — Malltiply`,
        html,
        text: `
        Order Confirmed ✅

        Hi ${order.shippingAddress?.fullName || order.guestInfo?.fullName || "Customer"},

        Your order #${String(order._id).slice(-8).toUpperCase()} has been confirmed and is being processed.

        Items:
        ${order.items.map(item => `• ${item.name} (${item.color || "N/A"} / ${item.size || "N/A"}) x${item.quantity} — ₦${item.price.toLocaleString()}`).join("\n")}

        Total: ₦${order.totalAmount.toLocaleString()}

        Delivery within 24 hours across Abuja via GIG.

        Questions? WhatsApp us at +2349065941258
        Malltiply - Your Abuja Fashion Marketplace
        To ensure you receive order updates, add malltiplyng@gmail.com to your contacts.
        
        `.trim(),
    });
}