// Builds the static site: node build.mjs
// Content: src/content.mjs (tribes, other families, areas), src/places.json (the historic sites from
// "The Tribes Experience of Galway & other notable families" by Adrian Martyn, edited by Pete Kelly),
// src/photos.json (Wikimedia Commons stand-in photographs and their credits).
import fs from 'node:fs';
import path from 'node:path';
import { tribes, families, areas } from './src/content.mjs';

const here = path.dirname(new URL(import.meta.url).pathname);
const places = JSON.parse(fs.readFileSync(path.join(here, 'src/places.json'), 'utf8'));
const photos = JSON.parse(fs.readFileSync(path.join(here, 'src/photos.json'), 'utf8'));
const out = (file, html) => { const f = path.join(here, file); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, html); };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const arrow = '<svg class="m-arrow" viewBox="0 0 12 12" aria-hidden="true"><path class="m-arrow__stem" d="M1 6h8"/><path class="m-arrow__head" d="M4.5 2.5 8 6l-3.5 3.5"/></svg>';
const MAIN = 'Explore the map';

const allFamilies = [{ slug: 'all', name: 'All the tribes' }, ...tribes, ...families];
const famBy = Object.fromEntries(allFamilies.map((f) => [f.slug, f]));
const famHref = (slug) => (tribes.some((t) => t.slug === slug) ? `tribes/${slug}.html` : `families.html#${slug}`);
const famNames = (pl) => pl.families.map((f) => famBy[f]?.name || f).join(' and ');
const placesOf = (slug) => places.filter((x) => x.families.includes(slug));

const crest = (t, cls = '') => `<svg class="crest ${cls}" viewBox="0 0 48 56" aria-hidden="true"><path d="M2 2h44v22c0 16-10 25-22 30C12 49 2 40 2 24z" fill="currentColor"/><text x="24" y="33" text-anchor="middle">${esc(t.name.charAt(0))}</text></svg>`;
// a photograph from src/photos.json by key; p = path prefix
const photo = (key, p, { alt, cls = '', eager = false } = {}) => {
  const ph = photos[key] || photos.hero;
  return `<img class="photo ${cls}" src="${p}assets/img/${ph.file}" width="${ph.w}" height="${ph.h}" alt="${esc(alt || ph.alt)}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} data-source="stand-in" data-subject="${esc(ph.alt)}">`;
};
const placeCard = (pl, p, span = 'span-4') => `<a class="place-card ${span}" href="${p}places/${pl.id}.html">
        <span class="place-card__img">${photo(pl.photo, p, { alt: '' })}</span>
        <span class="t-label muted">${esc(famNames(pl))} · ${esc(pl.street)}</span>
        <span class="place-card__title">${esc(pl.title)}</span>
        <span class="place-card__line">${esc(pl.summary)}</span>
      </a>`;

