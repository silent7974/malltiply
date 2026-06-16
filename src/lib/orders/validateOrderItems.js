import Product from "@/models/product";

function findVariant(product, item) {
  if (!Array.isArray(product.variantColumns)) return null;

  if (item.sku) {
    const sku = String(item.sku).trim();
    const variantBySku = product.variantColumns.find(
      (variant) => String(variant.sku || "").trim() === sku
    );
    if (variantBySku) return variantBySku;
  }

  return product.variantColumns.find(
    (variant) =>
      (!item.color || variant.color === item.color) &&
      (!item.size || variant.size === item.size)
  );
}

export async function validateOrderItems(items = []) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Order must include at least one item");
  }

  const normalizedItems = [];

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      throw new Error("One of the products in your cart is no longer available");
    }

    const variant = findVariant(product, item);
    const availableStock = variant?.quantity ?? product.quantity ?? 0;
    const requestedQuantity = Number(item.quantity || 0);

    if (requestedQuantity <= 0) {
      throw new Error("Cart item quantity must be greater than zero");
    }

    if (requestedQuantity > availableStock) {
      throw new Error(
        `${product.productName} has only ${availableStock} item(s) available`
      );
    }

    const price = Number(variant?.price ?? product.price ?? item.price ?? 0);
    const discountedPrice = Number(
      product.discountedPrice ?? item.discountedPrice ?? price
    );

    normalizedItems.push({
      productId: product._id,
      name: product.productName,
      image: product.images?.[0]?.url || item.image || "",
      color: item.color,
      size: item.size,
      quantity: requestedQuantity,
      price,
      discountedPrice,
      sku: variant?.sku || product.sku || item.sku,
    });
  }

  const itemsTotal = normalizedItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const discountTotal = normalizedItems.reduce(
    (sum, item) => sum + item.quantity * (item.price - item.discountedPrice),
    0
  );

  return { normalizedItems, itemsTotal, discountTotal };
}
