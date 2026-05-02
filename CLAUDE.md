# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static website for **Lillegaard Tannklinikk** — a dental clinic in Bodø, Norway. No build step, no framework, no package manager.

## Deploying changes

After every edit, commit and push:
```
git add <files>
git commit -m "describe change"
git push
```
The site auto-deploys via GitHub Pages to **https://emilopdal.github.io/lillegaard-tannklinikk/** within ~1 minute of a push.

## Architecture

Single-page site — three files:
- `index.html` — all content and structure, written in Norwegian
- `style.css` — all styles; uses CSS custom properties defined in `:root`
- `script.js` — navbar scroll shadow, mobile hamburger menu, scroll-triggered fade-in

No external JS dependencies. Google Fonts (Inter) loaded via CDN.

## Key constraints

- **Only add factual information** — content must come from the client, not inferred. Opening hours, services, and contact details must match the Google Maps business profile exactly.
- All copy is in **Norwegian (Bokmål)**.
- Logo files: `logo.png` (circular, used in navbar with `mix-blend-mode: multiply`) and `logo og navn.png` (horizontal, used in footer with `mix-blend-mode: screen`).