function page({ file, title, desc, body, current = '', home = false, map = false, moment = false }) {
  const depth = file.split('/').length - 1;
  const p = '../'.repeat(depth);
  const nav = [['tribes/index.html', 'Tribes', 'tribes'], ['places/index.html', 'Sites', 'places'], ['neighbourhoods.html', 'Neighbourhoods', 'areas'], ['about.html', 'About', 'about']];
  const navLinks = nav.map(([href, word, key]) => `<div class="nav__item"><a class="nav__link" href="${p}${href}"${key === current ? ' aria-current="page"' : ''}>${word}</a></div>`).join('\n      ');
  const mapPlaces = places.map(({ id, title, families: f, street, lat, lng, summary }) => ({ id, title, families: f, street, lat, lng, summary: summary.length > 180 ? summary.slice(0, 177) + '…' : summary, family: famNames({ families: f }) }));
  const placeData = map ? `<script type="application/json" id="places-data">${JSON.stringify(mapPlaces)}</script>` : '';
  return `<!doctype html>
<html lang="en" data-type="place" data-radius="sharp" data-buttons="arrow" data-motion data-prefix="${p}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${p}assets/img/${photos.hero.file}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${p}favicon.svg" type="image/svg+xml">
<meta name="theme-color" content="#14181b">
<!-- <link rel="canonical" href="https://www.tribesofgalway.com/"> once the domain is live -->
<meta name="site-kind" content="other">
<meta name="page-type" content="place">
<meta name="page-kind" content="place">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Besley:wght@400..600&family=Albert+Sans:wght@400..600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${p}assets/system.css">
<link rel="stylesheet" href="${p}assets/ui/cards.css">
<link rel="stylesheet" href="${p}assets/motion/motion.css">
<link rel="stylesheet" href="${p}assets/backgrounds/backgrounds.css">
<link rel="stylesheet" href="${p}assets/layout/layout.css">
<link rel="stylesheet" href="${p}assets/icons/icon.css">
<style>
:root {
  --p-bg: #14181b; --p-surface: #1d2226; --p-ink: #ece7dd; --p-muted: #a4a9ae;
  --p-accent: #6fb3c2; --p-accent-ink: #14181b; --p-action: #6fb3c2; --p-action-ink: #14181b;
  --p-inv-bg: #ece7dd; --p-inv-surface: #e2dcd0; --p-inv-ink: #14181b; --p-inv-muted: #4c5257;
  --p-inv-accent: #14181b; --p-inv-accent-ink: #ece7dd; --p-inv-action: #14181b; --p-inv-action-ink: #ece7dd;
  --font-display: "Besley", Georgia, serif;
  --font-text: "Albert Sans", system-ui, sans-serif;
  --display-weight: 400;
  --display-tracking: -0.02em;
}
</style>
${map ? `<link rel="stylesheet" href="${p}assets/vendor/leaflet.css">` : ''}
<link rel="stylesheet" href="${p}assets/site.css">
<script>document.documentElement.classList.add('m-enter');setTimeout(()=>document.documentElement.classList.add('m-enter-done'),700)</script>
<script src="${p}assets/backgrounds/backgrounds.js"></script>
${moment ? `<script>document.documentElement.classList.add('mo-js');setTimeout(()=>document.documentElement.classList.add('mo-safe'),2500)</script>
<link rel="modulepreload" href="${p}assets/moments/moments.js">
<link rel="modulepreload" href="${p}assets/moments/lib.js">
<link rel="modulepreload" href="${p}assets/moments/word-highlight/moment.js">` : ''}
</head>
<body>
<!-- type: place (a heritage site about the city: photographs, type and flat colour; no effects). Dark only, at Alan's request.
     deal: hero place, nav split, close word, footer columns, buttons arrow, mark stack; type besley
     moments: word-highlight (home, the statement section) -->
<header class="nav nav--split">
  <div class="wrap nav__bar">
    <a class="skip-link" href="#top">Skip to content</a>
    <a class="nav__logo" href="${p}index.html"><span class="mark" data-mark="stack" aria-hidden="true"></span>Tribes of Galway</a>
    <nav class="nav__links" aria-label="Main">
      ${navLinks}
    </nav>
    <div class="nav__actions">
      <a class="btn btn--primary" href="${p}map.html">${MAIN}</a>
    </div>
    <button class="nav__toggle" type="button" aria-expanded="false" aria-label="Menu">
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 5h14M2 13h14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
    </button>
  </div>
</header>

<main id="top"${home ? '' : ' class="inner"'}>
${body}
</main>

<footer class="footer closing" id="contact" aria-labelledby="close-h">
  <div class="wrap">
    <div class="closing__cta close--word">
      <div class="section-head--split">
        <div><h2 id="close-h">Every tribal site on one map</h2><p class="t-lead">${places.length} houses, churches, gates and lanes in the old town.</p></div>
        <a class="btn btn--primary" href="${p}map.html">${MAIN}${arrow}</a>
      </div>
      <p class="close__word" aria-hidden="true">Tribes of Galway</p>
    </div>
    <div class="closing__links">
      <div class="grid">
        <div class="span-6 stack-4">
          <a class="nav__logo" href="${p}index.html"><span class="mark" data-mark="stack" aria-hidden="true"></span>Tribes of Galway</a>
          <p class="footer__lede">The fourteen families of Galway, their houses and their stories.</p>
        </div>
        <div class="span-2 footer__col"><h3>Tribes</h3><ul><li><a href="${p}tribes/lynch.html">Lynch</a></li><li><a href="${p}tribes/blake.html">Blake</a></li><li><a href="${p}tribes/browne.html">Browne</a></li><li><a href="${p}tribes/index.html">All fourteen</a></li></ul></div>
        <div class="span-2 footer__col"><h3>Explore</h3><ul><li><a href="${p}map.html">Map</a></li><li><a href="${p}places/index.html">Historic sites</a></li><li><a href="${p}neighbourhoods.html">Neighbourhoods</a></li></ul></div>
        <div class="span-2 footer__col"><h3>More</h3><ul><li><a href="${p}families.html">Other families</a></li><li><a href="${p}about.html">About</a></li></ul></div>
      </div>
      <div class="footer__legal">
        <span>&copy; 2026 Tribes of Galway</span>
        <a class="credits" href="${p}about.html#credits">Photographs via Wikimedia Commons · map &copy; OpenStreetMap, CARTO</a>
      </div>
    </div>
  </div>
</footer>
<nav class="actionbar" aria-label="Quick actions">
  <a class="btn btn--primary" href="${p}map.html">${MAIN}</a>
</nav>
${placeData}
${map ? `<script src="${p}assets/vendor/leaflet.js"></script>\n<script src="${p}assets/map.js"></script>` : ''}
<script type="module" src="${p}assets/system.js"></script>
<script type="module" src="${p}assets/motion/motion.js"></script>
<script type="module" src="${p}assets/layout/layout.js"></script>
</body>
</html>
`;
}

