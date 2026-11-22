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
