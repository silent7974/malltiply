import Order from "@/models/order";
import Product from "@/models/product";
import User from "@/models/user";
import { sendOrderConfirmation } from "@/lib/email/sendOrderConfirmation";

function trimSku(sku) {
  return String(sku || "").trim();
}

function updateSkuQuantity(sku, quantity) {
  const parts = trimSku(sku).split("-");
  if (parts.length < 2) return sku;
  parts[parts.length - 1] = String(quantity).padStart(2, "0");
  return parts.join("-");
}

async function saveWithRetry(product, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      await product.save();
      return;
    } catch (err) {
      if (err.name === "VersionError" && attempt < maxRetries - 1) {
        // Refetch the latest version and re-apply changes
        const fresh = await Product.findById(product._id);
        if (!fresh) return;

        // Re-apply the modified fields from our failed save
        const modifiedPaths = product.modifiedPaths();
        for (const path of modifiedPaths) {
          fresh.set(path, product.get(path));
        }

        product = fresh;
        continue;
      }
      throw err;
    }
  }
}

export async function settlePaidOrder(orderId) {
  if (!orderId) {
    throw new Error("Order ID is required");
  }

  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error("Order not found");
  }

  if (order.paymentStatus === "paid") {
    return order;
  }

  for (const item of order.items) {
    const { productId, sku, quantity } = item;
    const product = await Product.findById(productId);
    if (!product) continue;

    const itemSku = trimSku(sku);
    const baseSku = trimSku(product.sku);

    if (itemSku && baseSku === itemSku) {
      const nextQuantity = Math.max((product.quantity || 0) - quantity, 0);
      product.quantity = nextQuantity;
      product.sku = updateSkuQuantity(product.sku, nextQuantity);
    }

    const variant = product.variantColumns?.find(
      (variantColumn) => trimSku(variantColumn.sku) === itemSku
    );

    if (variant) {
      const nextQuantity = Math.max((variant.quantity || 0) - quantity, 0);
      variant.quantity = nextQuantity;
      variant.sku = updateSkuQuantity(variant.sku, nextQuantity);
      product.markModified("variantColumns");
    }

    await saveWithRetry(product);  // use retry wrapper
  }

  order.paymentStatus = "paid";

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
      }
    } catch (emailErr) {
      console.error("Order confirmation email failed:", emailErr);
    }
  }

  await order.save();
  return order;
}