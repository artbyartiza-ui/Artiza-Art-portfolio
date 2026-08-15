# Artiza Art — animated portfolio site

Source for the live, animated version of the Artiza Art GitHub portfolio, built to visually echo [artbyartiza.com](https://artbyartiza.com). Plain HTML/CSS/JS — no build step, deployable directly with GitHub Pages.

## 1. Publish it (GitHub Pages)

1. Create a repository, e.g. `artiza-art-portfolio`, and push everything in this folder to it.
2. In the repo: **Settings → Pages → Source → Deploy from a branch → main → / (root)**.
3. Your site goes live at `https://yourusername.github.io/artiza-art-portfolio/`.
4. Optional: add a custom domain in the same Pages settings if you'd like it at a subdomain of `artbyartiza.com`.

## 2. Add your real artwork

Images are referenced from `data/projects.json`, not hard-coded in the HTML.

1. Drop image files into the matching folder under `assets/images/` (e.g. `assets/images/childrens-books/my-piece.jpg`).
2. Open `data/projects.json` and either edit an existing placeholder entry or add a new object:
   ```json
   {
     "id": "cb-002",
     "title": "The Little Lighthouse",
     "category": "Children's Books",
     "description": "Picture book interior spreads for a self-published author.",
     "coverImage": "assets/images/childrens-books/my-piece.jpg",
     "gallery": [],
     "link": ""
   }
   ```
3. Save — the portfolio grid on the page reads this file automatically, no HTML editing needed.
4. Until a real `coverImage` path is set (i.e. while it still says `placeholder.jpg`), the site shows a clean placeholder block instead of a broken image.

## 3. Add or edit text content

All copy lives directly in `index.html`, organized by section with clear HTML comments-free structure — search for the section by its `id` (`#about`, `#services`, `#process`, `#testimonials`, `#faq`, `#contact`).

Anything still wrapped in `[brackets]` is a placeholder — replace it with your own words.

## 4. Structure

```
index.html                    → all page content/markup
assets/css/styles.css         → all styling (colors, layout, animation)
assets/js/main.js             → scroll reveal, nav, portfolio filter/render, FAQ accordion
assets/images/                → your artwork, organized by category
data/projects.json            → portfolio project list (edit this to add/update projects)
```

## 5. What's placeholder vs. real

- **Real, from your live site (paraphrased in original wording):** the "50+ books illustrated" stat, the 7-step process, testimonial sentiment, and FAQ content.
- **Placeholder — needs your input:** all artwork/images, the second About paragraph, project titles/descriptions in `data/projects.json`, and the exact payment-split wording in the FAQ (confirm it matches your current terms before publishing).
