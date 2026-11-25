# Open items

Last updated: 22 November 2026

One line per item. When it is done, move it to "Closed" with the date.
Owner: **H** = Hassan, **B** = Belel, **C** = Claude (lead dev), **M2/M3** = other AI models.

## Go live first (this unlocks platform checkout for strangers)

Everything built since 28 Oct exists only on Hassan's laptop. Production still has
the old code: no email validation, old delivery prices, and the hole where anyone
can mark an order as paid.

| ID | Step | Owner |
|---|---|---|
| G1 | Commit and push everything (see the git steps), open the PR, merge | H |
| G2 | Set `isOriginals: true` on the Originals seller account in the **production** database | H |
| G3 | After the deploy, place one real order on production yourself (cheapest item) and watch it through Paystack, the order page and the email | H |
| G4 | Only then move strangers from transfer to platform checkout | H |

## Money and security

| ID | Item | Why it matters | Next step | Owner |
|---|---|---|---|---|
| S1 | `PATCH /api/orders/[id]` still lets anyone change `orderStatus` or send a refund | Anyone with an order ID could mark orders delivered or attach their own bank details to a refund | Add login checks (seller token for status, buyer or guest proof for refunds). Needs the seller order screens and `RefundModal` | C + H |
| S2 | Seller orders route returns unpaid orders and full buyer details | Sellers see abandoned orders and other sellers' items | Filter to paid orders, return only that seller's items | C |
| S3 | Seller product update takes the raw request body, and PUT/DELETE use the `await cookies().get()` pattern | A seller could overwrite `sellerId` or `slug`. Edits may fail in production | Allow-list the fields. Confirm edits work in production | C |
| S4 | `/api/products/store/[storeId]` reads `params.storeId` without awaiting it | Store pages may list the wrong products | Fix before stores go public | C |
| S5 | `guest-lookup` returns full orders to anyone who holds an order ID | Buyer name, phone and address exposed | Low risk today. Revisit when guests get accounts | C |
| S6 | Confirm the repo is private and `.env*` files were never committed | Secret keys would be exposed | See section 7 of the code playbook | H |
| S7 | Confirm `confirmationEmailSent` exists in `order.js` | `settlePaidOrder` sets it. If missing, the flag never saves | Open the schema and check | H |

## Stock

| ID | Item | Next step | Owner |
|---|---|---|---|
| T1 | Old orders may have subtracted stock twice, or missed a second buyer of the same variant | Compare stock with orders for 3 past products. New code prevents it going forward | H |
| T2 | The SKU holds the stock count, so it changes after every sale | Make SKUs permanent in the seller rebuild. Keep quantity separate | C |
| T3 | If `OVERSOLD` appears in the server logs, two people paid for the last item | Contact the later buyer: refund or swap | H |

## Delivery

| ID | Item | Next step | Owner |
|---|---|---|---|
| D1 | All quotes were taken at 6pm to 7pm (the high end) | Re-quote 5 or 6 places at midday and compare | H |
| D2 | Check: Ivy Apartments (₦4,300, left out as a likely one-off), Zuba (quote time unknown), Idu (₦3,200 for 3.7km), Kubwa (₦3,000 to ₦5,600), Mpape (no quote) | Re-quote each. Update `deliveryQuotes.js` | H |
| D3 | Prices go stale (fuel price, Bolt changes) | Refresh the whole card every 4 to 8 weeks | H |
| D5 | Pickup option (Stage 2) | Public pickup point, never a home address. Only when all items share one pickup point | C |
| D6 | Seller-to-buyer pricing (Stage 3): the fee is always priced from the Life Camp hub, so a seller's item that ships from elsewhere (for example Jabi to Wuye, about ₦2,700) is overcharged or undercharged | Map pins for buyers and sellers. One shipment per seller | C |

## Buyer-facing quick wins

| ID | Item | Next step | Owner |
|---|---|---|---|
| H1 | Homepage still shows products from inactive sellers (and old supplier products) | Hide inactive sellers' products. Small change in the public products route | C |
| H2 | No store or collection page for Malltiply Originals (a clean page for the link in bio) | Simple page listing Originals products | C |
| H3 | The support WhatsApp number is typed in 4 places | One constant, so switching to a business number is a one-line change | C |
| B1 | Order emails land in spam | Set up a proper sender domain (SPF and DKIM) | C + H |
| B2 | Logout is broken for signed-in buyers | Send the sign-out route and where it is called | C |
| B3 | Guest details stay in the phone's storage after payment | Decide: clear after a paid order? (Trade-off: repeat buyers retype) | H |
| B4 | Guest orders only show on the same phone | Decide: let guests look up by email and order number? | H |
| B5 | Orders page still sends a "paid" PATCH after verifying (the server now ignores it) | Remove that line | C |

## Seller dashboard

| ID | Item | Next step | Owner |
|---|---|---|---|
| A0 | Decide how big "ready" must be for the first 10 sellers (not 100) | Write down the 5 things a seller must be able to do without Hassan | H |
| A1 | Production sign-in loop: signed in, but stuck on the sign-in page | Three DevTools checks (cookie present? profile request 401 or 200?), then `signin/page.jsx` and `normal/dashboard/layout.jsx` | H + C |
| A2 | Editing a product depends on Redux state, so a refresh may create a duplicate | Give editing its own URL | C |
| A3 | Slugs are not generated when a product is created | Generate on save | C |
| A4 | Onboarding takes about 20 minutes per seller | Target: under 5 minutes | C + H |

## People and process

| ID | Item | Next step | Owner |
|---|---|---|---|
| P1 | Belel's Week 1 task (seller audit): PR link not shared | Check `github.com/silent7974/malltiply/branches` and open the PR | H |
| P3 | Add the hard rules to `AGENTS.md` | Paste the block Claude supplied | H |
| P4 | Orientation for Model 2 and Model 3 | Use `ORIENTATION.md`. Each model ends sessions with a `HANDOFF.md` entry | H |
| P5 | Delete temporary branches after their PRs merge (`project-0-rebased`; later `belel-backup`, `project-0`) | Wait 2 to 4 weeks, then delete | H |

## Closed

- Checkout email validation and plain error messages (Nov 2026)
- `settlePaidOrder` rewritten: one payment can no longer subtract stock twice (Nov 2026)
- "Mark as paid" hole in `PATCH /api/orders/[id]` removed in code (Nov 2026). Not live until G1
- Delivery price card from real Bolt quotes, and the server now decides the fee (Nov 2026)
- Free delivery rule: Malltiply Originals items of ₦36,000 or more; other sellers' items do not block it (22 Nov 2026)
- Buyer orders tab crash on refunds (`returned` key) fixed (Nov 2026)
- FEEDBACK.md and the business playbook moved to the private `malltiply-ops` repo (Nov 2026)