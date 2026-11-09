# Tribes of Galway: site draft

A static site built with the taste skill's kit (`assets/` is copied from `.claude/skills/design-taste-frontend/assets`).

- Content lives in `src/content.mjs` (tribes, stories, places, neighbourhoods). It is **draft copy** written from published Galway history until the Phase 1 narratives arrive; check every fact.
- Run `node build.mjs` to regenerate every page from it.
- Open `index.html` through any static server (`python3 -m http.server`) to view it.
- Photographs are placeholders: grey frames that name the picture to take or license for each slot.
- Map pin positions are approximate and need checking on the ground.
- Light and dark mode follow the system setting; the moon/sun button and the footer link switch them.
