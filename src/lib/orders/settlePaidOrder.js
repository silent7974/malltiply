import Order from "@/models/order";
import Product from "@/models/product";
import User from "@/models/user";
import { sendOrderConfirmation } from "@/lib/email/sendOrderConfirmation";

class AmountMismatchError extends Error {
  constructor(message) {
    super(message);
    this.name = "AmountMismatchError";
  }
}

const norm = (v) => String(v ?? "").trim().toLowerCase();
const trimSku = (sku) => String(sku || "").trim();

// "CLA-TER-M-03" -> "CLA-TER-M-02": the last segment of our SKUs is the stock count
function updateSkuQuantity(sku, quantity) {
  const parts = trimSku(sku).split("-");
  if (parts.length < 2) return sku;
  parts[parts.length - 1] = String(quantity).padStart(2, "0");
  return parts.join("-");
}

// The size-like value of a variant: size, or measurement / memory / ram
const sizeOf = (v) => norm(v?.size ?? v?.measurement ?? v?.memory ?? v?.ram);

// Which variant an order line belongs to. Color + size never change, so they
// are the identity. SKU is only a fallback, because the SKU changes after
// every sale (the stock count is part of it).
function findVariantIndex(columns, item) {
  let idx = columns.findIndex(
    (v) => norm(v.color) === norm(item.color) && sizeOf(v) === norm(item.size)
  );
  if (idx < 0 && trimSku(item.sku)) {
    idx = columns.findIndex((v) => trimSku(v.sku) === trimSku(item.sku));
  }
  return idx; // -1 means "the base product itself"
}

async function deductStock(item) {
  const qty = Number(item.quantity) || 0;
  if (qty <= 0) return;

  for (let attempt = 0; attempt < 5; attempt++) {
    const product = await Product.findById(item.productId).lean();
    if (!product) {
      console.error(`SETTLE: product ${item.productId} no longer exists`);
      return;
    }

    const columns = Array.isArray(product.variantColumns) ? product.variantColumns : [];
    const idx = findVariantIndex(columns, item);
    const qtyPath = idx >= 0 ? `variantColumns.${idx}.quantity` : "quantity";
    const skuPath = idx >= 0 ? `variantColumns.${idx}.sku` : "sku";
    const rawQty = idx >= 0 ? columns[idx].quantity : product.quantity;
    const currentSku = idx >= 0 ? columns[idx].sku : product.sku;

    const current = Number(rawQty) || 0;
    const next = Math.max(current - qty, 0);

    const update = { [qtyPath]: next };
    if (trimSku(currentSku)) update[skuPath] = updateSkuQuantity(currentSku, next);

    // "Only if the stock is still what we just read." If two payments land
    // together, they can't both subtract from the same starting number.
    const result = await Product.updateOne(
      { _id: product._id, [qtyPath]: rawQty ?? null },
      { $set: update }
    );

    if (result.matchedCount === 1) {
      if (current < qty) {
        console.error(
          `OVERSOLD: product ${product._id} (${item.color || "-"}/${item.size || "-"}) had ${current}, order wanted ${qty}`
        );
      }
      return;
    }
    // Someone changed the stock between our read and our write: read again.
  }

  throw new Error(`Could not update stock for product ${item.productId}`);
}

// paidKobo (optional): the amount Paystack says was paid. If given, it must
// cover the order total.
export async function settlePaidOrder(orderId, { paidKobo } = {}) {
  if (!orderId) {
    throw new Error("Order ID is required");
  }

  const existing = await Order.findById(orderId);
  if (!existing) {
    throw new Error("Order not found");
  }
  if (existing.paymentStatus === "paid") {
    return existing;
  }

  if (paidKobo !== undefined && paidKobo !== null) {
    const expected = Math.round(Number(existing.totalAmount) * 100);
    if (Number(paidKobo) < expected) {
      console.error(`PAYMENT AMOUNT MISMATCH order=${orderId} paid=${paidKobo} expected=${expected}`);
      throw new AmountMismatchError("Paid amount is less than the order total");
    }
  }

  // Only ONE caller can flip pending -> paid. verify and the webhook usually
  // arrive together; the one that loses this race returns without touching
  // stock or sending a second email.
  const order = await Order.findOneAndUpdate(
    { _id: orderId, paymentStatus: { $ne: "paid" } },
    { $set: { paymentStatus: "paid" } },
    { new: true }
  );
  if (!order) {
    return Order.findById(orderId);
  }

  for (const item of order.items) {
    try {
      await deductStock(item);
    } catch (err) {
      // The order is paid; log loudly so stock can be fixed by hand
      console.error(`STOCK UPDATE FAILED order=${orderId}`, err);
    }
  }

  // Send confirmation email
  if (!order.confirmationEmailSent) {
    try {
      let email = order.guestInfo?.email || null;

      if (!email && order.userId) {
        const user = await User.findById(order.userId).select("email");
        email = user?.email || null;
      }

      if (email) {
        await sendOrderConfirmation({ to: email, order });
        order.confirmationEmailSent = true;
        await order.save();
      }
    } catch (emailErr) {
      console.error("Order confirmation email failed:", emailErr);
    }
  }

  return order;
}