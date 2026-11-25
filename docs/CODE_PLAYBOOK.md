# Code playbook

Last updated: 22 November 2026

Code and platform lessons that cost us time once. Each has a "do this". The business
side (sellers, pricing, replying to buyers, content) lives in the private
`malltiply-ops` repo. Add new lessons at the bottom, in the same style.

---

## 1. Git and pull requests

- **One new branch per task, always from a fresh `main`:**
  `git checkout main`, then `git pull origin main`, then `git checkout -b task-name`
- **Save work by committing.** Commit before you pull, merge, or switch branches.
  Uncommitted work lives on one laptop only. A pushed branch is the real backup.
- **If `main` moves while you work:** `git fetch origin`, then `git merge origin/main`.
  Merge, do not rebase. Merging never needs a force-push.
- **Check you are current:** `git fetch origin`, then
  `git rev-list --left-right --count origin/main...HEAD`. The first number is how many
  commits `main` has that you do not. After merging main in, it must be `0`.
  "Up to date" messages prove nothing.
- **Never `git push --force`.**
- **Never fix conflicts alone in payment, price or stock files.** Send a screenshot
  first. A wrong choice brings an old bug back quietly.
- **Merge PRs with "Create a merge commit".** Not squash. We keep authorship.
- **Every PR needs a description:** what changed, which files, which files were outside
  the task, how it was tested.
- **Only Hassan merges.**
- **Temporary branches** (a backup, or a rebased copy made for one job) are deleted
  after their PR merges. Keep a safety copy for 2 to 4 weeks, then delete it. They are
  never reused for the next task.
- **Rebase** is only for a branch that is far behind, and only when Hassan or the lead
  model says so.

## 2. Hard rules in the code

Each rule lives in exactly one place. Never copy it into a second file.

| Rule | Where it lives |
|---|---|
| Price = the selected variant's price, base price only if no variant | `cartAvailability.js` (`getVariantPrice`) |
| Cart image = the photo tagged with the chosen color, else the first photo | `cartAvailability.js` (`getVariantImage`) |
| Stock = the selected variant's quantity. Unknown means 0, never made up | `cartAvailability.js` |
| Color name to swatch color | `lib/data/colorMap.js` |
| Delivery prices | `lib/data/deliveryQuotes.js` |
| Free delivery: the Malltiply Originals items add up to ₦36,000 or more (other sellers' items do not block it). The server decides the fee | `lib/utils/calculateDeliveryFee.js` (`computeDelivery`) |
| Email, phone, name and address checks | `lib/utils/validators.js` (used by browser and server) |

**Never trust the browser for money.** The amount, the delivery fee, and "this is paid"
must always come from the server.

## 3. Checkout trust rules

- Check everything **before** creating an order.
- Show plain sentences ("Enter a valid email, like name@gmail.com"), never
  "Something went wrong".
- Do not re-enable the Submit button while the browser is moving to Paystack.
  That is how double orders happen.
- If payment fails, reuse the order on retry. Do not create another.
- The total the buyer sees must be the total they are charged.
- Give people a human way out on every error: the WhatsApp link.

## 4. Fixing UI bugs

- **Find where a value is built, not where it is shown.** The wrong cart image was built
  once, in the add-to-cart code. Fixing the pages that show it would have done nothing.
- **Scroll lock:** lock both `document.body` and `document.documentElement`. Only the
  parent page locks. Children must not unlock on exit, or scroll leaks when one overlay
  replaces another.
- **z-index:** before raising one, search the project for other `z-[` values. Raising one
  element can bury another (this broke the search modal once).
- **Overlays** push a history entry and close on back (`pushState` + `popstate`).

## 5. Delivery pricing method

1. Take real Bolt quotes from the pickup point to each place, at the busy hour.
2. Price by **place**, not distance. A km formula was off by ₦1,000 or more on 1 in 7
   places. Direction matters more than distance (Lugbe, Apo, Durumi and Kubwa's far side
   cost more).
3. Buyer pays: highest quote for that place + 5%, rounded up to the next ₦100.
4. Keep strange quotes on file with the reason. Do not delete them.
5. Re-quote every 4 to 8 weeks.

## 6. Delegating to Belel (and to other models)

- First task: read-only, with a fence ("you may add exactly one file").
- Every task sheet lists: files you may touch, files you may not, what "done" means, how
  it is tested.
- **Review checklist for any PR or any model's change:**
  - Does it use the price, image and stock rules above (not its own copy)?
  - Does it copy a list that already exists somewhere?
  - Does it lock scroll correctly? Does it respect the z-index?
  - What happens on a failed request?
  - Did it touch files outside the task?
  - Does it trust the browser for any money?
- Most regressions came from two things: a branch that was behind `main`, and rewriting
  logic instead of finding the existing one.

## 7. Repo safety (check once, then every few months)

- Repo is **Private**: GitHub, open the repo, Settings, General, scroll to "Danger Zone".
  It says "Change repository visibility" and shows the current state.
- `.env` files were never committed. In PowerShell, in the project folder:
  `git log --all --oneline -- .env .env.local`
  Nothing printed means good. If something prints, change those secrets (Paystack, JWT,
  database) right away.
- Deleting a file does not remove it from git history.

---

## New lessons

(Add here, newest last.)