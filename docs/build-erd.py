"""
Generates an ERD (SVG + Mermaid) from the live database schema dumped to
docs/schema.json. The SVG uses inline presentation attributes and no <style>
block, because that is what Figma's SVG importer handles cleanly.

Run:  php artisan tinker  (dump docs/schema.json)  then  python build-erd.py
"""

import json
import io
import os

BRAND = "#1b5a39"
BRAND_SOFT = "#2e6b4a"
MINT = "#c9e9e2"
SKY = "#e7f3fb"
INK = "#16211d"
INK_SOFT = "#5c6d66"
BORDER = "#cfe0d7"
CARD = "#ffffff"
PAGE = "#f6faf8"
LINE = "#7fa587"
CMS = "#b48a5a"

FONT = "Inter, 'Instrument Sans', Segoe UI, sans-serif"
MONO = "'JetBrains Mono', Consolas, monospace"

ROW_H = 19
HEADER_H = 34
PAD = 10
COL_W = 250

# Which column each table sits in, and its order within that column.
LAYOUT = {
    0: ["users", "departments"],
    1: ["doctors", "services", "clinic_hours"],
    2: ["patients", "doctor_service"],
    3: ["appointment_requests"],
    4: ["appointments", "testimonials"],
    5: ["passkeys", "content_items", "site_settings"],
}

COL_X = {0: 40, 1: 360, 2: 680, 3: 1000, 4: 1320, 5: 1640}

# Tables that are CMS-only (no relations) get a warmer header.
CMS_TABLES = {"content_items", "site_settings"}

schema = json.load(io.open("docs/schema.json", encoding="utf-8"))


