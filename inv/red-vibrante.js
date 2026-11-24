/* Red Vibrante · motor de la demo originalmente llamada Jardín de Seda.
   Conservamos el ID jardin-seda para no invalidar enlaces y datos existentes. */
(function () {
  'use strict';
  const DEFAULTS = Object.freeze({
    seal: 'https://static.tildacdn.net/tild3435-3731-4464-a537-636664626563/ChatGPT_Image_Aug_3_.png',
    flaps: [
      'https://static.tildacdn.net/tild6338-3733-4431-a363-306634383864/Polygon_4.png',
      'https://static.tildacdn.net/tild3636-6566-4132-b665-343766326335/Polygon_3.png',
      'https://static.tildacdn.net/tild6262-6339-4933-b833-343039643037/Polygon_2_1.png',
      'https://static.tildacdn.net/tild3762-3738-4361-b134-333538333135/Polygon_1_3.png'
    ],
    audio: 'https://pub-4dc8201144ca418fb604349c73e8c724.r2.dev/Alex%20Warren%20-%20Ordinary%20Lyrics.mp3'
  });

  function isGenericMedia(url, fileNames) {
    return fileNames.some(name => String(url || '').toLowerCase().includes(name));
  }
  function text(el, value) { if (el && value !== undefined && value !== null && String(value).trim()) el.textContent = String(value); }
  function readableDate(input) {
    const value = new Date(input);
    return Number.isFinite(value.valueOf())
      ? String(value.getDate()).padStart(2, '0') + '.' +
        String(value.getMonth() + 1).padStart(2, '0') + '.' +
        String(value.getFullYear()).slice(-2) : '';
  }
  function validMedia(src) {
    if (typeof src !== 'string' || !src.trim() || src === '__oculto__') return '';
    if (/^https:\/\//i.test(src)) return window.nsSiteUrl(src);
    if (/^\/(?:ns-atelier-web\/)?(?:inv|assets|images|demos)\//i.test(src)) return window.nsSiteUrl(src);
    if (/^(?:\.\/)?assets\//i.test(src)) return window.nsSiteUrl('inv/' + src.replace(/^\.\//, ''));
    return '';
  }
  function mediaImage(node, src) {
    if (!node) return;
    const url = validMedia(src);
    if (url) { node.src = url; node.loading = 'lazy'; node.decoding = 'async'; }
  }
  function makeEnvelope(media) {
    const overlay = document.getElementById('weiOverlay');
    overlay.classList.add('envelope-overlay', 'rv-envelope-mode');
    // El sello que se edita en la tarjeta «Sobre / portada» del panel
    // controla de verdad el sello del sobre animado de Red Vibrante.
    const seal = (isGenericMedia(media.sobre, ['sobre-portada.jpg', 'sobre-portada.webp'])
      ? '' : validMedia(media.sobre)) || validMedia(media.sello) || DEFAULTS.seal;
    // Mantener los IDs que usa el visor para la apertura y la edición visual.
    overlay.innerHTML = [
      '<div class="envelope-stage">',
        '<img class="env-flap env-left" alt="" src="' + DEFAULTS.flaps[0] + '">',
        '<img class="env-flap env-right" alt="" src="' + DEFAULTS.flaps[1] + '">',
        '<img class="env-flap env-bottom" alt="" src="' + DEFAULTS.flaps[2] + '">',
        '<img class="env-flap env-top" alt="" src="' + DEFAULTS.flaps[3] + '">',
        '<div class="seal-trigger">',
          '<img id="weiImg" alt="Sello para abrir la invitación" draggable="false">',
          '<span id="weiTapLabel" class="seal-label">Click to open</span>',
        '</div>',
      '</div>'
    ].join('');
    media.sobre = seal;
    // El HTML de referencia abre las solapas; no necesita video de apertura adicional.
    if (isGenericMedia(media.video, ['apertura-original.mp4'])) media.video = '';
    if (isGenericMedia(media.musica, ['melodia-original.mp3'])) media.musica = DEFAULTS.audio;
    if (!media.musica) media.musica = DEFAULTS.audio;
    media.__redVibrante = true;
  }
  function formatNumber(value, fallback) { return String(value === undefined || value === null ? fallback : value); }
  function countdown(container, dateString) {
    const date = dateString ? new Date(dateString) : new Date(2027, 6, 10, 16, 15);
    if (!Number.isFinite(date.valueOf()) || !container) return;
    const nums = ['days','hours','minutes','seconds'].map(x => container.querySelector('#' + x));
    function tick() {
      const delta = Math.max(0, date.valueOf() - Date.now());
      const vals = [
        Math.floor(delta / 86400000), Math.floor(delta / 3600000) % 24,
        Math.floor(delta / 60000) % 60, Math.floor(delta / 1000) % 60
      ];
      vals.forEach((n, i) => { if (nums[i]) nums[i].textContent = String(n).padStart(2, '0'); });
    }
    tick();
    const timer = setInterval(() => {
      if (!container.isConnected) { clearInterval(timer); return; }
      tick();
    }, 1000);
  }
  function drawSchedule(container, events) {
    if (!container || !Array.isArray(events) || !events.length) return;
    container.replaceChildren();
    events.forEach(item => {
      if (!item || typeof item !== 'object') return;
      const row = document.createElement('div'); row.className = 'timeline-item';
      const time = document.createElement('div'); time.className = 'timeline-time';
      time.textContent = formatNumber(item.hora, '');
      const diamond = document.createElement('div'); diamond.className = 'timeline-diamond';
      const title = document.createElement('div'); title.className = 'timeline-event';
      title.textContent = [item.nombre, item.detalle].filter(Boolean).join(' · ');
      row.append(time, diamond, title);
      container.append(row);
    });
  }
  function wireRsvp(root, data, payloadType) {
    const modal = root.querySelector('#rsvp-modal');
    const form = root.querySelector('#rsvp-form');
    const success = root.querySelector('#rsvp-success');
    const formUrl = validMedia(data.googleFormUrl);
    const number = String(data.whatsapp || '').replace(/\D/g, '');
    const isDemo = payloadType !== 'evento';
    root.querySelector('#open-rsvp')?.addEventListener('click', () => {
      if (!isDemo && formUrl) { window.open(formUrl, '_blank', 'noopener'); return; }
      if (modal) modal.classList.add('open');
    });
    root.querySelector('#close-rsvp')?.addEventListener('click', () => modal?.classList.remove('open'));
    modal?.addEventListener('click', ev => { if (ev.target === modal) modal.classList.remove('open'); });
    form?.addEventListener('submit', ev => {
      ev.preventDefault();
      if (!form.reportValidity()) return;
      if (isDemo) {
        form.hidden = true; form.style.display = 'none'; success.style.display = 'block';
        success.textContent = 'Esta es una demostración. No se ha guardado ninguna confirmación.';
        return;
      }
      const name = form.querySelector('[name="name"]')?.value.trim() || '';
      const attendance = form.querySelector('[name="attendance"]:checked')?.value || '';
      const intolerances = form.querySelector('[name="intolerances"]')?.value.trim() || '';
      if (number.length >= 10 && number.length <= 15) {
        const msg = 'Hola, confirmo mi asistencia: ' + name + '. Respuesta: ' + attendance +
          (intolerances ? '. Intolerancias: ' + intolerances : '');
        window.open('https://wa.me/' + number + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
      } else {
        success.style.display = 'block';
        success.textContent = 'La confirmación todavía no está configurada para esta invitación.';
      }
    });
  }
  function showReveal(root) {
    const targets = Array.from(root.querySelectorAll('.rv-reveal'));
    if (!('IntersectionObserver' in window)) { targets.forEach(el => el.classList.add('active')); return; }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('active'); observer.unobserve(entry.target); }
      });
    }, { threshold: .12 });
    targets.forEach(el => observer.observe(el));
  }

  window.renderRedVibrante = async function renderRedVibrante(data, template, media, payload) {
    const response = await fetch(window.nsSiteUrl('inv/red-vibrante-template.html'), { cache: 'force-cache' });
    if (!response.ok) throw Error('No se pudo cargar la plantilla Red Vibrante.');
    const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
    const node = doc.querySelector('.rv-root');
    if (!node) throw Error('La plantilla Red Vibrante está incompleta.');
    const root = document.getElementById('root');
    root.replaceChildren(document.importNode(node, true));
    const rv = root.querySelector('.rv-root');
    document.body.classList.add('rv-mode');
    const q = selector => rv.querySelector(selector);
    // Los datos editables del panel se reflejan sobre el diseño original.
    const tx = data.textos || {};
    const colors = data.colores || {};
    const customBg = colors.fondo || (template.fondo && template.fondo.toLowerCase() !== '#f7f0e5' ? template.fondo : '');
    if (customBg) rv.style.setProperty('--burgundy', customBg);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', customBg || '#66021f');
    if (colors.texto) rv.style.setProperty('--cream', colors.texto);
    if (data.fuente) rv.style.setProperty('--font-main', "'" + String(data.fuente).replace(/[^a-zA-Z ]/g, '') + "', Georgia, serif");
    const n1 = data.nombre1 || 'Viktor', n2 = data.nombre2 || 'Paula';
    const n = q('.hero-names');
    n.replaceChildren(document.createTextNode(n1));
    if (n2) {
      const amp = document.createElement('span'); amp.className = 'hero-amp'; amp.textContent = '&';
      n.append(amp, document.createTextNode(n2));
    }
    text(q('.hero-subtitle'), data.tipo || 'Wedding Day');
    text(q('.hero-date'), data.fechaCorta || readableDate(data.fecha));
    text(q('.footer-names'), n1 + (n2 ? ' and ' + n2 : ''));
    text(q('.section-burgundy .section-text'), data.mensaje);
    text(q('.location-name'), data.lugar);
    text(q('.location-address'), data.direccion);
    text(q('.location-name')?.parentElement?.querySelector('h2'), tx.tituloUbicacion);
    text(q('.timeline')?.parentElement?.querySelector('h2'), tx.tituloPrograma);
    text(q('#countdownContainer')?.parentElement?.querySelector('h2'), tx.tituloCuenta);
    const palette = q('.color-palette');
    text(palette?.parentElement?.querySelector('h2'), tx.tituloVestimenta);
    const dressColors = data.paletaVestimenta;
    if (Array.isArray(dressColors) && dressColors.length === 4 && dressColors.every(color=>/^#[0-9a-f]{6}$/i.test(color))) {
      palette?.querySelectorAll('.swatch').forEach((swatch,index)=>{swatch.style.backgroundColor=dressColors[index];});
    }
    text(q('.organizer-name'), data.organizador);
    text(q('.footer-section h2'), data.despedida);
    text(q('#open-rsvp')?.parentElement?.querySelector('h2'), tx.tituloRsvp);
    text(q('#open-rsvp')?.parentElement?.querySelector('.section-text'), tx.textoRsvp);
    text(q('.modal-subtitle'), data.rsvpLimite);
    drawSchedule(q('.timeline'), data.cronograma);
    const video = q('#bgVideo');
    if (video && validMedia(media.videoHero)) {
      video.pause();
      video.src = validMedia(media.videoHero);
      video.load();
    }
    mediaImage(q('.location-img'), isGenericMedia(media.lugar, ['jardin-venue.svg']) ? '' : media.lugar);
    mediaImage(q('.footer-photo-wrap img:not(.footer-photo-overlay)'), media.fotoCierre);
    const flowerImages = rv.querySelectorAll('.hero-flowers img');
    if (media.ramaIzq && validMedia(media.ramaIzq)) mediaImage(flowerImages[0], media.ramaIzq);
    if (media.ramaDer && validMedia(media.ramaDer)) mediaImage(flowerImages[flowerImages.length - 1], media.ramaDer);
    if (media.flores && !isGenericMedia(media.flores, ['ornamento.svg'])) mediaImage(flowerImages[3], media.flores);
    ['foto1','foto2'].forEach((key, index) => {
      const photo = rv.querySelectorAll('.dress-row img')[index];
      if (media[key]) mediaImage(photo, media[key]);
    });
    const tel = q('.organizer-phone');
    const number = String(data.whatsapp || '').replace(/\D/g, '');
    if (tel) {
      if (number.length >= 10 && number.length <= 15) {
        tel.href = 'tel:+' + number; tel.textContent = '+' + number;
      } else tel.remove();
    }
    // La fecha controlada por el panel es única para el texto y la cuenta regresiva.
    countdown(rv, data.fecha);
    wireRsvp(rv, data, payload.tipo);
    showReveal(rv);
    makeEnvelope(media);
    const heroVideo = video;
    document.getElementById('weiOverlay').addEventListener('click', () => {
      heroVideo?.play().catch(() => {});
    }, { once: true });
    document.title = 'Red Vibrante · N&S ATELIER';
    return rv;
  };
})();
