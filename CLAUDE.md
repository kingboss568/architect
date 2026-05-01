# CLAUDE.md

Guidance for AI assistants (Claude Code and similar) working in this repository.

## What this repo is

A **static HTML catalog/brochure site** for `taiwanarch.com/architecture` — a Traditional Chinese (zh-tw) marketing site for an AutoCAD block / architectural template library aimed at architects and interior designers in Taiwan.

There is **no build system, no package manager, no test suite, no CI**. The repository is just a flat collection of HTML pages and JPEG/GIF assets that gets served as-is from a web host. The original tooling appears to have been Microsoft FrontPage (note the `b11/_vti_cnf` artifact and `Thumbs.db` files in image directories).

When the user asks for "edits" or "fixes," assume they mean direct edits to the HTML/asset files. Do not introduce a framework, bundler, package.json, or any build step unless they explicitly ask for one.

## Repository layout

```
/                                Root of the site
├── index.html                   Main landing page (NOTE: charset=big5)
├── index2.htm                   Alternate landing page (charset=utf-8)
├── index2-bac.htm               Backup of index2.htm — do not edit unless asked
├── order.htm                    Order/contact page
├── sitemap.xml                  XML sitemap (urls point to www.taiwanarch.com)
├── a01.htm – a09.htm            "Standard CAD block" category pages
├── a1/ – a9/                    Screenshot images for the matching a0N.htm page
├── b01-1.htm … b13-2.htm        Interior design template pages (multi-version,
│   b07.htm, b07-1.htm, b07-2.htm   e.g. "客廳設計模板圖V.1", "V.2")
│   b10.htm – b13-2.htm
├── b1-1/ … b13-2/, b10/–b12/   Screenshot images for the matching bNN.htm page
├── product/                    Product preview images (01.jpg–17.jpg)
├── *.jpg, *.gif                Logos, banners, decorative imagery
└── test                        1-byte placeholder file from an early commit
```

### File-to-folder naming convention (important)

Each content page has a dedicated image folder whose name is derived from the page name:

| Page         | Folder    | Image filenames        |
|--------------|-----------|------------------------|
| `a01.htm`    | `a1/`     | `sshot-1.jpg` … `sshot-7.jpg` (also `a2-N.jpg` style in `a2/`) |
| `a02.htm`    | `a2/`     | `a2-1.jpg` … `a2-7.jpg` |
| `b01-1.htm`  | `b1-1/`   | `sshot-1.jpg` … |
| `b07-1.htm`  | `b7-1/`   | … |
| `b13-2.htm`  | `b13-2/`  | … |

The page → folder mapping drops the leading zero from the page number (`a01` → `a1`, `b06-1` → `b6-1`). When adding a new screenshot to a page, add it to the matching folder and reference it from the page's HTML.

## Key conventions to preserve

These choices look unusual by modern standards but are intentional in this codebase. Don't "modernize" them without asking.

1. **Absolute URLs everywhere.** Every image and most internal links use the full `https://www.taiwanarch.com/architecture/...` URL rather than relative paths. This is how the site was authored and how production serves it. Keep the same form when adding markup.
2. **Traditional Chinese content (zh-tw).** All visible text and `<title>`/`<meta>` content is in Traditional Chinese. `lang`/`Content-Language` is `zh-tw`. Preserve language when editing copy unless the user explicitly asks for a translation.
3. **Mixed character encodings.**
   - `index.html` declares `charset=big5`.
   - Every other `.htm`/`.html` file declares `charset=utf-8`.
   - The actual byte content of the files is UTF-8 in both cases. This means `index.html` may render incorrectly in some browsers due to the Big5 declaration; flag this to the user before "fixing" it, since changing the meta tag is a behavior change for any visitor whose cached copy expects Big5.
4. **Table-based layout, inline `<font>` tags, FrontPage-era HTML.** Pages use `<table>`-for-layout with explicit `width`/`height`/`bgcolor` attributes, `<font>` tags for color/size, deeply nested inline `style="..."` attributes (often with leftover `Apple-style-span` / WebKit-prefixed properties from copy-paste). This is the house style. Preserve it when editing existing pages — don't refactor to CSS classes or modern semantic HTML unless asked.
5. **`<base target="_blank">`** is set in `index.html` so every link opens in a new tab. Keep this in mind when adding navigation.
6. **Each content page is a near-template.** Pages share a common skeleton: top logo bar → breadcrumb / title row → order-button row → sequence of `<tr>` rows alternating `<img>` and a Chinese caption → footer logo. To add a screenshot row to an existing page, copy the surrounding `<tr>...</tr>` pair (image row + caption row) rather than writing markup from scratch.

## Common tasks

### Preview pages locally
There is no dev server. Either:
- Open the `.htm`/`.html` file directly in a browser (`file://`), or
- Run a throwaway static server from the repo root, e.g. `python3 -m http.server 8000` and visit `http://localhost:8000/index2.htm`.

When previewing, expect broken images: every `<img>` references `https://www.taiwanarch.com/architecture/...`, so locally the browser fetches images from the live site rather than the local `a1/`, `b1-1/`, etc. folders. To preview with local assets, you'd have to rewrite the `src` attributes — flag the tradeoff to the user before doing this.

### Adding a new content page
1. Copy an existing page of the same family (e.g. duplicate `b06-1.htm` to make `b06-3.htm`).
2. Update `<title>`, `<meta name="description">`, `<meta name="keywords">`.
3. Update the in-page `<h>`/breadcrumb text and image rows.
4. Create the matching image folder (e.g. `b6-3/`) and add screenshots there.
5. Add a navigation link in `index.html` and `index2.htm` (the left/right nav table cells follow the same `<tr>` pattern as the existing entries).
6. Add a `<url>` entry to `sitemap.xml`.

### Editing copy or images
- Edit the `.htm` file directly with the Edit tool. Keep surrounding tag soup intact — small targeted edits beat reformatting.
- Replacing an image: drop the new file into the matching `aN/` or `bNN/` folder using the existing filename so no HTML changes are needed.

## Git workflow

- Default branch: `main`.
- Active development branch for the current task: `claude/add-claude-documentation-LP9I4`.
- Commit history is sparse and uses terse messages (`"1"`, `"Create test"`); when making changes prefer descriptive commit messages going forward, but don't rewrite existing history.
- No `.gitignore` exists. Be careful not to commit `Thumbs.db`, `_vti_cnf`, or other editor artifacts that may show up; some are already tracked from earlier commits — leave those in place unless the user asks to clean them up.

## Things that are NOT in this repo (don't go looking)

- No JavaScript build, no Node/npm, no Python backend, no database.
- No test framework — there is nothing to run for "tests."
- No linter or formatter config — don't run Prettier/ESLint/etc. on these legacy HTML files; it would churn every page.
- No CI/CD pipeline.
- No CMS or templating engine — every page is hand-authored HTML.

## When in doubt

If a request is ambiguous (e.g. "fix the encoding," "modernize the layout," "make it responsive"), ask the user to confirm scope before making sweeping changes — these pages are deliberately frozen in a late-1990s/early-2000s style and an aggressive refactor would touch every file.
