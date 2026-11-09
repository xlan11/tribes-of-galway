// Light and dark mode: follows the system setting until the visitor picks one with the switch.
(function () {
  const root = document.documentElement;
  const btn = document.querySelector('[data-theme-toggle]');
  if (!btn) return;
  const foot = document.querySelector('[data-theme-toggle-footer]');
  const current = () => root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const label = () => btn.setAttribute('aria-label', current() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  label();
  const flip = () => {
    const next = current() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('tg-theme', next); } catch (e) { /* storage blocked: the switch still works for this visit */ }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = next === 'dark' ? '#14181b' : '#f4f1ea';
    label();
  };
  btn.addEventListener('click', flip);
  if (foot) foot.addEventListener('click', flip);
})();
