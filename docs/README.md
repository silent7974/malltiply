# Malltiply docs

Last updated: 22 November 2026

One place for what we learn and what is still open, so nothing lives only in a
phone note or a chat. This repo holds the **code** side. The business side
(sales, names, money, market feedback) lives in the private `malltiply-ops` repo.

## Three rules

1. **No private details in this repo.** No customer or seller names, phone
   numbers, bank details, or money figures (sales, cash, payouts). Those go in
   `malltiply-ops`. Anyone with access to the code can read this folder, and so
   can the AI tools that read the code.
2. **One topic per file.** Update the file. Do not make "v2" copies.
3. **Every file starts with "Last updated: <date>".**

## Map

| File | What it is for | Who updates it |
|---|---|---|
| `docs/OPEN_ITEMS.md` | Everything to fix, check or decide (code and platform) | Hassan, when a weekly review changes it |
| `docs/playbook/CODE_PLAYBOOK.md` | Code lessons and repeatable steps (git, hard rules, checkout, delivery pricing) | Whoever learns something |
| `docs/ORIENTATION.md` | The briefing to paste into any AI model joining the work | Claude, when the rules change |
| `docs/HANDOFF.md` | Dated log of what each model changed, so any model can continue | Each model, at the end of a session |
| `docs/delivery/DELIVERY_RATE_CARD.md` | Readable snapshot of delivery prices | After `deliveryQuotes.js` changes |
| `BUGS.md` (project root) | Confirmed bugs only | Stays at the root, because `AGENTS.md` points to it |
| `AGENTS.md` (project root) | Rules for AI coding tools that read the repo | Root |

Coming later: `docs/audits/SELLER_AUDIT.md` (once Belel's PR is merged and reviewed).

## In the private repo (`malltiply-ops`), not here

`FEEDBACK.md` (monthly: sales log, names, cash, market insights), the business
`PLAYBOOK.md` (seller models, pricing, replying to buyers, content rules), seller
payouts, supplier details, contracts.

## Habit

Only `OPEN_ITEMS.md` needs a regular touch. When a weekly review turns up a code
or platform item, add one line to it. Everything else is updated when something
we ship makes it wrong.