// Builds the static site from src/content.mjs: node build.mjs
// Every page shares one head, nav and footer; pages under tribes/ and stories/ use the "../" prefix.
import fs from 'node:fs';
import path from 'node:path';
import { tribes, families, stories, places, areas, verdictLabel } from './src/content.mjs';

const here = path.dirname(new URL(import.meta.url).pathname);
const out = (file, html) => { const f = path.join(here, file); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, html); };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const tribeBy = Object.fromEntries(tribes.map((t) => [t.slug, t]));
const arrow = '<svg class="m-arrow" viewBox="0 0 12 12" aria-hidden="true"><path class="m-arrow__stem" d="M1 6h8"/><path class="m-arrow__head" d="M4.5 2.5 8 6l-3.5 3.5"/></svg>';
const MAIN = 'Explore the map';

const crest = (t, cls = '') => `<svg class="crest ${cls}" viewBox="0 0 48 56" aria-hidden="true"><path d="M2 2h44v22c0 16-10 25-22 30C12 49 2 40 2 24z" fill="currentColor"/><text x="24" y="33" text-anchor="middle">${esc(t.name.charAt(0))}</text></svg>`;
// A placeholder photograph: an SVG frame naming the picture that goes here, at the slot's own ratio
const RATIOS = { '43': [1200, 900], '45': [960, 1200], '11': [1000, 1000], 'wide': [1600, 700], 'hero': [2400, 900] };
const phSrc = (label, ratio) => {
  const [w, h] = RATIOS[ratio];
  const words = ('Photograph to come: ' + label).split(' '); const lines = []; let line = '';
  for (const word of words) { if ((line + ' ' + word).trim().length > 34) { lines.push(line.trim()); line = word; } else line += ' ' + word; }
  lines.push(line.trim());
  const fs_ = Math.round(Math.min(w, h) / 22), y0 = h / 2 + fs_ * 0.8;
  const text = lines.map((l, i) => `<text x='${w / 2}' y='${y0 + i * fs_ * 1.4}' text-anchor='middle' font-family='Arial, sans-serif' font-size='${fs_}' fill='%235b6168'>${esc(l).replace(/#/g, '%23').replace(/'/g, '&#39;')}</text>`).join('');
  const c = Math.round(fs_ * 1.6), cx = w / 2 - c / 2, cy = h / 2 - c * 1.5;
  const cam = `<path transform='translate(${cx} ${cy}) scale(${c / 24})' d='M4 8h3l2-3h6l2 3h3v11H4z M12 9.5a3.5 3.5 0 1 0 0 7a3.5 3.5 0 1 0 0-7' fill='none' stroke='%235b6168' stroke-width='1.3'/>`;
  return `data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}' width='${w}' height='${h}'><rect width='100%' height='100%' fill='%23e4ded2'/>${cam}${text}</svg>`;
};
const ph = (label, ratio = '43', extra = '') => { const [w, h] = RATIOS[ratio]; return `<img class="ph-img ph--${ratio} ${extra}" src="${phSrc(label, ratio)}" width="${w}" height="${h}" alt="${esc(label)}" loading="lazy" data-source="stand-in" data-subject="${esc(label)}">`; };
const verdict = (v) => `<span class="verdict verdict--${v}">${verdictLabel[v]}</span>`;

