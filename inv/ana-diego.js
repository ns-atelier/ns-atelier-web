/* Ana & Diego. Modelo de boda en marfil y dorado. */
(function () {
  'use strict';
  const galleryBase = 'https://inveli.app/images/demos/bodas-1/';
  const defaultPhoto = galleryBase + 'portada.jpg';
  const date = '2027-02-27T17:00:00-06:00';
  const itinerary = [
    {hora:'17:00', nombre:'Ceremonia religiosa'}, {hora:'19:00', nombre:'Recepción'},
    {hora:'20:00', nombre:'Cena'}, {hora:'21:00', nombre:'Vals de los novios'}, {hora:'21:30', nombre:'Fiesta'}
  ];
  window.anaDiegoDemo = () => ({
    ok:true, tipo:'plantilla',
    plantilla:{id:'ana-diego',nombre:'Ana & Diego',estilo:'ana-diego',categoria:'Boda premium',fondo:'#fbf6ea',texto:'#302820',acento:'#775b12',media:{}},
    datos:{nombre1:'Ana',nombre2:'Diego',tipo:'¡Nos casamos!',fecha:date,fechaCorta:'27 de febrero de 2027',
      mensaje:'Queremos que nos acompañes en el día más importante de nuestras vidas.',
      lugar:'Parroquia de San Juan Bautista',direccion:'Jardín Centenario 8, Coyoacán, Ciudad de México',
      vestimenta:'Formal. Traje oscuro con corbata o vestido largo o de cóctel en colores sobrios.',
      cronograma:itinerary,regalos:'Su presencia es nuestro mejor regalo. Si desean obsequiarnos algo más, lo recibiremos con gratitud.',
      despedida:'Gracias por compartir nuestra felicidad.'}
  });

  window.renderAnaDiego = function (data, media, isDemo, esc, safeUrl) {
    const root = document.getElementById('root');
    const names = [data.nombre1,data.nombre2].filter(Boolean).join(' & ');
    const calendarDate = new Date(data.fecha || '');
    const validDate = Number.isFinite(calendarDate.getTime());
    const mapSearch = place => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(place);
    const ceremony = safeUrl(data.mapaUrl) || (isDemo ? mapSearch(data.lugar+', '+data.direccion) : '');
    const contact = String(data.whatsapp || '').replace(/\D/g,'');
    const rsvpUrl = safeUrl(data.googleFormUrl) || (/^[1-9]\d{7,14}$/.test(contact) ? 'https://wa.me/'+contact+'?text='+encodeURIComponent('Hola, quiero confirmar mi asistencia a la boda de '+names+'.') : '');
    const photo = media.fotoCierre === '__oculto__' ? '' : (safeUrl(media.fotoCierre) || (isDemo ? defaultPhoto : ''));
    const photos = ['foto1','foto2','foto3','foto4'].map((key,i) => media[key] === '__oculto__' ? '' :
      (safeUrl(media[key]) || (isDemo ? galleryBase+'galeria-'+(i+1)+'.jpg' : ''))).filter(Boolean);
    const tx = data.textos || {};
    const link = (url,label) => `<a class="ad-button" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${label}</a>`;
    const dateLabel = data.fechaCorta || (validDate ? new Intl.DateTimeFormat('es-PE',{dateStyle:'long',timeZone:'UTC'}).format(calendarDate) : '');
    if (!safeUrl(media.sobre) && media.sobre !== '__oculto__') {
      document.body.classList.add('ad-default-envelope');
    }
    if (isDemo && !media.musica) media.musica = 'https://d36s05d0q9dv5r.cloudfront.net/catalog/audio/3d194883-5a84-4e83-84e0-befdd8c21611.mp3';
    document.body.classList.add('ana-diego-mode');
    root.innerHTML = `
      <main class="ad-page">
        <section class="ad-hero">
          ${photo ? `<img src="${esc(photo)}" alt="">` : ''}
          <div class="ad-paper">
            <p class="ad-kicker">${esc(data.tipo || 'Nuestra boda')}</p>
            <h1>${esc(names)}</h1>
            ${dateLabel ? `<p>${esc(dateLabel)}</p>` : ''}
            <a href="#ad-bienvenida">Ver invitación ↓</a>
          </div>
        </section>
        <section id="ad-bienvenida">
          <h2>Guarda la fecha</h2><p>${esc(data.mensaje || '')}</p>
          ${validDate ? `<div class="ad-count" aria-label="Cuenta regresiva">
            <div><b id="cdDays">00</b>Días</div><div><b id="cdHours">00</b>Horas</div>
            <div><b id="cdMins">00</b>Minutos</div><div><b id="cdSecs">00</b>Segundos</div>
          </div><button class="ad-button" type="button" id="ad-calendar">Agregar al calendario</button>` : ''}
        </section>
        ${isDemo ? `<section class="ad-tonal"><h2>Invitados especiales</h2>
          <div class="ad-grid"><article><h3>Padres de la novia</h3><p>Roberto Martínez y Laura Gómez</p></article>
          <article><h3>Padres del novio</h3><p>Javier Herrera y Patricia Ruiz</p></article>
          <article><h3>Padrinos</h3><p>Andrés Salinas y Mariana López</p></article></div>
        </section>` : ''}
        ${data.lugar || ceremony ? `<section><h2>${esc(tx.tituloUbicacion || 'Ubicaciones')}</h2>
          <div class="ad-grid"><article><p class="ad-kicker">Ceremonia</p><h3>${esc(data.lugar || '')}</h3>
          <p>${esc(data.direccion || '')}${isDemo ? ' · 17:00 h' : ''}</p>${ceremony ? link(ceremony,'Ver ubicación') : ''}</article>
          ${isDemo ? `<article><p class="ad-kicker">Recepción</p><h3>Hacienda Los Laureles</h3>
          <p>Camino Real 120, Tlalpan, Ciudad de México · 19:00 h</p>${link(mapSearch('Hacienda Los Laureles, Camino Real 120, Tlalpan, Ciudad de México'),'Ver ubicación')}</article>` : ''}</div>
        </section>` : ''}
        ${data.cronograma?.length ? `<section class="ad-tonal"><h2>${esc(tx.tituloPrograma || 'Itinerario')}</h2><ol class="ad-schedule">
          ${data.cronograma.map(row=>`<li><b>${esc(row.hora)}</b><span>${esc(row.nombre)}${row.detalle ? `<small>${esc(row.detalle)}</small>` : ''}</span></li>`).join('')}
        </ol></section>` : ''}
        ${data.vestimenta ? `<section><h2>${esc(tx.tituloVestimenta || 'Código de vestimenta')}</h2><p>${esc(data.vestimenta)}</p>
        ${isDemo ? '<h3>Solo adultos</h3><p>Gracias por acompañarnos en una celebración pensada para adultos.</p>' : ''}</section>` : ''}
        ${data.regalos ? `<section class="ad-tonal"><h2>${esc(tx.tituloRegalos || 'Mesa de regalos')}</h2><p>${esc(data.regalos)}</p></section>` : ''}
        ${photos.length ? `<section><h2>Galería</h2><div class="ad-gallery">${photos.map((src,i)=>`<button type="button" data-ad-photo="${i}" aria-label="Ampliar fotografía ${i+1}"><img src="${esc(src)}" loading="lazy" alt="Fotografía ${i+1} de la pareja"></button>`).join('')}</div>
          <dialog class="ad-lightbox"><form method="dialog"><button class="ad-button" aria-label="Cerrar fotografía">Cerrar</button></form><img alt=""></dialog></section>` : ''}
        <section class="ad-finale"><h2>${esc(tx.tituloRsvp || 'Confirmar asistencia')}</h2>
          <p>${esc(data.despedida || '')}</p>
          ${rsvpUrl ? link(rsvpUrl,'Confirmar asistencia') : (isDemo ? `<form class="ad-rsvp">
            <label>Nombre completo<input name="nombre" autocomplete="name" required></label>
            <label>¿Nos acompañarás?<select name="asistencia" required><option value="">Elige una opción</option><option>Sí, asistiré</option><option>No podré asistir</option></select></label>
            <label>Número de asistentes<select name="invitados"><option>1</option><option>2</option><option>3</option><option>4</option></select></label>
            <label>Mensaje o restricción alimentaria (opcional)<textarea name="mensaje" rows="3"></textarea></label>
            <button class="ad-button" type="submit">Probar confirmación</button>
            <p role="status" hidden>Prueba completada. Esta demo no envía ni guarda respuestas.</p>
          </form>` : '')}
        </section>
      </main>`;
    const dialog = root.querySelector('.ad-lightbox');
    root.querySelectorAll('[data-ad-photo]').forEach(button => button.addEventListener('click', () => {
      const image = dialog.querySelector('img');
      image.src = photos[Number(button.dataset.adPhoto)];
      image.alt = button.querySelector('img').alt;
      dialog.showModal();
    }));
    root.querySelector('.ad-rsvp')?.addEventListener('submit', event => {
      event.preventDefault();
      event.currentTarget.querySelector('[role="status"]').hidden = false;
    });
    root.querySelector('#ad-calendar')?.addEventListener('click', () => {
      const stamp = d => d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
      const calendarText = value => String(value || '').replace(/[\\;,]/g,'\\$&').replace(/\r?\n/g,'\\n');
      const lines = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//N&S Atelier//Invitaciones//ES','BEGIN:VEVENT',
        'UID:'+stamp(calendarDate)+'-ana-diego@ns-atelier','DTSTAMP:'+stamp(new Date()),'DTSTART:'+stamp(calendarDate),
        'SUMMARY:'+calendarText('Boda de '+names),'LOCATION:'+calendarText([data.lugar,data.direccion].filter(Boolean).join(', ')),
        'END:VEVENT','END:VCALENDAR',''];
      const url = URL.createObjectURL(new Blob([lines.join('\r\n')],{type:'text/calendar;charset=utf-8'}));
      const a = document.createElement('a');a.href=url;a.download='boda.ics';a.click();
      setTimeout(() => URL.revokeObjectURL(url),30000);
    });
  };
})();