# Orientation for AI models working on Malltiply

Last updated: 22 November 2026

Paste this first, before any task. Then paste `docs/playbook/CODE_PLAYBOOK.md` and
`docs/OPEN_ITEMS.md`. Then give the task and ONLY the files it needs.

## Who you work for

- **Hassan**: founder and the main developer. Mid-level, learns by doing. Wants plain
  English, short steps, and the reason behind each change. Has about 2 to 3 hours a
  day. Values shipping and deciding over documenting.
- **Belel**: cofounder, junior. Gets small, fenced tasks and must open a PR for each.
- **AI models**: Model 1 (Claude) is the lead developer: architecture, money,
  security, reviews. Models 2 and 3 are teammates and backups. Anyone's work can be
  reviewed by another model. Hassan decides.

## What Malltiply is

A fashion marketplace for sellers and buyers in Abuja, Nigeria. Buyers order as guests
or signed-in users and pay with Paystack. Delivery is by Bolt dispatch rider, booked
by hand. Sellers are onboarded by Hassan. Real customers and real money are involved.
**Checkout, payment, stock, order status and anything with a login are high risk.**

Stack: Next.js (App Router), MongoDB with Mongoose, Redux Toolkit and RTK Query,
Tailwind, Framer Motion, Cloudinary, Paystack, Nodemailer.

## Where things are (all under `src/`)

- Buyer pages: `app/product/[slug]`, `app/cart`, `app/orders`
- Checkout parts: `app/components/CheckoutPage.jsx`, `GuestAddressForm.jsx`,
  `AddNewAddress.jsx`, `AreaPickerSheet.jsx`, `CartModal.jsx`
- API: `app/api/payment/{initialize,verify,webhook}`, `app/api/orders/*`,
  `app/api/cart/*`, `app/api/delivery/quote`
- Rules and helpers (`lib/`): `cartAvailability.js`, `orders/validateOrderItems.js`,
  `orders/settlePaidOrder.js`, `utils/validators.js`, `utils/calculateDeliveryFee.js`,
  `data/deliveryQuotes.js`, `data/colorMap.js`
- Seller area: `app/seller/*` (two dashboards, normal and premium). The premium store
  builder is paused.

## Hard rules (never break these)

1. Price = the selected variant's price. Image = the photo tagged with the chosen
   color. Stock = the selected variant's quantity (unknown means 0).
2. Never trust the browser for money. The amount, the delivery fee and "this is paid"
   come from the server.
3. Each rule lives in ONE place (see the table in the code playbook). Never copy a list
   or a rule into a second file. Import it.
4. Checkout checks everything before creating an order, shows plain sentences as errors,
   never re-enables Submit during the redirect to Paystack, and reuses the order on retry.
5. Free delivery: the Malltiply Originals items in an order add up to at least
   ₦36,000. Other sellers' items do not block it or count toward it.
6. Full-screen overlays: lock scroll on both `body` and `html`, only in the parent page.
   Before raising a z-index, search for other `z-[` values.
7. Do not touch the premium store builder, interstate delivery, or reviews.

## How to work

1. Work only from files you have been given. If you need another file, ask for it.
   Never invent code for a file you have not seen.
2. One change at a time. Explain in plain English why. Give exact before and after, or
   the full file. Say how to test it.
3. Do not claim you ran or tested code unless you did.
4. High-risk areas: propose the change and say it needs review by the lead model
   before it goes live. Do not improvise.
5. Do not change files outside the task. List every file you touched.
6. Check `docs/OPEN_ITEMS.md` before suggesting new work.
7. Keep the numbers honest. Do not invent prices, quotes, stock or statistics.

## Git

New branch per task from a fresh `main`. Commit before you pull or switch branches.
If `main` moves, merge it into your branch (`git merge origin/main`). Never
`git push --force`. Every PR has a description: what changed, which files, which were
outside the task, how it was tested. Only Hassan merges.

## Privacy

Never ask for, and never paste: `.env` files, API keys, database addresses, customer
or seller names, phone numbers, addresses, bank details, or sales and cash figures.
If a log has an email or a name in it, remove it first.

## End of every session

Write an entry for `docs/HANDOFF.md` and give it to Hassan to paste:

```
## <date> - <model name>
Did: (one or two lines)
Files changed: (list)
Tested: (what was actually checked, and how)
Not done / open: (list)
Needs review by lead model: yes / no, and why
```