// Tribes of Galway map: draws every place from the page's #places-data on a Leaflet map.
// <div class="tg-map" data-map="full|preview" data-tribe="lynch"></div>
(function () {
  const dataEl = document.getElementById('places-data');
  if (!dataEl || !window.L) return;
  const places = JSON.parse(dataEl.textContent);
  const prefix = document.documentElement.dataset.prefix || '';
  const css = getComputedStyle(document.documentElement);
  const colour = (t) => css.getPropertyValue(t === 'house' ? '--tg-red' : t === 'gathering' ? '--tg-gold' : '--tg-blue').trim();
  const isDark = () => {
    const t = document.documentElement.dataset.theme;
    return t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  };
  const tileUrl = () => `https://{s}.basemaps.cartocdn.com/${isDark() ? 'dark_all' : 'light_all'}/{z}/{x}/{y}{r}.png`;
  const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

  document.querySelectorAll('[data-map]').forEach((el) => {
    const preview = el.dataset.map === 'preview';
    const only = el.dataset.tribe || '';
    const map = L.map(el, { scrollWheelZoom: !preview, zoomControl: !preview, dragging: !preview || !matchMedia('(pointer: coarse)').matches, attributionControl: true })
      .setView([53.2718, -9.0525], preview ? 16 : 16);
    let tiles = L.tileLayer(tileUrl(), { attribution, maxZoom: 19, subdomains: 'abcd' }).addTo(map);
    const layer = L.layerGroup().addTo(map);

    function draw(filter) {
      layer.clearLayers();
      const shown = places.filter((p) => !filter || p.tribe === filter);
      shown.forEach((p) => {
        const m = L.circleMarker([p.lat, p.lng], { radius: preview ? 7 : 9, color: isDark() ? '#14181b' : '#ffffff', weight: 2, fillColor: colour(p.type), fillOpacity: 1 });
        const link = p.href ? `<a href="${prefix}${p.href}">${p.linkText || 'Read more'}</a>` : '';
        m.bindPopup(`<h3>${p.name}</h3><p>${p.line}</p>${link}`);
        m.addTo(layer);
      });
      if (shown.length > 1) map.fitBounds(L.latLngBounds(shown.map((p) => [p.lat, p.lng])).pad(preview ? 0.15 : 0.25));
      else if (shown.length === 1) map.setView([shown[0].lat, shown[0].lng], 17);
    }
    draw(only);

    const select = document.querySelector(`select[data-map-filter]`);
    if (select && !preview) select.addEventListener('change', () => draw(select.value));

    // follow the theme switch
    new MutationObserver(() => { map.removeLayer(tiles); tiles = L.tileLayer(tileUrl(), { attribution, maxZoom: 19, subdomains: 'abcd' }).addTo(map); tiles.bringToBack(); draw(select && !preview ? select.value : only); })
      .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  });
})();
