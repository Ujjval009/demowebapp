# Crumb & Co. — Franchise Ops Dashboard (Interactive Demo)

A production-quality, self-contained demo of a bakery-franchise operations platform.
Built to be presented to clients: every module is clickable, data animates, and a
guided auto-play tour walks a viewer through the whole product in under a minute.

## Quick start

```bash
pnpm install
pnpm dev
```

Open the printed `http://localhost:5173` URL.

## Presenting it

1. Click **▶ Auto-play tour** in the top bar. The app walks through all 7 modules
   with captions and highlights — hands-free, perfect for a client meeting.
2. Or click through manually:
   - **POS & Billing** — tap products, adjust quantities, apply a discount, charge.
   - **Inventory & Baking** — watch stock bars; low stock ambers and one tap reorders.
   - **Expiry & Cold Storage** — FEFO rows, markdown buttons, batch detail.
   - **Sales Analytics** — hover the live Recharts; filter by branch (top-right dropdown).
   - **CRM & Loyalty** — search/select customers for a profile card.
   - **Franchise Mgmt** — click a branch row for its scorecard.

## Shipping it to someone (no server needed)

The app builds to a static folder that runs from any static host, and there is a
**single-file build** you can literally email and double-click with zero setup:

```bash
pnpm build          # modular build -> dist/   (for hosting on a web server)
pnpm build:single   # one self-contained file -> dist-single/index.html
```

`dist-single/index.html` inlines all JS, CSS and assets into a single HTML file.
Send it to someone — they unzip, double-click `index.html`, and it runs in any
browser with no Node, no server, and no internet required (Google Fonts degrade
gracefully offline).

> Tip: start the presentation with the **▶ Auto-play tour** button in the top bar.

## Tech stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + **TypeScript** (strict)
- [Recharts](https://recharts.org/) for interactive charts
- [vite-plugin-singlefile](https://github.com/richardtallent/vite-plugin-singlefile) for the emailable build
- No UI framework — hand-rolled design system (tokens in `src/index.css`)

## Structure

```
src/
├── App.tsx                  # shell wiring
├── index.css                # design system / all styles
├── types.ts                 # domain models
├── lib/format.ts            # INR currency helpers
├── context/AppContext.tsx   # view, branch, role, toasts, tour state
├── hooks/useCountUp.ts      # animated number counters
├── data/                    # seed data (products, inventory, expiry, branches, CRM, analytics)
├── features/cart/           # cart reducer + totals math
└── components/
    ├── layout/              # Sidebar, Topbar, DemoTour
    ├── ui/                  # Pill, ProgressBar, StatCounter, ToastStack
    └── views/               # one component per module
```

## Scripts

| Command            | What it does               |
| ------------------ | -------------------------- |
| `pnpm dev`         | Local dev server           |
| `pnpm build`       | Type-check + production build to `dist/` |
| `pnpm build:single`| Single-file build to `dist-single/index.html` (emailable) |
| `pnpm preview`     | Preview the production build |
| `pnpm typecheck`   | TypeScript only            |