# Features

Feature-first code. Everything for one part of the site lives in one folder,
so you can build a feature without hunting through five directories.

```
features/
└─ home/                  # the clinic landing page
   ├─ sections/           # full-width page bands, top to bottom
   └─ components/         # smaller pieces used by those sections
```

## The rule of thumb

- Used by **one** feature → keep it in that feature's folder.
- Used by **two or more** features → move it to `shared/`.
- A generic, unstyled UI primitive (button, dialog, input) → `components/ui/`
  (shadcn owns that folder — don't hand-write files there).

Don't pre-emptively move things into `shared/`. Let a component prove it's
reusable by actually being needed twice.

## Adding a new feature

```
features/appointments/
├─ sections/
├─ components/
└─ hooks/          # only if the feature needs its own hooks
```

Then add a thin page in `pages/` that imports from it. Pages stay thin: they
wire up props from Inertia and compose sections. Real markup lives in the
feature.

## The public pages

One folder per page. Each holds a `content.js` (all its copy) plus the
sections that render it.

| Page       | Route         | Feature folder         | Sections                         |
| ---------- | ------------- | ---------------------- | -------------------------------- |
| Home       | `/`           | `features/home/`       | hero, philosophy, services       |
| Services   | `/services`   | `features/services/`   | services-grid, discovery-cta     |
| Philosophy | `/philosophy` | `features/philosophy/` | story, mission, pillars          |
| Contact    | `/contact`    | `features/contact/`    | appointment-form, clinic-details |

The header and footer are **not** in here — they are shared by every public
page, so they live in `layouts/marketing/` and are applied by
`layouts/marketing-layout.jsx`.

## Adding another public page

1. Add the route in `routes/web.php`.
2. Create `features/<name>/content.js` and its `sections/`.
3. Create `pages/<name>.jsx` that composes those sections.
4. **Add the page name to `MARKETING_PAGES` in `app.jsx`** — otherwise it
   renders inside the signed-in dashboard shell instead of the marketing
   header and footer.
5. Add it to `navLinks` in `shared/content/site.js` if it belongs in the nav.

## Content lives in content.js

Sections should read as layout. Keep strings, image paths, and list data in
the feature's `content.js` so copy edits never mean touching JSX:

```jsx
// features/services/sections/services-grid.jsx
import { serviceItems } from '@/features/services/content';

{
    serviceItems.map((service) => (
        <ServiceCard key={service.title} {...service} />
    ));
}
```

Site-wide values (clinic name, phone, email, nav, footer) belong in
`shared/content/site.js` instead, so they stay consistent across pages.

## Colors

The palette is defined once as Tailwind theme tokens at the bottom of
`resources/css/app.css`, which generates utilities like `bg-brand`,
`text-ink`, `bg-mint`. Change a hex value there and it updates site-wide —
avoid hard-coding colors in components.

| Token                  | Used for                        |
| ---------------------- | ------------------------------- |
| `brand` / `brand-dark` | Buttons, logo, links (+ hover)  |
| `brand-soft`           | The 98% statistic card          |
| `brand-tint`           | Soft wash behind the form card  |
| `mint` / `sage`        | Tinted cards and badges         |
| `sky` / `mist`         | Alternating section backgrounds |
| `ink` / `ink-soft`     | Headings / body copy            |

## Photos

Everything under `public/images/` is a placeholder SVG. Drop real photos in
beside them and point the `image` paths in the relevant `content.js` at the
new files — that is the only change needed.
