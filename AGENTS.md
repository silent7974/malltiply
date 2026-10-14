# Malltiply — Agent Guidelines & Project Knowledge

## Project Overview
**Malltiply** is a Next.js (App Router) multi-vendor e-commerce marketplace platform tailored for Nigerian commerce (Abuja / Wuse market context, Naira ₦ currency, Paystack payments, Bolt dispatch delivery). It supports dual seller tiers (`normal_seller` and `premium_seller`), guest/authenticated buyer checkout, order tracking, and inventory management.

---

## Tech Stack
- **Framework:** Next.js 16 (App Router) with Turbopack
- **UI & Styling:** React 19, Tailwind CSS v4 (`@tailwindcss/postcss`), Framer Motion, Lucide React, Swiper
- **State Management:** Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)
- **Database & ODM:** MongoDB via Mongoose
- **Auth & Security:** JWT (`jsonwebtoken`), bcrypt / bcryptjs, Next.js Edge middleware (`middleware.js`)
- **Media & External Services:** Cloudinary, Nodemailer, Paystack (payments), Bolt (dispatch)

---

## Key Directories & Structure
- `src/app/` — Next.js App Router pages and API routes:
  - `src/app/api/` — Backend API routes (auth, orders, products, sellers, stores, etc.)
  - `src/app/seller/` — Seller dashboard, onboarding, signin/signup, and inventory management
  - `src/app/product/`, `cart/`, `orders/`, `category/`, `stores/` — Buyer-facing interfaces
  - `src/app/components/` — Shared UI components
- `src/models/` — Mongoose schemas (`seller.js`, `store.js`, `product.js`, `order.js`, `cart.js`, `user.js`, `analyticsLogs.js`)
- `src/redux/` — Global state slices (`sellerProfileSlice`, products, cart, etc.) and store configuration
- `src/lib/` — Database connection (`mongodb.js`), Cloudinary helpers, analytics, email utilities, and order logic
- `middleware.js` — Route protection and role-based redirects (`normal_seller` vs. `premium_seller`)

---

## Development & Run Commands
- Run dev server: `npm run dev` (runs `next dev --turbopack`)
- Production build: `npm run build`
- Start production server: `npm run start`
- Lint: `npm run lint`

---

## Architecture & Conventions
1. **Currency & Localization:** Use Naira (`₦`), not `$`. Abuja district-aware delivery and phone number formats.
2. **Seller Tiers:**
   - `normal_seller`: Standard marketplace seller profile and listings.
   - `premium_seller`: Customized storefront, distinct dashboard routes (`/seller/premium/*`), enhanced branding and multi-image uploads.
3. **State Management:**
   - Redux slices store seller profiles, product forms, and active cart data.
   - Avoid redundant client-side fetching loops (e.g. infinite GET requests when reading profile data).
4. **Tracking Documents:**
   - `BUGS.md`: Active list of confirmed bugs and tasks across Seller and Buyer flows.
   - `FEEDBACK.md`: Operational notes, sales log, user testing feedback, and feature gap prioritization.
