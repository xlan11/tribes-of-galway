// Tribes of Galway map: a real street map of Galway (OpenStreetMap data, CARTO dark tiles) with every
// historic site from #places-data as a pin. Drag and zoom like any web map.
// <div class="tg-map" data-map="full|preview" data-family="lynch" data-focus="lynchs-castle"></div>
(function () {
  const dataEl = document.getElementById('places-data');
  if (!dataEl || !window.L) return;
  const places = JSON.parse(dataEl.textContent);
  const prefix = document.documentElement.dataset.prefix || '';
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const css = getComputedStyle(document.documentElement);
  const colour = (p) => css.getPropertyValue(p.families.includes('all') ? '--tg-gold' : p.families.some((f) => ['burke', 'fallon', 'nolan', 'ohallmhurain', 'oconchobhair', 'oflaithbertaigh'].includes(f)) ? '--tg-blue' : '--tg-red').trim();
  const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
  const OLD_TOWN = L.latLngBounds([53.2690, -9.0570], [53.2775, -9.0475]);

  document.querySelectorAll('[data-map]').forEach((el) => {
    const full = el.dataset.map === 'full';
    const family = el.dataset.family || '';
    const focus = el.dataset.focus || '';
    const map = L.map(el, { scrollWheelZoom: full, zoomControl: true, minZoom: 12, maxZoom: 19 });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { attribution, maxZoom: 19, subdomains: 'abcd' }).addTo(map);
    const layer = L.layerGroup().addTo(map);
    const markers = {};

    function draw(filter) {
      layer.clearLayers();
      const shown = places.filter((p) => !filter || p.families.includes(filter));
      shown.forEach((p) => {
        const on = p.id === focus;
        const m = L.circleMarker([p.lat, p.lng], { radius: on ? 11 : 8, color: '#14181b', weight: 2, fillColor: on ? '#ece7dd' : colour(p), fillOpacity: 1 });
        m.bindPopup(`<p class="pop-label">${esc(p.family)} · ${esc(p.street)}</p><h3>${esc(p.title)}</h3><p>${esc(p.summary)}</p><a href="${prefix}places/${p.id}.html">Read the history</a>`, { maxWidth: 300 });
        m.bindTooltip(esc(p.title), { direction: 'top', offset: [0, -8] });
        m.addTo(layer);
        markers[p.id] = m;
      });
      if (focus && markers[focus]) map.setView(markers[focus].getLatLng(), 17);
      else if (shown.length > 1) map.fitBounds(L.latLngBounds(shown.map((p) => [p.lat, p.lng])).pad(0.2));
      else if (shown.length === 1) map.setView([shown[0].lat, shown[0].lng], 17);
      else map.fitBounds(OLD_TOWN);
    }
    draw(family);

    const select = full && document.querySelector('select[data-map-filter]');
    if (select) select.addEventListener('change', () => draw(select.value));
    // the preview maps zoom with the scroll wheel only once clicked, so the page still scrolls past them
    if (!full) { map.once('focus', () => map.scrollWheelZoom.enable()); el.addEventListener('click', () => map.scrollWheelZoom.enable(), { once: true }); }
  });
})();
