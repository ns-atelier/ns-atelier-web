/* Rutas compatibles con GitHub Pages, dominio personalizado o alojamiento local. */
window.nsSiteUrl = (() => {
  const base = new URL('../', document.currentScript.src);
  return function nsSiteUrl(path) {
    const value = String(path || '').trim();
    if (!value) return value;
    // Los enlaces antiguos de Netlify a ARCHIVOS del proyecto pueden ser
    // trasladados al mismo recurso en GitHub Pages sin modificar el panel.
    if (/^https:\/\/nysatelier\.netlify\.app\//i.test(value)) {
      const original = new URL(value);
      if (/^\/(?:assets|images|inv|demos|i)\//i.test(original.pathname)) {
        return new URL(original.pathname.slice(1) + original.search + original.hash, base).href;
      }
    }
    if (/^(?:https?:|data:|blob:|mailto:|tel:|\/\/)/i.test(value)) return value;
    if (value.startsWith('#') || value.startsWith('?')) return value;
    let pathName = value.replace(/^\/+/, '').replace(/^\.\//, '');
    // Permitir URLs antiguas que incluyen explícitamente el nombre del repo.
    const repo = base.pathname.split('/').filter(Boolean).pop();
    if (repo && pathName.startsWith(repo + '/')) pathName = pathName.slice(repo.length + 1);
    if (!/^(?:assets|images|inv|demos|i|catalogo(?:\.html)?|condiciones\.html)(?:\/|$)/i.test(pathName)) return value;
    return new URL(pathName, base).href;
  };
})();

window.consultarPanel = (() => {
  const API_URL = 'https://script.google.com/macros/s/AKfycbwgoS7eicCYVUPE9qB3U9k9x0YZqXgbqJd72LedJ5nLv6mLM6OPsPHh5nWFjFaL5GUs/exec';
  return function consultarPanel(query) {
    return new Promise((resolve, reject) => {
      const name = 'ns_cb_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
      const s = document.createElement('script');
      let done = false;
      const finish = (err, data) => {
        if (done) return;
        done = true;
        clearTimeout(tm);
        s.remove();
        delete window[name];
        err ? reject(err) : resolve(data);
      };
      const tm = setTimeout(() => finish(Error('Tiempo de espera agotado al conectar con el panel.')), 12000);
      window[name] = data => finish(null, data);
      s.onerror = () => finish(Error('No se pudo conectar con Google Apps Script.'));
      s.src = API_URL + (API_URL.includes('?') ? '&' : '?') + new URLSearchParams({ ...query, callback: name }).toString();
      document.head.appendChild(s);
    });
  };
})();
