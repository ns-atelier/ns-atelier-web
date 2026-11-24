(() => {
  'use strict';

  const color = value => /^#[a-f\d]{6}$/i.test(value || '') ? value : '';
  const number = (value, min, max) => Number.isFinite(value) ? Math.max(min, Math.min(max, value)) : null;
  const alignment = {izquierda:'left',centro:'center',derecha:'right'};

  window.renderDisenoPersonalizado = (root, design, event, media, helpers) => {
    const {esc, safeUrl, preview} = helpers;
    const labels = event.textos || {};
    const names = [event.nombre1,event.nombre2].filter(Boolean).join(' & ') || 'Nuestra boda';
    const text = (tag,value,cls='',dynamic=false) => value ? `<${tag} class="${cls}"${dynamic ? ' data-atelier-variable' : ''}>${esc(value)}</${tag}>` : '';
    const image = (url,alt,own=false) => url ? `<img class="np-image"${own ? ' data-block-file' : ''} src="${esc(url)}" alt="${esc(alt || '')}" loading="lazy" decoding="async">` : '';
    const video = (url,alt,own=false) => url ? `<video class="np-image"${own ? ' data-block-file' : ''} src="${esc(url)}" aria-label="${esc(alt || 'Video de la invitación')}" controls playsinline preload="metadata"></video>` : '';
    const link = (url,label) => url && label ? `<a class="np-link" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>` : '';
    const phone = String(event.whatsapp || '').replace(/\D/g,'');
    const whatsapp = /^[1-9]\d{7,14}$/.test(phone) ? 'https://wa.me/' + phone + '?text=' + encodeURIComponent('Hola, confirmo mi asistencia a la celebración de ' + names + '.') : '';
    const contacts = [safeUrl(event.googleFormUrl),whatsapp];
    const eventText = ['subtitulo','mensaje','vestimenta','regalos','despedida','rsvpLimite'];
    const isBound = b => eventText.includes(b.origenTexto);
    const copy = b => (isBound(b) ? event[b.origenTexto] : '') || b.texto;
    const paragraph = (b,fallback='',dynamic=false) => text('p',copy(b) || fallback,'',isBound(b) || dynamic && !b.texto);
    const markup = {
      portada(b) {
        const asset=safeUrl(b.archivo);
        return (asset ? image(asset,b.alt,true) : video(safeUrl(media.videoHero),b.alt)) + text('p',b.titulo || event.tipo,'np-overline') +
          text('h1',names,'',true) + text('p',event.fechaCorta || '', 'np-date',true) + paragraph(b,event.subtitulo,true);
      },
      texto(b) { return text('h2',b.titulo) + paragraph(b); },
      imagen(b) { return text('h2',b.titulo) + image(safeUrl(b.archivo),b.alt,true) + paragraph(b); },
      video(b) { return text('h2',b.titulo) + video(safeUrl(b.archivo),b.alt,true) + paragraph(b); },
      cuenta(b) {
        return text('h2',b.titulo || labels.tituloCuenta || 'La celebración comienza en') +
          '<div class="np-count">' + ['Días','Horas','Min','Seg'].map(label=>`<div><strong data-atelier-variable>00</strong><small>${label}</small></div>`).join('') + '</div>' +
          paragraph(b);
      },
      programa(b) {
        const rows = Array.isArray(event.cronograma) ? event.cronograma : [];
        const items = rows.map(item=>`<li><strong>${esc(item.hora || '')}</strong><span>${esc(item.nombre || '')}${text('small',item.detalle)}</span></li>`).join('');
        return text('h2',b.titulo || labels.tituloPrograma || 'Programa') + (items ? '<ol class="np-programa">'+items+'</ol>' : '') + paragraph(b);
      },
      ubicacion(b) {
        const map=safeUrl(event.mapaEmbedUrl);
        const googleMap = /^https:\/\/(?:www\.)?google\.(?:com(?:\.[a-z]{2})?|es)\/maps\/embed(?:[?\/]|$)/i.test(map) ? map : '';
        return text('h2',b.titulo || labels.tituloUbicacion || 'Ubicación') + image(safeUrl(b.archivo || media.lugar),b.alt,Boolean(b.archivo)) +
          text('p',event.lugar,'np-venue',true) + text('p',event.direccion,'',true) + paragraph(b) +
          (googleMap ? `<iframe class="np-map" src="${esc(googleMap)}" title="Mapa de la celebración" loading="lazy" referrerpolicy="no-referrer"></iframe>` : '') +
          link(safeUrl(b.enlace || event.mapaUrl),b.etiqueta || 'Abrir el mapa');
      },
      galeria(b) {
        const photos = ['foto1','foto2','foto3','foto4'].map(key=>safeUrl(media[key])).filter(Boolean);
        if (b.archivo) photos.unshift(safeUrl(b.archivo));
        return text('h2',b.titulo || 'Nuestros recuerdos') + (photos.length ?
          '<div class="np-photos">'+photos.map((src,i)=>image(src,i===0 && b.alt ? b.alt : 'Fotografía ' + (i+1),i===0 && Boolean(b.archivo))).join('')+'</div>' : '') +
          paragraph(b);
      },
      confirmacion(b) {
        const custom=safeUrl(b.enlace);
        const links = custom ? link(custom,b.etiqueta || 'Confirmar asistencia') :
          link(contacts[0],b.etiqueta || 'Confirmar asistencia') + link(contacts[1],'Confirmar por WhatsApp');
        return text('h2',b.titulo || labels.tituloRsvp || 'Confirma tu asistencia') +
          paragraph(b,labels.textoRsvp || event.rsvpLimite,true) +
          (links || (preview ? '<button type="button" class="np-link" disabled>Confirmar asistencia</button>' : ''));
      },
      separador(b) { return image(safeUrl(b.archivo),b.alt,true) + (copy(b) ? paragraph(b) : '<span class="np-divider" aria-hidden="true"></span>'); },
      cierre(b) { return image(safeUrl(b.archivo || media.fotoCierre),b.alt,Boolean(b.archivo)) + text('h2',b.titulo || '¡Te esperamos!') + paragraph(b,event.despedida,true); }
    };

    if (!Array.isArray(design?.bloques) || !design.bloques.length) return false;
    root.innerHTML='<main class="np-page">' + design.bloques.map(b=>{
      if (!b || !Object.hasOwn(markup,b.tipo) || !/^[a-z0-9][a-z0-9-]{0,29}$/.test(b.id) || (b.oculto && !preview)) return '';
      const props = {};
      const picture = safeUrl(b.fondoImagen);
      const space = number(b.espacio,0,100), height=number(b.altura,80,720);
      const titleSize=number(b.tamanoTitulo,16,96), textSize=number(b.tamanoTexto,12,42);
      if (color(b.fondo)) props['--np-bg']=b.fondo;
      if (color(b.color)) props['--np-ink']=b.color;
      if (color(b.acento)) props['--np-accent']=b.acento;
      if (Object.hasOwn(alignment,b.alineacion || '')) props['--np-align']=alignment[b.alineacion];
      if (space!==null) props['--np-pad']=space+'px';
      if (height!==null) props['--np-height']=height+'px';
      if (titleSize!==null) props['--np-title']=titleSize+'px';
      if (textSize!==null) props['--np-copy']=textSize+'px';
      if (picture) props['--np-picture']='url(' + JSON.stringify(picture) + ')';
      const style=Object.entries(props).map(([key,value])=>key+':'+value).join(';');
      const width=['estrecho','completo'].includes(b.ancho)?b.ancho:'normal';
      const border=['fino','redondeado'].includes(b.borde)?b.borde:'ninguno';
      const content=markup[b.tipo](b) + (!['ubicacion','confirmacion'].includes(b.tipo) ?
        link(safeUrl(b.enlace),b.etiqueta || 'Ver más') : '');
      const empty = preview && !content.trim() ? '<p class="np-empty">Agrega el contenido de este bloque desde el panel.</p>' : '';
      return `<section id="ns-block-${b.id}" data-diseno-bloque="${b.id}" class="np-block np-${b.tipo} np-${width} np-border-${border}${b.ajuste==='contener' ? ' np-contain' : ''}${b.oculto ? ' np-hidden-preview' : ''}" style="${esc(style)}">
        <div class="np-inner">${content || empty}</div></section>`;
    }).join('')+'</main>';
    const target=Date.parse(event.fecha || '');
    const displays=[...root.querySelectorAll('.np-count')].map(node=>node.querySelectorAll('strong'));
    if (Number.isFinite(target) && displays.length) {
      function tick() {
        const seconds=Math.max(0,Math.floor((target-Date.now())/1000));
        const units=[Math.floor(seconds/86400),Math.floor(seconds/3600)%24,Math.floor(seconds/60)%60,seconds%60];
        for (const display of displays) display.forEach((out,i)=>out.textContent=String(units[i]).padStart(i===0?1:2,'0'));
      }
      tick();
      if (Date.now()<target) window.setInterval(tick,1000);
    }
    return true;
  };
})();
