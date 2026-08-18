// lib/utils/calculateDeliveryFee.js
//
// Distance-based flat-rate delivery fee for Abuja.
// Origin: Brains & Hammers City, Life Camp (hardcoded for now).
// Zones are calibrated to approximate real Bolt courier rates for
// these distances. Tune the numbers once real dispatch data exists.
//
// Free delivery threshold: orders totalling ₦20,000 or above.

const FREE_DELIVERY_THRESHOLD = 20000;

// District → zone mapping from Life Camp origin.
// Zone 0 = same area (free regardless of order total)
// Zone 1-4 = increasing distance bands
const DISTRICT_ZONES = {
  // Zone 1 — same district or immediate neighbours
  "Life Camp":    1,
  "Kado":         1,
  "Jabi":         1,
  "Kubwa":        1,
  "Lokogoma":     1,

  // Zone 2 — mid Abuja
  "Wuse":         2,
  "Utako":        2,
  "Mabushi":      2,
  "Gwarinpa":     2,
  "Jahi":         2,
  "Karu":         2,

  // Zone 3 — further central/south
  "Maitama":      3,
  "Garki":        3,
  "Asokoro":      3,
  "Apo":          3,
  "Durumi":       3,
  "Lugbe":        3,
  "Galadimawa":   3,

  // Zone 4 — outer zones
  "Nyanya":       4,
  "Mpape":        4,
  "Lokogoma":     4,
};

const ZONE_FEES = {
  1: 1500,  // Life Camp neighbours — Kado, Jabi, Kubwa
  2: 2000,  // mid Abuja — Wuse, Utako, Gwarinpa
  3: 2500,  // further — Maitama, Garki, Asokoro, Lugbe
  4: 3000,  // outer — Nyanya, Mpape, Galadimawa
};

const DEFAULT_FEE = 3500; // any district not in the map yet

/**
 * Returns the delivery fee in Naira.
 * @param {number} orderTotal   - cart.totalPrice
 * @param {string} district     - buyer's district from shippingAddress
 */
export function calculateDeliveryFee(orderTotal, district) {
  // Free delivery for orders at or above threshold
  if (orderTotal >= FREE_DELIVERY_THRESHOLD) return 0;

  const zone = DISTRICT_ZONES[district];
  if (!zone) return DEFAULT_FEE;

  return ZONE_FEES[zone];
}

export { FREE_DELIVERY_THRESHOLD };