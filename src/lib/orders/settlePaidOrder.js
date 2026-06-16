import Order from "@/models/order";
import Product from "@/models/product";

function trimSku(sku) {
  return String(sku || "").trim();
}

function updateSkuQuantity(sku, quantity) {
  const parts = trimSku(sku).split("-");
  if (parts.length < 2) return sku;
  parts[parts.length - 1] = String(quantity).padStart(2, "0");
  return parts.join("-");
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

    await product.save();
  }

  order.paymentStatus = "paid";
  await order.save();

  return order;
}
