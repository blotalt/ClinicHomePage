# Content admin

Everything on the public site is edited here. Reach it at `/admin`.

## Getting in

Local demo accounts (password `password` for both):

| Account | Email               | Reaches /admin |
| ------- | ------------------- | -------------- |
| Admin   | `admin@lumina.test` | yes            |
| Staff   | `staff@lumina.test` | no — 403       |

The staff account exists so the gate is easy to test. Recreate them any time
with `php artisan db:seed --class=DemoUsersSeeder`; the seeder refuses to run
in production.

For a real account, grant it explicitly:

```bash
php artisan admin:grant you@example.com
php artisan admin:grant you@example.com --revoke   # take it away again
```

`is_admin` is deliberately **not** mass-assignable, so it can only be set by
that command (or explicitly in code). Non-admins get a 403; guests are sent to
the login page.

## What lives where

| Screen      | Route                         | Edits                           |
| ----------- | ----------------------------- | ------------------------------- |
| Dashboard   | `/admin`                      | Counts, links, latest requests  |
| Page copy   | `/admin/pages/{group}`        | Headings, intros, button labels |
| Collections | `/admin/content/{collection}` | Repeatable, ordered items       |
| Requests    | `/admin/requests`             | Contact form submissions        |

There are two kinds of content:

- **Settings** (`site_settings`) — one value per key, e.g.
  `home.hero.title_lead`. Grouped onto one form per page by the middle part of
  the key, so `home.hero.*` becomes the "Hero" section.
- **Collections** (`content_items`) — repeatable lists with drag-free
  reordering: `services`, `pillars`, `home_highlights`, `clinic_details`.

Adding a new editable field means adding a row to `site_settings` (see
`SiteContentSeeder`) and reading it in `App\Support\SiteContent`. The admin
form picks it up automatically.

## Rich text

Fields with `type = html` render the TipTap editor
(`shared/components/admin/rich-text-editor.jsx`): bold, italic, underline,
strike, inline code, H2/H3, bullet and numbered lists, quote, alignment,
divider, links, clear formatting, undo/redo.

The editor writes HTML into a hidden input so it submits with a normal
Inertia `<Form>`.

### Security

Submitted HTML is **always** re-sanitised server-side by
`App\Support\HtmlSanitizer` before it is stored — the editor's own output is
never trusted. Anything outside the tag allow-list is unwrapped (text kept,
markup dropped); `script`, `style`, `iframe`, `svg` and friends are removed
outright; every attribute is stripped except a validated `href` on links.

That is what makes it safe for `Prose` to render stored content with
`dangerouslySetInnerHTML`. **Never point `Prose` at anything a visitor can
write** — the appointment message is rendered as plain text for exactly this
reason.

## Icons

Icon names are stored as strings and resolved through
`shared/lib/icons.js`, which bundles a curated list. To offer a new icon, add
it to that file — importing all of lucide would balloon the bundle. An
unknown name falls back to a neutral icon rather than blanking the page.

## Gotcha: the React Compiler

This project builds with `babel-plugin-react-compiler`. It hoists property
reads out of event handlers into render-time memo dependencies, so this
crashes while `pendingDelete` is null:

```jsx
onClick={() => destroy(pendingDelete.id)}   // reads .id during render
onClick={() => destroy(pendingDelete?.id)}  // safe
```

Use optional chaining whenever you read from state that starts out null.