// ---------- Home ----------
const pick = (ids) => ids.map((id) => places.find((x) => x.id === id));
const half = Math.ceil(tribes.length / 2);
const tribeRows = (list) => `<ul class="rows">${list.map((t) => `<li><a class="rows__name" href="tribes/${t.slug}.html">${esc(t.name)}</a><span class="rows__value t-small muted">${placesOf(t.slug).length} site${placesOf(t.slug).length === 1 ? "" : "s"}</span></li>`).join('')}</ul>`;

out('index.html', page({
  file: 'index.html', home: true, map: true, moment: true,
  title: 'Tribes of Galway: the fourteen families who ran the medieval town',
  desc: `The houses, churches, gates and lanes of Galway’s fourteen merchant families: ${places.length} historic sites on a map of the old town.`,
  body: `
  <section class="hero hero--place" data-enter aria-labelledby="hero-h">
    ${photo('hero', '', { cls: 'hero__bg', eager: true })}
    <div class="wrap"><div class="hero-text">
      <div class="hero__text">
        <h1 id="hero-h">The 14 families who ran medieval Galway</h1>
        <p class="hero__lead">Walk ${places.length} sites where the tribes lived, traded, prayed and fought, from the Spanish Arch to Eyre Square.</p>
        <div class="btn-row"><a class="btn btn--primary" href="map.html">${MAIN}${arrow}</a></div>
      </div>
    </div></div>
  </section>

  <section class="section" id="houses" aria-labelledby="houses-h">
    <div class="wrap grid grid--top">
      <div class="span-5">
        <div class="section-head">
          <h2 id="houses-h">Tribal houses in the old town</h2>
          <p>Drag and zoom the map. Every pin opens the history of that house, gate or church.</p>
        </div>
        <ul class="rows">
          ${pick(['lynchs-castle', 'browne-doorway', 'blakes-castle', 'kirwans-lane', 'red-earl']).map((x) => `<li><a class="rows__name" href="places/${x.id}.html">${esc(x.title)}</a><span class="rows__value t-small muted">${esc(famNames(x))}</span></li>`).join('\n          ')}
        </ul>
        <p style="margin-top: var(--s-5)"><a class="link" href="places/index.html">All ${places.length} sites</a></p>
      </div>
      <div class="span-7"><div class="tg-map tg-map--home" data-map="preview" role="region" aria-label="Map of the tribal sites in Galway's old town"></div></div>
    </div>
  </section>

  <section class="section" id="tribes" aria-labelledby="tribes-h">
    <div class="wrap">
      <div class="section-head--split">
        <div><h2 id="tribes-h">The fourteen tribes</h2><p>Twelve Anglo-Norman families and two of Gaelic Irish descent.</p></div>
        <a class="link" href="tribes/index.html">Meet every family</a>
      </div>
      <div class="grid grid--top">
        <div class="span-6">${tribeRows(tribes.slice(0, half))}</div>
        <div class="span-6">${tribeRows(tribes.slice(half))}</div>
      </div>
      <div class="grid tribe-strip" style="margin-top: var(--s-7)">
        ${pick(['lynchs-castle', 'browne-doorway', 'st-nicholas', 'tigh-neachtain']).map((x) => `<a class="span-3 strip-photo" href="places/${x.id}.html">${photo(x.photo, '', { alt: x.title })}</a>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="section statement" id="name" data-moment="word-highlight" aria-label="The name">
    <div class="wrap">
      <p class="t-label">The name</p>
      <p class="mo-wh__text">In the 1660s the idea of “the Tribes of Galway” took hold: the town’s notable merchant families, set apart by wealth, office and marriage. The name outlived their <strong>power</strong> by three centuries.</p>
    </div>
  </section>

  <section class="section" id="sites" aria-labelledby="sites-h">
    <div class="wrap">
      <div class="section-head--split">
        <div><h2 id="sites-h">Historic sites to start with</h2><p>Long reads from the research, each tied to a place you can stand in.</p></div>
        <a class="link" href="places/index.html">See every site</a>
      </div>
      <div class="grid story-row">
        ${pick(['lynch-window', 'spanish-arch', 'french-mansion']).map((x) => placeCard(x, '')).join('\n        ')}
      </div>
    </div>
  </section>`,
}));

// ---------- Tribes index ----------
out('tribes/index.html', page({
  file: 'tribes/index.html', current: 'tribes',
  title: 'The fourteen tribes: Tribes of Galway',
  desc: 'Athy, Blake, Bodkin, Browne, D’Arcy, Deane, Font, French, Joyce, Kirwan, Lynch, Martin, Morris and Skerrett.',
  body: `
  <section class="page-head"><div class="wrap">
    <h1>The fourteen tribes</h1>
    <p>Merchant families who held Galway’s offices, traded wine, salt and hides with France and Spain, and built the town’s stone houses.</p>
  </div></section>
  <section class="section"><div class="wrap">
    <ul class="grid tribe-grid">
      ${tribes.map((t) => `<li class="span-4"><a class="tribe-tile" href="${t.slug}.html">${crest(t)}<span><span class="tribe-tile__name">${esc(t.name)}</span><span class="tribe-tile__line">${esc(t.line)}</span><span class="t-small muted">${placesOf(t.slug).length} site${placesOf(t.slug).length === 1 ? "" : "s"}</span></span></a></li>`).join('\n      ')}
    </ul>
    <p style="margin-top: var(--s-7)"><a class="link" href="../families.html">Other families of the town</a></p>
  </div></section>`,
}));

// ---------- Tribe pages ----------
for (const t of tribes) {
  const own = placesOf(t.slug);
  out(`tribes/${t.slug}.html`, page({
    file: `tribes/${t.slug}.html`, current: 'tribes', map: true,
    title: `The ${t.name} family: Tribes of Galway`,
    desc: `${t.line} ${own.length} sites in Galway connected with the ${t.name} family.`,
    body: `
  <section class="page-head"><div class="wrap">
    <p class="t-label muted"><a href="index.html">The fourteen tribes</a></p>
    <div class="tribe-head">${crest(t, 'crest--lg')}<div><h1>The ${esc(t.name)} family</h1><p>${esc(t.line)}</p></div></div>
  </div></section>
  <section class="section"><div class="wrap grid grid--top">
    <div class="span-5">
      <h2>${own.length} ${own.length === 1 ? 'site' : 'sites'} in the town</h2>
      <ul class="place-list">${own.map((x) => `<li><a href="../places/${x.id}.html">${esc(x.title)}</a><span class="t-small">${esc(x.street)}</span></li>`).join('')}</ul>
    </div>
    <div class="span-7"><div class="tg-map tg-map--home" data-map="preview" data-family="${t.slug}" role="region" aria-label="Map of ${esc(t.name)} sites"></div></div>
  </div></section>
  <section class="section"><div class="wrap">
    <div class="grid story-row cards-wrap">
      ${own.map((x) => placeCard(x, '../')).join('\n      ')}
    </div>
  </div></section>`,
  }));
}

// ---------- Sites index and site pages ----------
const groups = [['all', 'The whole town'], ...tribes.map((t) => [t.slug, t.name]), ['others', 'Other families']];
out('places/index.html', page({
  file: 'places/index.html', current: 'places',
  title: 'Historic sites: Tribes of Galway',
  desc: `${places.length} houses, churches, gates and lanes in Galway connected with the tribes and other notable families.`,
  body: `
  <section class="page-head"><div class="wrap">
    <h1>${places.length} historic sites</h1>
    <p>Each one a long read from the research, tied to a building or street you can still find in the old town.</p>
  </div></section>
  ${groups.map(([slug, name]) => {
    const list = slug === 'others' ? places.filter((x) => x.families.every((f) => !tribes.some((t) => t.slug === f) && f !== 'all')) : places.filter((x) => x.families[0] === slug);
    if (!list.length) return '';
    return `<section class="section section--tight" id="${slug}"><div class="wrap">
    <h2>${esc(name)}</h2>
    <div class="grid story-row cards-wrap">
      ${list.map((x) => placeCard(x, '../')).join('\n      ')}
    </div>
  </div></section>`;
  }).join('\n  ')}`,
}));

for (const pl of places) {
  const siblings = places.filter((x) => x.id !== pl.id && x.families.some((f) => pl.families.includes(f))).slice(0, 6);
  out(`places/${pl.id}.html`, page({
    file: `places/${pl.id}.html`, current: 'places', map: true,
    title: `${pl.title}: Tribes of Galway`,
    desc: pl.summary,
    body: `
  <section class="page-head"><div class="wrap">
    <p class="t-label muted">${pl.families.map((f) => `<a href="../${famHref(f)}">${esc(famBy[f]?.name || f)}</a>`).join(' · ')} · ${esc(pl.street)}</p>
    <h1 style="margin-top: var(--s-4)">${esc(pl.title)}</h1>
  </div></section>
  <section class="section section--flush"><div class="wrap">${photo(pl.photo, '../', { cls: 'photo--wide', alt: photos[pl.photo]?.alt })}</div></section>
  <section class="section"><div class="wrap longread">
    <article class="longread__body">
      ${pl.paras.map((x) => `<p>${esc(x)}</p>`).join('\n      ')}
      <p class="t-small muted">From “The Tribes Experience of Galway &amp; other notable families” by Adrian Martyn, edited by Pete Kelly.</p>
    </article>
    <aside class="longread__aside">
      <div class="tg-map tg-map--preview" data-map="preview" data-focus="${pl.id}" role="region" aria-label="Map of ${esc(pl.title)}"></div>
      <p class="t-small muted">${esc(pl.street)}. Pin position approximate.</p>
      ${siblings.length ? `<div><p class="t-label muted">More ${esc(famNames(pl))} sites</p><ul class="place-list">${siblings.map((x) => `<li><a href="${x.id}.html">${esc(x.title)}</a><span class="t-small">${esc(x.street)}</span></li>`).join('')}</ul></div>` : ''}
    </aside>
  </div></section>`,
  }));
}

// ---------- Map ----------
const filterable = allFamilies.filter((f) => placesOf(f.slug).length);
out('map.html', page({
  file: 'map.html', map: true,
  title: 'Map of the old town: Tribes of Galway',
  desc: `All ${places.length} tribal sites in Galway on one map you can drag and zoom.`,
  body: `
  <section class="page-head page-head--tight"><div class="wrap">
    <h1>Map of the old town</h1>
    <p>Drag and zoom like any map. Choose a family to see only its sites, and tap a pin to read its history.</p>
  </div></section>
  <section class="section section--flush"><div class="wrap">
    <div class="map-tools">
      <label for="map-filter">Show sites of
        <select id="map-filter" data-map-filter>
          <option value="">Every family</option>
          ${filterable.map((f) => `<option value="${f.slug}">${esc(f.name)}</option>`).join('')}
        </select>
      </label>
      <p class="t-small muted">${places.length} sites. Pin positions are approximate.</p>
    </div>
    <div class="tg-map tg-map--full" data-map="full" role="region" aria-label="Map of Galway's old town with the tribal sites"></div>
  </div></section>`,
}));

// ---------- Neighbourhoods ----------
out('neighbourhoods.html', page({
  file: 'neighbourhoods.html', current: 'areas',
  title: 'Neighbourhoods: Tribes of Galway',
  desc: 'Walk the parts of Galway where the tribes lived and traded, from the Latin Quarter to Woodquay.',
  body: `
  <section class="page-head"><div class="wrap">
    <h1>Walk the old town</h1>
    <p>Four parts of the city where the tribes lived, traded and prayed, and the sites to find in each.</p>
  </div></section>
  ${areas.map((a) => {
    const inArea = places.filter((x) => x.area === a.slug);
    return `<section class="section section--tight" id="${a.slug}"><div class="wrap grid grid--top">
    <div class="span-6">
      <h2>${esc(a.name)}</h2>
      <p style="margin-bottom: var(--s-5)">${esc(a.line)}</p>
      <ul class="place-list place-list--cols">${inArea.map((x) => `<li><a href="places/${x.id}.html">${esc(x.title)}</a><span class="t-small">${esc(x.street)}</span></li>`).join('')}</ul>
    </div>
    <div class="span-6">${photo(a.photo, '', { alt: a.name })}</div>
  </div></section>`;
  }).join('\n  ')}`,
}));

// ---------- Other families ----------
out('families.html', page({
  file: 'families.html',
  title: 'Other families: Tribes of Galway',
  desc: 'The lords, clans and townspeople who shaped Galway beside the fourteen tribes.',
  body: `
  <section class="page-head"><div class="wrap">
    <h1>Other families of Galway</h1>
    <p>The lords who founded the town, the Gaelic families around it, and townspeople who outlasted many of the tribes.</p>
  </div></section>
  <section class="section"><div class="wrap">
    <div class="grid story-row cards-wrap">
      ${families.map((f) => placesOf(f.slug).map((x) => `<div class="span-4" id="${f.slug}">${placeCard(x, '', '')}</div>`).join('')).join('\n      ')}
    </div>
  </div></section>`,
}));

// ---------- About ----------
const usedPhotos = Object.values(photos);
out('about.html', page({
  file: 'about.html', current: 'about',
  title: 'About the project: Tribes of Galway',
  desc: 'Where the histories on this site come from, and the photographs and map data it uses.',
  body: `
  <section class="page-head"><div class="wrap">
    <h1>About the Tribes of Galway Experience</h1>
    <p>A guide to the fourteen families of Galway and the town they built, site by site.</p>
  </div></section>
  <section class="section"><div class="wrap longread">
    <article class="longread__body">
      <h2>Where the histories come from</h2>
      <p>Every site on this website is drawn from “The Tribes Experience of Galway &amp; other notable families”, researched and written by Adrian Martyn and edited by Pete Kelly.</p>
      <h2 id="credits">Photographs and map</h2>
      <p>The photographs are stand-ins from Wikimedia Commons until photographs are commissioned for the project. Map data &copy; OpenStreetMap contributors, map tiles &copy; CARTO.</p>
      <ul class="place-list">${usedPhotos.map((x) => `<li><a href="${esc(x.page)}">${esc(x.alt)}</a><span class="t-small">${esc(x.artist || 'Unknown author')}, ${esc(x.license)}</span></li>`).join('')}</ul>
    </article>
  </div></section>`,
}));

fs.writeFileSync(path.join(here, 'favicon.svg'), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 56"><path d="M2 2h44v22c0 16-10 25-22 30C12 49 2 40 2 24z" fill="#d9776f"/><text x="24" y="34" text-anchor="middle" font-family="Georgia, serif" font-size="26" fill="#14181b">T</text></svg>');
console.log(`built ${places.length} site pages, ${tribes.length} tribe pages`);
