/* Modelo Blossom & Oud para el visor de invitaciones. */
(function () {
  'use strict';

  const venueImage = 'inv/assets/blossom-oud/beldi.webp';
  const venueMap = 'https://www.google.com/maps/search/?api=1&query=Beldi+Country+Club+Marrakech';
  const seal = 'https://static.tildacdn.net/tild3366-6538-4432-b138-323436663963/623915249_2629494717.png';
  const music = 'https://pub-4dc8201144ca418fb604349c73e8c724.r2.dev/%D9%85%D8%BA%D8%B1%D9%85%20-%20Moghram%20(Guitar%20Cover)%20_%20Johny%20Abu%20Nassar%20%5Bz_RC48DJbU0%5D%20(1).mp3';
  const heroVideo = 'https://pub-4dc8201144ca418fb604349c73e8c724.r2.dev/Luxury_illustration_with_atmosph%E2%80%A6_202605232035%20(1).mp4';
  const schedule = [
    {hora:'16:00', nombre:'Recepción de bienvenida'},
    {hora:'17:00', nombre:'Ceremonia Nikah'},
    {hora:'19:00', nombre:'Cena'},
    {hora:'20:00', nombre:'Fiesta'}
  ];
  const sample = {
    nombre1:'Amira', nombre2:'Yusuf', tipo:'Nuestra boda',
    fecha:'2027-05-20T16:00:00+01:00', fechaCorta:'20 de mayo de 2027',
    lugar:'Beldi Country Club', direccion:'Marrakech, Marruecos', mapaUrl:venueMap,
    mensaje:'Nos hará mucha ilusión compartir con ustedes la alegría de nuestra boda.',
    vestimenta:'Los invitamos a vestir con elegancia en tonos oliva, arena y dorado suave.',
    despedida:'Será un placer recibirlos',
    cronograma:schedule
  };
  const desc = 'Una boda en Marrakech entre tonos oliva, caligrafía y la luz de un jardín marroquí.';
  const cover = window.nsSiteUrl(venueImage);
  window.blossomOudDemo = () => ({
    ok:true, tipo:'plantilla',
    plantilla:{id:'blossom-oud', nombre:'Blossom & Oud', estilo:'blossom-oud', categoria:'Boda premium',
      descripcion:desc, fondo:'#f7efe3', texto:'#303525', acento:'#756034', media:{}},
    datos:sample
  });

  window.renderBlossomOud = function (data, media, isDemo, escape, safeUrl) {
    const tx = data.textos || {};
    const name1 = data.nombre1 || (isDemo ? sample.nombre1 : '');
    const name2 = data.nombre2 || (isDemo ? sample.nombre2 : '');
    const date = new Date(data.fecha || '');
    const validDate = Number.isFinite(date.getTime());
    const rows = Array.isArray(data.cronograma) && data.cronograma.length ? data.cronograma : (isDemo ? schedule : []);
    const map = safeUrl(data.mapaUrl) || (isDemo ? venueMap : '');
    const form = safeUrl(data.googleFormUrl);
    const phone = String(data.whatsapp || '').replace(/\D/g,'');
    const contact = /^[1-9]\d{7,14}$/.test(phone)
      ? 'https://wa.me/'+phone+'?text='+encodeURIComponent('Hola, quiero confirmar mi asistencia a la boda de '+[name1,name2].filter(Boolean).join(' y ')+'.')
      : '';
    const image = media.lugar === '__oculto__' ? '' : (safeUrl(media.lugar) || (isDemo ? cover : ''));
    const film = media.videoHero === '__oculto__' ? '' : (safeUrl(media.videoHero) || (isDemo ? heroVideo : ''));
    const dateLabel = data.fechaCorta || (isDemo ? sample.fechaCorta : '');
    if (media.sobre !== '__oculto__' && !safeUrl(media.sobre)) media.sobre = seal;
    if (media.musica !== '__oculto__' && !safeUrl(media.musica) && isDemo) media.musica = music;
    document.body.classList.add('blossom-mode');
    const root = document.getElementById('root');
    root.innerHTML = `
      <main class="blossom">
        <section class="blossom-hero">
          <div class="blossom-hero-image" aria-hidden="true">
            ${film ? `<video muted playsinline loop preload="none" poster="${escape(image || cover)}" src="${escape(film)}"></video>` : (image ? `<img src="${escape(image)}" alt="">` : '')}
          </div>
          <div class="blossom-inset">
            <p class="blossom-label">${escape(data.tipo || 'Nuestra boda')}</p>
            <h1>${escape(name1)}${name2 ? `<span>&amp;</span>${escape(name2)}` : ''}</h1>
            ${dateLabel ? `<p class="blossom-date">${escape(dateLabel)}</p>` : ''}
            <a href="#blossom-invitacion">Ver invitación ↓</a>
          </div>
        </section>
        <section class="blossom-welcome" id="blossom-invitacion">
          <p class="blossom-label">Con mucha alegría</p>
          <h2>Celebramos nuestro amor</h2>
          ${(data.mensaje || isDemo) ? `<p>${escape(data.mensaje || sample.mensaje)}</p>` : ''}
          ${validDate ? `<div class="blossom-count" aria-label="Cuenta regresiva">
            <div><b id="cdDays">00</b><small>Días</small></div><div><b id="cdHours">00</b><small>Horas</small></div>
            <div><b id="cdMins">00</b><small>Minutos</small></div><div><b id="cdSecs">00</b><small>Segundos</small></div>
          </div>` : ''}
        </section>
        ${rows.length ? `<section class="blossom-agenda"><h2>${escape(tx.tituloPrograma || 'Programa')}</h2>
          <ol>${rows.map(event=>`<li><strong>${escape(event.hora)}</strong><div>${escape(event.nombre)}${event.detalle ? `<small>${escape(event.detalle)}</small>` : ''}</div></li>`).join('')}</ol>
        </section>` : ''}
        ${data.lugar || data.direccion || image || map ? `<section class="blossom-venue">
          <div><p class="blossom-label">${escape(tx.tituloUbicacion || 'Lugar')}</p><h2>${escape(data.lugar || (isDemo ? sample.lugar : 'Cómo llegar'))}</h2>
            <p>${escape(data.direccion || '')}</p>${map ? `<a class="blossom-button" href="${escape(map)}" target="_blank" rel="noopener noreferrer">Abrir en Google Maps</a>` : ''}</div>
          ${image ? `<img src="${escape(image)}" loading="lazy" alt="${escape(data.lugar || 'Lugar de la celebración')}">` : ''}
        </section>` : ''}
        ${data.vestimenta ? `<section class="blossom-dress"><h2>${escape(tx.tituloVestimenta || 'Código de vestimenta')}</h2><p>${escape(data.vestimenta)}</p>
          ${isDemo ? '<div class="blossom-palette" aria-label="Paleta: oliva, arena y dorado"><i></i><i></i><i></i></div>' : ''}
        </section>` : ''}
        <section class="blossom-rsvp">
          <p class="blossom-label">${escape(tx.tituloRsvp || 'Confirmación de asistencia')}</p>
          <h2>${escape(data.despedida || sample.despedida)}</h2>
          ${data.rsvpLimite ? `<p>${escape(data.rsvpLimite)}</p>` : ''}
          ${form || contact ? `<a class="blossom-button" href="${escape(form || contact)}" target="_blank" rel="noopener noreferrer">Confirmar asistencia</a>` : (isDemo ? '<button type="button" class="blossom-button" data-blossom-preview>Probar confirmación</button><p role="status" hidden>Esta es una demo. No se envían respuestas.</p>' : '')}
        </section>
      </main>`;
    root.querySelector('[data-blossom-preview]')?.addEventListener('click', event => {
      event.currentTarget.nextElementSibling.hidden = false;
    });
    const video = root.querySelector('.blossom video');
    if (video && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.getElementById('weiOverlay').addEventListener('click', () => video.play().catch(() => {}), {once:true});
    }
  };
})();