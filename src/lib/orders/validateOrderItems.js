import Product from "@/models/product";
import Seller from "@/models/seller";
import { getVariantImage } from "@/lib/cartAvailability";

// Messages from this error are written for buyers, so API routes can show them as they are
export class OrderValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "OrderValidationError";
  }
}

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
    throw new OrderValidationError("Order must include at least one item");
  }

  const normalizedItems = [];
  const itemSellerIds = []; // same order as normalizedItems

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      throw new OrderValidationError("One of the products in your cart is no longer available");
    }

    itemSellerIds.push(product.sellerId ? String(product.sellerId) : null);

    const variant = findVariant(product, item);
    const availableStock = variant?.quantity ?? product.quantity ?? 0;
    const requestedQuantity = Number(item.quantity || 0);

    if (requestedQuantity <= 0) {
      throw new OrderValidationError("Cart item quantity must be greater than zero");
    }

    if (requestedQuantity > availableStock) {
      throw new OrderValidationError(
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
      // Trust the image already resolved on the cart item (it reflects the
      // color the buyer picked) first; fall back to the product's own photo.
      image: item.image || getVariantImage(product, { color: item.color }),
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

  // How much of this order is Malltiply Originals? The seller account that owns
  // those products has isOriginals: true. Any doubt means "not Originals".
  let originalsTotal = 0;
  const sellerIds = [...new Set(itemSellerIds.filter(Boolean))];
  if (sellerIds.length > 0) {
    const sellers = await Seller.find({ _id: { $in: sellerIds } })
      .select("isOriginals")
      .lean();
    const originalsIds = new Set(
      sellers.filter((s) => s.isOriginals === true).map((s) => String(s._id))
    );
    originalsTotal = normalizedItems.reduce(
      (sum, item, i) =>
        originalsIds.has(itemSellerIds[i]) ? sum + item.quantity * item.price : sum,
      0
    );
  }

  return { normalizedItems, itemsTotal, discountTotal, originalsTotal };
}