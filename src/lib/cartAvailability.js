// lib/cartAvailability.js
//
// Single source of truth for "how many of THIS exact product/color/size
// combination are actually in stock right now". Used by every cart route
// so the number a user sees is always computed live from the product,
// never a frozen snapshot stored somewhere else.
//
// The matching logic intentionally mirrors the `mergedVariants` /
// `activeVariant` logic in product/[slug]/page.jsx, so the backend and
// frontend can never disagree about which variant a color/size refers to.

function normalize(val) {
  return val ? String(val).toLowerCase() : null;
}

export function getAvailableQuantity(product, { color, size } = {}) {
  if (!product) return 0;

  // Base variant: product.variants is a single object (not an array) on
  // your schema. Wrap it so it can be merged with variantColumns the same
  // way the product page does. Filter out an empty/unset variants object
  // (e.g. {color: undefined, size: undefined, measurement: undefined}),
  // since that shouldn't count as "a variant" at all.
  const rawVariants = product.variants;
  const baseVariants = (
    Array.isArray(rawVariants)
      ? rawVariants
      : rawVariants && typeof rawVariants === "object"
      ? [rawVariants]
      : []
  )
    .filter((v) => v && (v.color || v.size || v.measurement || v.memory || v.ram))
    .map((v) => ({ ...v, quantity: v.quantity ?? product.quantity }));

  const extraVariants = Array.isArray(product.variantColumns) ? product.variantColumns : [];
  const mergedVariants = [...baseVariants, ...extraVariants];

  // No variants at all — simple product, its own `quantity` is the truth.
  if (mergedVariants.length === 0) {
    return product.quantity ?? 0;
  }

  const match = mergedVariants.find((v) => {
    const colorMatches = !v.color || !color ? true : normalize(v.color) === normalize(color);

    const variantSizeValue = v.size ?? v.measurement ?? v.memory ?? v.ram ?? null;
    const sizeMatches =
      !variantSizeValue || !size ? true : normalize(variantSizeValue) === normalize(size);

    return colorMatches && sizeMatches;
  });

  // Fail safe to 0 rather than pretending unlimited stock is available if
  // we genuinely can't find the variant being asked about.
  return match ? match.quantity ?? product.quantity ?? 0 : 0;
}