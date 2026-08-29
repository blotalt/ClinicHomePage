# Database schema

`erd.svg` is the entity–relationship diagram. **Drag it straight into Figma** —
it imports as editable vector layers with real, selectable text (no `<style>`
block, all presentation attributes inline, which is what Figma's importer
handles cleanly).

`erd.mmd` is the same diagram as Mermaid, for GitHub or docs that render it.

## Regenerating after a migration

```bash
php artisan schema:dump-json    # reads the live DB -> docs/schema.json
python docs/build-erd.py        # -> docs/erd.svg + docs/erd.mmd
```

The diagram is generated from `information_schema`, so it always reflects the
database as it actually is rather than as someone remembered it.

## How to read it

- **Green header** — relational tables (the clinic domain).
- **Brown header** — CMS content, deliberately standalone (no foreign keys).
- **Crow's foot** — the "many" end. **Dot** — the "one" end.
- `PK` / `FK` markers sit to the left of the column name; a trailing `?` on the
  type means the column is nullable.

## The shape of it

```
departments ──< doctors ──< appointments >── patients
     │            ╲                │
     │             ╲               │
     └──< services ─╳─ doctor_service (many-to-many)
              │      ╲
              │       └──< testimonials >── patients
              └──< appointment_requests ──> appointments (1:1)

users ──< doctors        (a practitioner may have a login)
users ──< patients       (a patient may have a portal account)
departments ──< clinic_hours
```

## Delete behaviour

Chosen so history survives staff changes:

| Deleting a… | Effect                                                           |
| ----------- | ---------------------------------------------------------------- |
| Patient     | Their appointments are deleted (`cascade`)                       |
| Doctor      | Appointments are kept, `doctor_id` becomes null (`nullOnDelete`) |
| Service     | Appointments and testimonials kept, link nulled                  |
| Department  | Doctors and services kept and unassigned; its hours are deleted  |