function page({ file, title, desc, body, current = '', home = false, map = false, moment = false }) {
  const depth = file.split('/').length - 1;
  const p = '../'.repeat(depth);
  const nav = [['tribes/index.html', 'Tribes', 'tribes'], ['stories/index.html', 'Stories', 'stories'], ['neighbourhoods.html', 'Neighbourhoods', 'areas'], ['about.html', 'About', 'about']];
  const navLinks = nav.map(([href, word, key]) => `<div class="nav__item"><a class="nav__link" href="${p}${href}"${key === current ? ' aria-current="page"' : ''}>${word}</a></div>`).join('\n      ');
  const placeData = map ? `<script type="application/json" id="places-data">${JSON.stringify(places)}</script>` : '';
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
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${p}favicon.svg" type="image/svg+xml">
<meta name="theme-color" content="#f4f1ea">
<!-- <link rel="canonical" href="https://www.tribesofgalway.com/"> once the domain is live -->
<meta name="site-kind" content="other">
<meta name="page-type" content="place">
<meta name="page-kind" content="place">
<script>try{var t=localStorage.getItem('tg-theme');if(t)document.documentElement.dataset.theme=t}catch(e){}</script>
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
  --p-bg: #f4f1ea; --p-surface: #ebe6db; --p-ink: #1e2328; --p-muted: #5b6168;
  --p-accent: #1f5c6b; --p-accent-ink: #f4f1ea; --p-action: #1f5c6b; --p-action-ink: #f4f1ea;
  --p-inv-bg: #1e2328; --p-inv-surface: #2a2f34; --p-inv-ink: #f4f1ea; --p-inv-muted: #9b9c9a;
  --p-inv-accent: #f4f1ea; --p-inv-accent-ink: #1e2328; --p-inv-action: #f4f1ea; --p-inv-action-ink: #1e2328;
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
<!-- type: place (a heritage site about the city: photographs, type and flat colour; no effects)
     deal: hero place, nav split, close word, footer columns (no opening hours to show), rhythm colour-band,
     buttons arrow, mark stack; palette: Alan's limestone, slate and Galway Bay blue (start.mjs brand), type besley
     moments: word-highlight (home, the statement section) -->
<header class="nav nav--split">
  <div class="wrap nav__bar">
    <a class="skip-link" href="#top">Skip to content</a>
    <a class="nav__logo" href="${p}index.html"><span class="mark" data-mark="stack" aria-hidden="true"></span>Tribes of Galway</a>
    <nav class="nav__links" aria-label="Main">
      ${navLinks}
    </nav>
    <div class="nav__actions">
      <button class="theme-toggle" type="button" data-theme-toggle aria-label="Switch to dark mode">
        <svg class="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>
        <svg class="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
      </button>
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
        <div><h2 id="close-h">Every tribal house on one map</h2><p class="t-lead">Ten places in the old town, with more to add.</p></div>
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
        <div class="span-2 footer__col"><h3>Explore</h3><ul><li><a href="${p}map.html">Map</a></li><li><a href="${p}stories/index.html">Stories</a></li><li><a href="${p}neighbourhoods.html">Neighbourhoods</a></li></ul></div>
        <div class="span-2 footer__col"><h3>More</h3><ul><li><a href="${p}families.html">Other families</a></li><li><a href="${p}about.html">About</a></li></ul></div>
      </div>
      <div class="footer__legal">
        <span>&copy; 2026 Tribes of Galway &nbsp; <button class="link-btn" type="button" data-theme-toggle-footer>Light or dark mode</button></span>
        <span>Map data &copy; OpenStreetMap contributors and CARTO</span>
      </div>
    </div>
  </div>
</footer>
<nav class="actionbar" aria-label="Quick actions">
  <a class="btn btn--primary" href="${p}map.html">${MAIN}</a>
</nav>
${placeData}
${map ? `<script src="${p}assets/vendor/leaflet.js"></script>\n<script src="${p}assets/map.js"></script>` : ''}
<script src="${p}assets/theme.js"></script>
<script type="module" src="${p}assets/system.js"></script>
<script type="module" src="${p}assets/motion/motion.js"></script>
<script type="module" src="${p}assets/layout/layout.js"></script>
</body>
</html>
`;
}

// ---------- Home ----------
const featuredPlaces = ['lynch-castle', 'browne-doorway', 'blakes-castle', 'kirwans-lane'].map((id) => places.find((x) => x.id === id));
const half = Math.ceil(tribes.length / 2);
const tribeRows = (list) => `<ul class="rows">${list.map((t) => `<li><a class="rows__name" href="tribes/${t.slug}.html">${esc(t.name)}</a><span class="rows__value t-small muted">${t.origin}</span></li>`).join('')}</ul>`;
const homeStories = ['lynch-window', 'claddagh-ring', 'tribes-name'].map((s) => stories.find((x) => x.slug === s));

out('index.html', page({
  file: 'index.html', home: true, map: true, moment: true,
  title: 'Tribes of Galway: the fourteen families who ran the medieval city',
  desc: 'The houses, streets and stories of Galway’s fourteen merchant families, on a map of the old town.',
  body: `
  <section class="hero hero--place" data-enter aria-labelledby="hero-h">
    <img class="hero__bg ph-img" data-phone-fill src="${phSrc('the Spanish Arch and the Corrib at evening', 'hero')}" alt="The Spanish Arch and the River Corrib at evening" fetchpriority="high" data-source="stand-in" data-subject="the Spanish Arch">
    <div class="wrap"><div class="hero-text">
      <div class="hero__text">
        <h1 id="hero-h">The 14 families who ran medieval Galway</h1>
        <p class="hero__lead">Fourteen merchant families ran the walled town from 1484 to 1654.</p>
        <div class="btn-row"><a class="btn btn--primary" href="map.html">${MAIN}${arrow}</a></div>
      </div>
    </div></div>
  </section>

  <section class="section" id="houses" data-place="visit" aria-labelledby="houses-h">
    <div class="wrap grid grid--top">
      <div class="span-6">
        <div class="section-head">
          <h2 id="houses-h">Tribal houses in the old town</h2>
          <p>Carved doorways, tower houses and lanes, all inside the line of the old town wall.</p>
        </div>
        <ul class="rows">
          ${featuredPlaces.map((x) => `<li><a class="rows__name" href="${x.href}">${esc(x.name)}</a><span class="rows__value t-small muted">${esc(tribeBy[x.tribe]?.name || '')}</span><p>${esc(x.line)}</p></li>`).join('\n          ')}
        </ul>
        <p style="margin-top: var(--s-5)"><a class="link" href="map.html">See all ten places</a></p>
      </div>
      <div class="span-6 start-7"><div class="tg-map tg-map--preview" data-map="preview" role="region" aria-label="Map of the tribal houses in Galway's old town"></div></div>
    </div>
  </section>

  <section class="section g2" id="tribes" style="--hm: 2" aria-labelledby="tribes-h">
    <div class="wrap">
      <div class="group">
        <div class="section-head--split">
          <div><h2 id="tribes-h">The fourteen tribes</h2><p>Twelve Anglo-Norman families and two Gaelic Irish ones.</p></div>
          <a class="link" href="tribes/index.html">Meet every family</a>
        </div>
        <div class="grid grid--top">
          <div class="span-6">${tribeRows(tribes.slice(0, half))}</div>
          <div class="span-6">${tribeRows(tribes.slice(half))}</div>
        </div>
      </div>
      <div class="grid tribe-strip">
        <a class="span-3" href="tribes/lynch.html">${ph('The Lynch arms on Lynch’s Castle', '11')}</a>
        <a class="span-3" href="tribes/browne.html">${ph('Carving on the Browne Doorway', '11')}</a>
        <a class="span-3" href="tribes/blake.html">${ph('Stonework of Blake’s Castle', '11')}</a>
        <a class="span-3" href="tribes/kirwan.html">${ph('Kirwan’s Lane, looking toward Cross Street', '11')}</a>
      </div>
    </div>
  </section>

  <section class="section statement" id="name" data-moment="word-highlight" aria-label="The name">
    <div class="wrap">
      <p class="t-label">The name</p>
      <p class="mo-wh__text">Cromwell’s soldiers meant “the Tribes of Galway” as an insult. The families took the name and wore it <strong>with pride</strong>, and the city still flies their fourteen flags over Eyre Square.</p>
    </div>
  </section>

  <section class="section" id="stories" aria-labelledby="stories-h">
    <div class="wrap">
      <div class="section-head--split">
        <div><h2 id="stories-h">Folklore of the tribes</h2><p>Each story marked fact or legend, by what the records support.</p></div>
        <a class="link" href="stories/index.html">Read all six stories</a>
      </div>
      <div class="grid story-row">
        ${homeStories.map((s) => `<a class="story-card span-4" href="stories/${s.slug}.html">${ph(s.photo)}${verdict(s.verdict)}<h3>${esc(s.title)}</h3><p>${esc(s.line)}</p></a>`).join('\n        ')}
      </div>
    </div>
  </section>
  `,
}));

// ---------- Tribes index ----------
out('tribes/index.html', page({
  file: 'tribes/index.html', current: 'tribes',
  title: 'The fourteen tribes: Tribes of Galway',
  desc: 'Athy, Blake, Bodkin, Browne, D’Arcy, Deane, Font, French, Joyce, Kirwan, Lynch, Martin, Morris and Skerrett.',
  body: `
  <section class="page-head"><div class="wrap">
    <h1>The fourteen tribes</h1>
    <p>Twelve Anglo-Norman families and two Gaelic Irish ones, who traded wine, salt and hides and governed Galway for two centuries.</p>
  </div></section>
  <section class="section"><div class="wrap">
    <ul class="grid tribe-grid">
      ${tribes.map((t) => `<li class="span-4"><a class="tribe-tile" href="${t.slug}.html">${crest(t)}<span><span class="tribe-tile__name">${esc(t.name)}</span><span class="tribe-tile__line">${esc(t.line)}</span></span></a></li>`).join('\n      ')}
    </ul>
    <p style="margin-top: var(--s-7)"><a class="link" href="../families.html">Other families of the city</a></p>
  </div></section>`,
}));

// ---------- Tribe pages (Lynch written out as the model long read; the rest wait for the Phase 1 text) ----------
const lynchBody = `
      <h2 id="origins">Origins</h2>
      <p>The Lynches came to Galway with the Anglo-Norman settlers in the 1200s. Within two generations they were among the richest merchants in the town, shipping hides and wool to France and Spain and bringing back wine and salt.</p>
      <h2 id="power">The mayors of Galway</h2>
      <p>In 1484 a charter from Richard III let Galway elect its own mayor. The first was Pierce Lynch. Over the next 170 years a Lynch held the office 84 times, more than any other family.</p>
      <blockquote class="pull">A Lynch held the mayoralty 84 times between 1485 and 1654.</blockquote>
      <h2 id="castle">Lynch’s Castle</h2>
      <p>The family’s stone town house still stands at the corner of Shop Street and Abbeygate Street. Its walls carry the Lynch arms and the royal arms of Henry VII, and its windows keep their carved stone frames. It is a bank today, and its ground floor is open in business hours.</p>
      ${ph('Lynch’s Castle from Shop Street', 'wide')}
      <h2 id="legend">The legend of the window</h2>
      <p>Galway’s best-known story is a Lynch story: the mayor who hanged his own son for murder in 1493. The stone plaque on Market Street tells it as fact. The records of the time are silent, and historians still argue over it.</p>
      <p><a class="link" href="../stories/lynch-window.html">Fact or legend: read the story</a></p>
      <h2 id="after">After 1654</h2>
      <p>The town fell to Cromwell’s army in 1652, and the tribes lost their houses and their offices. Many Lynches left Ireland. One branch reached Buenos Aires in the 1700s; Ernesto “Che” Guevara Lynch was among its descendants.</p>`;

for (const t of tribes) {
  const own = places.filter((x) => x.tribe === t.slug);
  const tStories = stories.filter((s) => s.tribe === t.slug);
  const body = t.slug === 'lynch' ? lynchBody : `
      <h2 id="origins">Origins</h2>
      <div class="draft-note">The ${esc(t.name)} long read from the Phase 1 research goes here: origins, the family in power, its houses, its people, and what became of it.</div>
      ${ph(`A place connected with the ${t.name} family`, 'wide')}`;
  out(`tribes/${t.slug}.html`, page({
    file: `tribes/${t.slug}.html`, current: 'tribes', map: own.length > 0,
    title: `The ${t.name} family: Tribes of Galway`,
    desc: `${t.line} The ${t.name} family, one of the fourteen tribes of Galway.`,
    body: `
  <section class="page-head"><div class="wrap">
    <p class="t-label muted"><a href="index.html">The fourteen tribes</a></p>
    <div style="display:flex; gap: var(--s-6); align-items: center; margin-top: var(--s-4)">${crest(t, 'crest--lg')}<h1 style="margin:0">The ${esc(t.name)} family</h1></div>
    <p style="margin-top: var(--s-5)">${esc(t.line)}</p>
  </div></section>
  <section class="section"><div class="wrap longread">
    <article class="longread__body">${body}
    </article>
    <aside class="longread__aside">
      <dl class="facts">
        <div><dt>Origin</dt><dd>${t.origin}</dd></div>
        ${t.slug === 'lynch' ? '<div><dt>Mayors</dt><dd>84, from 1485 to 1654</dd></div><div><dt>House</dt><dd>Lynch’s Castle, Shop Street</dd></div>' : ''}
      </dl>
      ${own.length ? `<div class="tg-map tg-map--preview" data-map="preview" data-tribe="${t.slug}" role="region" aria-label="Map of ${esc(t.name)} places"></div>
      <ul class="place-list">${own.map((x) => `<li>${esc(x.name)}<span class="t-small">${esc(x.line)}</span></li>`).join('')}</ul>` : ''}
      ${tStories.length ? `<div><p class="t-label muted">Stories</p><ul class="place-list">${tStories.map((s) => `<li><a href="../stories/${s.slug}.html">${esc(s.title)}</a> ${verdict(s.verdict)}</li>`).join('')}</ul></div>` : ''}
    </aside>
  </div></section>`,
  }));
}

// ---------- Stories ----------
out('stories/index.html', page({
  file: 'stories/index.html', current: 'stories',
  title: 'Stories, fact and legend: Tribes of Galway',
  desc: 'Short reads from Galway’s folklore, each marked fact, legend or a little of both.',
  body: `
  <section class="page-head"><div class="wrap">
    <h1>Stories, fact and legend</h1>
    <p>The tales the city tells about its tribes. Each one is marked by what the records support.</p>
    <ul class="legend" style="margin-top: var(--s-5)"><li>${verdict('fact')} The records support it</li><li>${verdict('mixed')} True at the core, grown in the telling</li><li>${verdict('legend')} No record supports it</li></ul>
  </div></section>
  <section class="section"><div class="wrap">
    <div class="grid grid--top" style="row-gap: var(--s-8)">
      ${stories.map((s) => `<a class="story-card span-4" href="${s.slug}.html">${ph(s.photo)}${verdict(s.verdict)}<h3>${esc(s.title)}</h3><p>${esc(s.line)}</p></a>`).join('\n      ')}
    </div>
  </div></section>`,
}));

const storyText = {
  'lynch-window': `<p>In 1493, the story goes, James Lynch FitzStephen, mayor of Galway, sent his son Walter to trial for killing a Spanish guest. Walter was found guilty, and when no one would carry out the sentence, the father hanged him himself from a window of the family house.</p>
      <h2>What the records say</h2>
      <p>No record from the 1490s mentions the hanging. The story first appears in print about a century later, and the plaque on Market Street was put up in the 1850s. It may hold a memory of a real case; as told, it is a legend.</p>`,
  'tribes-name': `<p>After Galway surrendered to Parliamentary forces in 1652, Cromwell’s officers used “the Tribes of Galway” as a sneer at the families who had held the town against them. The families took the name up and used it of themselves.</p>
      <h2>What the records say</h2>
      <p>The phrase is well recorded from the later 1600s on. Today the fourteen tribal flags fly over Eyre Square, and each of the city’s roundabouts on the ring road carries a tribe’s name.</p>`,
};
for (const s of stories) {
  const t = s.tribe ? tribeBy[s.tribe] : null;
  out(`stories/${s.slug}.html`, page({
    file: `stories/${s.slug}.html`, current: 'stories',
    title: `${s.title}: Tribes of Galway`,
    desc: s.line,
    body: `
  <section class="page-head"><div class="wrap">
    <p class="t-label muted"><a href="index.html">Stories</a></p>
    <h1 style="margin-top: var(--s-4)">${esc(s.title)}</h1>
    ${verdict(s.verdict)}
  </div></section>
  <section class="section"><div class="wrap longread">
    <article class="longread__body">
      ${ph(s.photo, 'wide')}
      <p>${esc(s.line)}</p>
      ${storyText[s.slug] || '<div class="draft-note">The full short read from the Phase 1 research goes here, with what is fact, what is legend, and the sources.</div>'}
    </article>
    <aside class="longread__aside">
      ${t ? `<p><a class="link" href="../tribes/${t.slug}.html">The ${esc(t.name)} family</a></p>` : ''}
      <p><a class="link" href="../map.html">See it on the map</a></p>
    </aside>
  </div></section>`,
  }));
}

// ---------- Map ----------
out('map.html', page({
  file: 'map.html', map: true,
  title: 'Map of the tribal houses: Tribes of Galway',
  desc: 'Every tribal house, gathering place and story location in Galway’s old town, on one map.',
  body: `
  <section class="page-head" style="padding-bottom: var(--s-6)"><div class="wrap">
    <h1>Map of the old town</h1>
    <p>Choose a family to see only its places. Tap a pin for its story.</p>
  </div></section>
  <section class="section" style="padding-top: 0"><div class="wrap">
    <div class="map-tools">
      <label for="map-filter">Show places of
        <select id="map-filter" data-map-filter>
          <option value="">All families</option>
          ${tribes.filter((t) => places.some((x) => x.tribe === t.slug)).map((t) => `<option value="${t.slug}">${esc(t.name)}</option>`).join('')}
        </select>
      </label>
      <ul class="legend"><li><span class="dot dot--house"></span>Family house</li><li><span class="dot dot--gathering"></span>Gathering place</li><li><span class="dot dot--story"></span>Where a story is set</li></ul>
    </div>
    <div class="tg-map tg-map--full" data-map="full" role="region" aria-label="Map of Galway's old town with the tribal places"></div>
    <ul class="place-list" style="margin-top: var(--s-7)">
      ${places.map((x) => `<li><a href="${x.href}">${esc(x.name)}</a><span class="t-small">${esc(x.line)}</span></li>`).join('\n      ')}
    </ul>
  </div></section>`,
}));

// ---------- Neighbourhoods ----------
out('neighbourhoods.html', page({
  file: 'neighbourhoods.html', current: 'areas',
  title: 'Neighbourhoods: Tribes of Galway',
  desc: 'Walk the parts of Galway where the tribes lived and traded, from the Latin Quarter to the Claddagh.',
  body: `
  <section class="page-head"><div class="wrap">
    <h1>Walk the old town</h1>
    <p>Four parts of the city where the tribes lived, traded and prayed, and what to find in each.</p>
  </div></section>
  ${areas.map((a, i) => {
    const inArea = places.filter((x) => x.area === a.slug);
    return `<section class="section" id="${a.slug}"><div class="wrap grid grid--top">
    <div class="span-6">
      <h2>${esc(a.name)}</h2>
      <p style="margin-bottom: var(--s-5)">${esc(a.line)}</p>
      <ul class="place-list">${inArea.map((x) => `<li><a href="${x.href}">${esc(x.name)}</a><span class="t-small">${esc(x.line)}</span></li>`).join('')}</ul>
    </div>
    <div class="span-6 start-7">${ph(a.name, '43')}</div>
  </div></section>`;
  }).join('\n  ')}`,
}));

// ---------- Other families ----------
out('families.html', page({
  file: 'families.html',
  title: 'Other families: Tribes of Galway',
  desc: 'The lords and clans who shaped Galway around the fourteen tribes.',
  body: `
  <section class="page-head"><div class="wrap">
    <h1>Other families of Galway</h1>
    <p>The lords who founded the town, and the clans it built its walls against.</p>
  </div></section>
  <section class="section"><div class="wrap grid grid--top" style="row-gap: var(--s-8)">
    ${families.map((f) => `<article class="story-card span-4">${ph(`A place connected with the ${f.name} family`)}<h3>${esc(f.name)}</h3><p>${esc(f.line)}</p>${f.story ? `<a class="link" href="stories/${f.story}.html">Read the story</a>` : ''}</article>`).join('\n    ')}
    <article class="story-card span-4"><div class="draft-note">More families from the Phase 1 research go here.</div></article>
  </div></section>`,
}));

// ---------- About ----------
out('about.html', page({
  file: 'about.html', current: 'about',
  title: 'About the project: Tribes of Galway',
  desc: 'Why this site exists, where its stories come from, and how to get in touch.',
  body: `
  <section class="page-head"><div class="wrap">
    <h1>About the Tribes of Galway Experience</h1>
    <p>A guide to the fourteen families of Galway, built on a hundred pages of research into their houses, gathering places and folklore.</p>
  </div></section>
  <section class="section"><div class="wrap longread">
    <article class="longread__body">
      <h2>Where the stories come from</h2>
      <div class="draft-note">A short account of the Phase 1 research, its sources and who wrote it goes here.</div>
      <h2>Get in touch</h2>
      <p>Corrections, family stories and photographs are welcome at <a href="mailto:hello@tribesofgalway.example">hello@tribesofgalway.example</a>.</p>
    </article>
  </div></section>`,
}));

// favicon: the stack mark on a limestone square
out('favicon.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 56"><path d="M2 2h44v22c0 16-10 25-22 30C12 49 2 40 2 24z" fill="#8c2f2b"/><text x="24" y="34" text-anchor="middle" font-family="Georgia, serif" font-size="26" fill="#f4f1ea">T</text></svg>');
console.log('built', fs.readdirSync(here).filter((f) => f.endsWith('.html')).length, 'top-level pages,', tribes.length, 'tribe pages,', stories.length, 'stories');
