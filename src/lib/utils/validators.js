// src/lib/utils/validators.js
//
// Shared by the browser (address forms, checkout) AND the server (API routes),
// so each rule is written once and the two sides can never disagree.
// Pure functions only: no imports, no window, no database.

export const FIELD_MESSAGES = {
  fullName: "Enter your full name",
  phone: "Enter a valid phone number, like 0801 234 5678",
  email: "Enter a valid email, like name@gmail.com",
  street: "Enter your street address or a nearby landmark",
  district: "Select your area",
};

// Trim + lowercase. A trailing space (very common after a phone keyboard
// suggestion) is enough for Paystack to reject an email.
export function normalizeEmail(value) {
  return String(value ?? "").trim().toLowerCase();
}

// Deliberately simple: something@something.something, no spaces.
// It only needs to catch the typos that would make payment fail.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(value) {
  return EMAIL_RE.test(normalizeEmail(value));
}

// Keep digits and a leading "+": "0801 234 5678" -> "08012345678"
export function normalizePhone(value) {
  const raw = String(value ?? "").trim();
  const plus = raw.startsWith("+") ? "+" : "";
  return plus + raw.replace(/\D/g, "");
}

// 11 digits starting with 0, or 234 + 10 digits (with or without "+").
// Kept loose on purpose so a real number is never rejected.
export function isValidNgPhone(value) {
  return /^(?:0\d{10}|\+?234\d{10})$/.test(normalizePhone(value));
}

// Returns { ok, errors, cleaned }. `errors` is { fieldName: "plain message" }
// in form order, so Object.values(errors)[0] is the first thing to fix.
export function validateDeliveryDetails(input = {}, { requireEmail = true } = {}) {
  const errors = {};

  const fullName = String(input.fullName ?? "").trim().replace(/\s+/g, " ");
  const phone = normalizePhone(input.phone);
  const email = normalizeEmail(input.email);
  const street = String(input.street ?? "").trim();
  const district = String(input.district ?? "").trim();

  if (fullName.length < 2) errors.fullName = FIELD_MESSAGES.fullName;
  if (!isValidNgPhone(phone)) errors.phone = FIELD_MESSAGES.phone;
  if (requireEmail && !isValidEmail(email)) errors.email = FIELD_MESSAGES.email;
  if (street.length < 3) errors.street = FIELD_MESSAGES.street;
  if (!district) errors.district = FIELD_MESSAGES.district;

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    cleaned: { fullName, phone, email, street, district },
  };
}