def esc(text):
    return (
        str(text)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


def table_height(name):
    return HEADER_H + len(schema[name]["cols"]) * ROW_H + PAD


# ---------------------------------------------------------------- positions
pos = {}
for col, names in LAYOUT.items():
    y = 90
    for name in names:
        if name not in schema:
            continue
        pos[name] = (COL_X[col], y)
        y += table_height(name) + 44

width = max(x for x, _ in pos.values()) + COL_W + 60
height = max(y + table_height(n) for n, (_, y) in pos.items()) + 60

parts = []
parts.append(
    f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" '
    f'viewBox="0 0 {width} {height}" font-family="{FONT}">'
)
parts.append(f'<rect width="{width}" height="{height}" fill="{PAGE}"/>')

parts.append(
    f'<text x="40" y="46" font-size="26" font-weight="600" fill="{INK}">'
    f"Lumina Wellness — database schema</text>"
)
parts.append(
    f'<text x="40" y="68" font-size="13" fill="{INK_SOFT}">'
    f"{len(schema)} tables · generated from the live MySQL schema</text>"
)

# ------------------------------------------------------------- relationships
# Draw connectors first so the cards sit on top of the lines.
edges = []
for table, meta in schema.items():
    for fk in meta["fks"]:
        parent = fk["rt"]
        if table in pos and parent in pos:
            edges.append((table, fk["c"], parent, fk["rc"]))

for child, col, parent, _ in edges:
    cx, cy = pos[child]
    px, py = pos[parent]
    ch = table_height(child)
    ph = table_height(parent)

    # Leave from whichever side faces the parent.
    if px > cx:
        x1, y1 = cx + COL_W, cy + ch / 2
        x2, y2 = px, py + ph / 2
    else:
        x1, y1 = cx, cy + ch / 2
        x2, y2 = px + COL_W, py + ph / 2

    mx = (x1 + x2) / 2
    path = f"M{x1:.0f},{y1:.0f} C{mx:.0f},{y1:.0f} {mx:.0f},{y2:.0f} {x2:.0f},{y2:.0f}"
    parts.append(
        f'<path d="{path}" fill="none" stroke="{LINE}" stroke-width="1.6" '
        f'stroke-opacity="0.75"/>'
    )
    # Crow's foot at the child (many) end, solid dot at the parent (one) end.
    foot = -1 if px > cx else 1
    parts.append(
        f'<path d="M{x1:.0f},{y1:.0f} l{7*foot},-5 M{x1:.0f},{y1:.0f} l{7*foot},0 '
        f'M{x1:.0f},{y1:.0f} l{7*foot},5" fill="none" stroke="{LINE}" '
        f'stroke-width="1.6"/>'
    )
    parts.append(
        f'<circle cx="{x2:.0f}" cy="{y2:.0f}" r="3.5" fill="{LINE}"/>'
    )

# -------------------------------------------------------------------- tables
for name, (x, y) in pos.items():
    meta = schema[name]
    h = table_height(name)
    head = CMS if name in CMS_TABLES else BRAND

    parts.append(
        f'<rect x="{x}" y="{y}" width="{COL_W}" height="{h}" rx="10" '
        f'fill="{CARD}" stroke="{BORDER}" stroke-width="1.5"/>'
    )
    parts.append(
        f'<path d="M{x},{y+HEADER_H} v-{HEADER_H-10} a10,10 0 0 1 10,-10 '
        f'h{COL_W-20} a10,10 0 0 1 10,10 v{HEADER_H-10} z" fill="{head}"/>'
    )
    parts.append(
        f'<text x="{x+14}" y="{y+22}" font-size="13.5" font-weight="600" '
        f'fill="#ffffff">{esc(name)}</text>'
    )

    fk_cols = {f["c"]: f["rt"] for f in meta["fks"]}

    for i, colmeta in enumerate(meta["cols"]):
        cname = colmeta["c"]
        ctype = colmeta["d"]
        ty = y + HEADER_H + 14 + i * ROW_H

        if colmeta["k"] == "PRI":
            marker, mcolor = "PK", BRAND
        elif cname in fk_cols:
            marker, mcolor = "FK", BRAND_SOFT
        else:
            marker, mcolor = "", INK_SOFT

        if marker:
            parts.append(
                f'<text x="{x+12}" y="{ty}" font-size="8.5" font-weight="700" '
                f'fill="{mcolor}" font-family="{MONO}">{marker}</text>'
            )

        nullable = colmeta["n"] == "YES"
        parts.append(
            f'<text x="{x+36}" y="{ty}" font-size="11" '
            f'fill="{INK if marker else INK_SOFT}" '
            f'font-family="{MONO}">{esc(cname)}</text>'
        )
        parts.append(
            f'<text x="{x+COL_W-12}" y="{ty}" font-size="9.5" text-anchor="end" '
            f'fill="{INK_SOFT}" font-family="{MONO}" opacity="0.8">'
            f'{esc(ctype)}{"?" if nullable else ""}</text>'
        )

# --------------------------------------------------------------------- key
ky = height - 30
parts.append(
    f'<text x="40" y="{ky}" font-size="11" fill="{INK_SOFT}">'
    f"Crow&#39;s foot = many · dot = one · green header = relational · "
    f"brown header = CMS content (no foreign keys)</text>"
)

parts.append("</svg>")

os.makedirs("docs", exist_ok=True)
io.open("docs/erd.svg", "w", encoding="utf-8").write("\n".join(parts))

# ----------------------------------------------------------------- mermaid
lines = ["erDiagram"]
for child, col, parent, _ in edges:
    lines.append(f"    {parent} ||--o{{ {child} : \"{col}\"")
for name, meta in schema.items():
    lines.append(f"    {name} {{")
    for c in meta["cols"]:
        flag = "PK" if c["k"] == "PRI" else ""
        lines.append(f"        {c['d']} {c['c']} {flag}".rstrip())
    lines.append("    }")
io.open("docs/erd.mmd", "w", encoding="utf-8").write("\n".join(lines))

print(f"docs/erd.svg  ({width}x{height}, {len(pos)} tables, {len(edges)} relations)")
print("docs/erd.mmd  (mermaid source)")
