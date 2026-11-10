// Tribes of Galway map: CARTO's vector street map of Galway (OpenStreetMap data), recoloured at load
// time into an old engraved-map look, with every historic site from #places-data as a pin.
// <div class="tg-map" data-map="full|preview" data-family="lynch" data-focus="lynchs-castle"></div>
(function () {
  const dataEl = document.getElementById('places-data');
  if (!dataEl || !window.maplibregl) return;
  const places = JSON.parse(dataEl.textContent);
  const prefix = document.documentElement.dataset.prefix || '';
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const OTHER = ['burke', 'fallon', 'nolan', 'ohallmhurain', 'oconchobhair', 'oflaithbertaigh'];
  const kind = (p) => (p.families.includes('all') ? 'gold' : p.families.some((f) => OTHER.includes(f)) ? 'blue' : 'red');

  // CARTO basemap key. It is public by design (it sits in every tile URL); restrict it to the site's domains in the CARTO dashboard.
  const CARTO_KEY = 'cb1_55xh_1_1ca0794f5cd18c43f0e13ea4';
  const STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';
  const transformRequest = (url) => (url.includes('cartocdn.com') && !/[?&]key=/.test(url) ? { url: url + (url.includes('?') ? '&' : '?') + 'key=' + CARTO_KEY } : undefined);
  const OLD_TOWN = [[-9.0570, 53.2690], [-9.0475, 53.2775]];

  // An old map by lamplight: sepia ground, ink-dark casings, brass roads, slate-teal water, spaced capitals.
  const C = {
    paper: '#1f1a14', land: '#231d16', landuse: '#262017', park: '#25271a', water: '#1a2c30', waterLine: '#2b4248',
    building: '#2f271e', buildingLine: '#40352a', casing: '#120f0b',
    minor: '#4d4030', sec: '#6e5c42', pri: '#8b7451', major: '#a3885a', path: '#6a5a42', rail: '#4d4030',
    road: '#cbb68d', place: '#e8d8b4', waterLabel: '#8db0b2', halo: '#1a1611',
  };

  function restyle(map) {
    for (const l of map.getStyle().layers) {
      const id = l.id, t = l.type;
      const paint = (k, v) => { try { map.setPaintProperty(id, k, v); } catch (e) { /* property not on this layer */ } };
      const layout = (k, v) => { try { map.setLayoutProperty(id, k, v); } catch (e) { /* ditto */ } };
      const hide = () => layout('visibility', 'none');
      if (t === 'background') { paint('background-color', C.paper); continue; }
      if (/^boundary|^aeroway|^housenumber|^water_shadow|^building-top/.test(id)) { hide(); continue; }
      if (t === 'fill') {
        if (/^water/.test(id)) paint('fill-color', C.water), paint('fill-outline-color', C.waterLine);
        else if (/^landcover|^park/.test(id)) paint('fill-color', C.park), paint('fill-opacity', 1);
        else if (id === 'landuse_residential') paint('fill-color', C.land), paint('fill-opacity', 1);
        else if (/^landuse/.test(id)) paint('fill-color', C.landuse), paint('fill-opacity', 1);
        else if (/^building/.test(id)) paint('fill-color', C.building), paint('fill-outline-color', C.buildingLine), paint('fill-opacity', 1);
        continue;
      }
      if (t === 'line') {
        if (/^waterway/.test(id)) { paint('line-color', C.water); continue; }
        if (/rail/.test(id)) { paint('line-color', C.rail); continue; }
        if (/path/.test(id)) { paint('line-color', C.path); paint('line-dasharray', [2, 1.5]); continue; }
        if (/_case/.test(id)) { paint('line-color', C.casing); continue; }
        const col = /_mot_|_trunk_/.test(id) ? C.major : /_pri_/.test(id) ? C.pri : /_sec_/.test(id) ? C.sec : C.minor;
        paint('line-color', col);
        if (/^tunnel/.test(id)) paint('line-opacity', 0.55);
        continue;
      }
      if (t === 'symbol') {
        paint('text-halo-color', C.halo); paint('text-halo-width', 1.4); paint('text-halo-blur', 0.5);
        if (/^water/.test(id)) { paint('text-color', C.waterLabel); layout('text-letter-spacing', 0.15); }
        else if (/^roadname/.test(id)) { paint('text-color', C.road); layout('text-transform', 'uppercase'); layout('text-letter-spacing', 0.14); }
        else if (/^place|^poi/.test(id)) { paint('text-color', C.place); layout('text-transform', 'uppercase'); layout('text-letter-spacing', 0.24); }
      }
    }
  }

  document.querySelectorAll('[data-map]').forEach((el) => {
    const full = el.dataset.map === 'full';
    const family = el.dataset.family || '';
    const focus = el.dataset.focus || '';
    const map = new maplibregl.Map({
      container: el, style: STYLE, transformRequest, bounds: OLD_TOWN, minZoom: 12, maxZoom: 19,
      dragRotate: false, pitchWithRotate: false, touchPitch: false, scrollZoom: full, attributionControl: { compact: false },
    });
    map.touchZoomRotate.disableRotation();
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-left');
    map.on('style.load', () => restyle(map));

    const rose = document.createElement('div');
    rose.className = 'map-rose';
    rose.setAttribute('aria-hidden', 'true');
    rose.innerHTML = '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" stroke-width="0.8"/><circle cx="32" cy="32" r="18" fill="none" stroke="currentColor" stroke-width="0.4"/><path d="M32 4 L36 32 L32 60 L28 32 Z" fill="currentColor" opacity=".9"/><path d="M4 32 L32 28 L60 32 L32 36 Z" fill="currentColor" opacity=".45"/><path d="M32 4 L36 32 L32 32 Z" fill="#14181b" opacity=".5"/><text x="32" y="2.5" text-anchor="middle" font-size="7" fill="currentColor" font-family="Georgia, serif">N</text></svg>';
    el.appendChild(rose);

    let markers = [];
    function draw(filter) {
      markers.forEach((m) => m.remove());
      markers = [];
      const shown = places.filter((p) => !filter || p.families.includes(filter));
      shown.forEach((p) => {
        const pin = document.createElement('button');
        pin.type = 'button';
        pin.className = `pin pin--${kind(p)}${p.id === focus ? ' pin--focus' : ''}`;
        pin.setAttribute('aria-label', p.title);
        pin.dataset.tip = p.title;
        const popup = new maplibregl.Popup({ offset: 14, maxWidth: '320px', focusAfterOpen: false })
          .setHTML(`<p class="pop-label">${esc(p.family)} · ${esc(p.street)}</p><h3>${esc(p.title)}</h3><p>${esc(p.summary)}</p><a href="${prefix}places/${p.id}.html">Read the history</a>`);
        markers.push(new maplibregl.Marker({ element: pin }).setLngLat([p.lng, p.lat]).setPopup(popup).addTo(map));
        pin.setAttribute('aria-label', p.title);
      });
      const f = shown.find((p) => p.id === focus);
      if (f) map.jumpTo({ center: [f.lng, f.lat], zoom: 17 });
      else if (shown.length > 1) {
        const b = new maplibregl.LngLatBounds();
        shown.forEach((p) => b.extend([p.lng, p.lat]));
        map.fitBounds(b, { padding: 48, maxZoom: 17, duration: filter === family ? 0 : 600 });
      } else if (shown.length === 1) map.jumpTo({ center: [shown[0].lng, shown[0].lat], zoom: 17 });
      else map.fitBounds(OLD_TOWN, { duration: 0 });
    }
    draw(family);

    const select = full && document.querySelector('select[data-map-filter]');
    if (select) select.addEventListener('change', () => draw(select.value));
    // the preview maps zoom with the scroll wheel only once clicked, so the page still scrolls past them
    if (!full) el.addEventListener('click', () => map.scrollZoom.enable(), { once: true });
  });
})();
