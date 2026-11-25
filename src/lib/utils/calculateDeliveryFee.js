// src/lib/utils/calculateDeliveryFee.js
//
// Turns the real Bolt quotes in lib/data/deliveryQuotes.js into the delivery
// price a buyer pays. Same function name and inputs as before, so the
// checkout does not need to change.
//
// Rule: price = the HIGHEST Bolt quote for that place + 5%, rounded UP to the
// next 100 naira. Bolt moves a little from hour to hour; the 5% and the
// rounding are what stop Malltiply from losing money when it does.

import { DELIVERY_AREA_DATA, DELIVERY_GROUPS } from "@/lib/data/deliveryQuotes";

// Free delivery: the Malltiply Originals items in the order must add up to at
// least this amount. See computeDelivery() below.
export const FREE_DELIVERY_THRESHOLD = 36000;

const BUFFER_PERCENT = 5;

// Whole-number maths on purpose: 6000 * 1.05 in decimals can come out as
// 6300.000000000001 and round up to 6400 by mistake.
function feeFromQuotes(quotes) {
  const used = quotes.filter((q) => !q.ignore).map((q) => q.fee);
  if (used.length === 0) return null;
  const highest = Math.max(...used);
  return Math.ceil((highest * (100 + BUFFER_PERCENT)) / 10000) * 100;
}

// Every place with its price attached, in the order the buyer sees them
export const DELIVERY_AREAS = DELIVERY_AREA_DATA
  .map((area) => ({ ...area, fee: feeFromQuotes(area.quotes) }))
  .filter((area) => area.fee !== null);

export { DELIVERY_GROUPS };

// "My place is not on the list": priced at the top of the card, so Malltiply
// never loses on an unknown far place. The buyer can also WhatsApp for a quote.
export const OTHER_AREA_FEE = Math.max(...DELIVERY_AREAS.map((a) => a.fee));
export const OTHER_AREA = { id: "other", label: "Other area in Abuja", fee: OTHER_AREA_FEE };

const same = (a, b) =>
  String(a ?? "").trim().toLowerCase() === String(b ?? "").trim().toLowerCase();

/**
 * Delivery price for one place.
 * - exact place name (what the area picker saves)  -> that place's price
 * - an OLD saved district such as "Apo"            -> the most expensive place in it (safe)
 * - anything else                                  -> OTHER_AREA_FEE
 */
export function getAreaFee(name) {
  const exact = DELIVERY_AREAS.find((a) => same(a.label, name) || same(a.id, name));
  if (exact) return exact.fee;

  const inDistrict = DELIVERY_AREAS.filter((a) => same(a.district, name));
  if (inDistrict.length > 0) return Math.max(...inDistrict.map((a) => a.fee));

  return OTHER_AREA_FEE;
}

/**
 * Decides the delivery price for an order. The SERVER runs this and its answer
 * is the one that counts. The browser only shows what the server says.
 *
 * Free delivery: when the Malltiply Originals items in the order add up to at
 * least FREE_DELIVERY_THRESHOLD. Other sellers' items in the same order do not
 * block it (and do not count toward it). Everyone else pays their area's price.
 *
 * reason: "originals-free" | "below-threshold" | "no-originals"
 */
export function computeDelivery({ originalsTotal = 0, area }) {
  const areaFee = getAreaFee(area);

  if (originalsTotal >= FREE_DELIVERY_THRESHOLD) {
    return { fee: 0, free: true, reason: "originals-free", areaFee };
  }
  return {
    fee: areaFee,
    free: false,
    reason: originalsTotal > 0 ? "below-threshold" : "no-originals",
    areaFee,
  };
}

// Old name, kept so nothing breaks. It NEVER gives free delivery, because it
// cannot know who the sellers are. Use computeDelivery() instead.
export function calculateDeliveryFee(_orderTotal, area) {
  return getAreaFee(area);
}