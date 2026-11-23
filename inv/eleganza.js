/* Eleganza · adaptador del HTML de Alessia y Matteo.
 * IDs públicos canónicos: eleganza. Alias heredado: jardin-eterno.
 */
(function(){
  'use strict';
  const SITE='https://template-eleganza.thedigitalyes.com/__l5e/assets-v1/';
  const MEDIA={
    sobre:SITE+'6723d25f-ddc5-4eaf-bad3-fc4055c37c4d/eleganza-poster.jpg',
    video:SITE+'05b5d3ba-6bd3-4ea8-a841-58d6ff656661/eleganza.mp4',
    hero:SITE+'8fb78d79-0490-4642-b16b-185377d48444/hero-frame-oval.png',
    when:SITE+'3915452c-8a51-4f96-8e6f-42ee02b69673/when-where-frame.png',
    venue:SITE+'485f0f75-d204-407c-b2c2-53409fce7922/venue-villa.png',
    programme:SITE+'ecd1261b-1ba0-4778-9268-da6cc192e797/programme-linen.png',
    dress:SITE+'0fdede2c-f70e-4a98-ae71-81f0c9a85d04/dress-code-frame.png',
    gifts:SITE+'f1b926d0-7ea3-45d2-9101-954ae88ea171/gifts-frame.png',
    rsvp:SITE+'f8dd714c-0111-4644-b87b-b539bfc093c2/rsvp-frame.png',
    footer:SITE+'f3d34d2c-bd46-449a-8527-094613acd545/footer-frame.png'
  };
  const legacy=/^\/?(?:inv\/assets\/)?(?:sobre-portada|apertura-original|melodia-original|jardin-venue|ornamento)\.(?:jpg|webp|png|mp4|mp3|svg)$/i;
  function valid(value) {
    if(!value||typeof value!=='string'||value==='__oculto__')return '';
    if(/^https:\/\//i.test(value))return value;
    if(/^\/(?:ns-atelier-web\/)?(?:inv|assets|images)\//i.test(value))return window.nsSiteUrl(value);
    return '';
  }
  function selected(value,fallback) {
    if(!value || value==='__oculto__'||legacy.test(value))return fallback;
    return valid(value)||fallback;
  }
  function setText(el,value){if(el&&value!==null&&value!==undefined&&String(value).trim())el.textContent=String(value);}
  function fmtDate(input) {
    const date=new Date(input);
    if(!Number.isFinite(date.valueOf()))return '';
    const m=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    return date.getDate()+' de '+m[date.getMonth()]+' de '+date.getFullYear();
  }
  function applyPictures(rv,media) {
    const q=selector=>rv.querySelector(selector);
    function img(selector,value,fallback){
      const el=q(selector),url=selected(value,fallback);
      if(el&&url){el.src=url;el.decoding='async';el.loading='lazy';}
    }
    img('#hero-section img',media.flores,MEDIA.hero);
    img('#when-where img',media.foto1,MEDIA.when);
    img('img[src*="venue-villa.png"]',media.lugar,MEDIA.venue);
    img('img[src*="dress-code-frame.png"]',media.foto3,MEDIA.dress);
    img('img[src*="programme-linen.png"]',media.foto2,MEDIA.programme);
    img('img[src*="gifts-frame.png"]',media.regalosImagen,MEDIA.gifts);
    img('img[src*="rsvp-frame.png"]',media.rsvpImagen,MEDIA.rsvp);
    img('footer img[src*="footer-frame.png"]',media.fotoCierre,MEDIA.footer);
  }
  function applyTexts(rv,data) {
    const n1=data.nombre1||'Alessia', n2=data.nombre2||'Matteo';
    const date=data.fechaCorta || fmtDate(data.fecha) || '12 September 2027';
    const hero=rv.querySelector('#hero-section');
    const names=hero?.querySelectorAll('h1 span');
    if(names?.length>=3){setText(names[0],n1);setText(names[2],n2);}
    const hp=hero?.querySelectorAll('div.mt-10 p');
    if(hp?.length) setText(hp[0],date);
    const when=rv.querySelector('#when-where');
    const where=when?.querySelector('div.font-body.leading-relaxed');
    const wherePs=where?.querySelectorAll('p')||[];
    if(wherePs.length>=4){
      setText(wherePs[0],data.lugar);
      setText(wherePs[1],data.direccion);
      setText(wherePs[2],date);
    }
    const heroLocation=hero?.querySelectorAll('p')||[];
    if(heroLocation.length>=2) setText(heroLocation[heroLocation.length-1],data.direccion);
    const sections=[...rv.querySelectorAll('section')];
    const venue=sections.find(s=>s.textContent.includes('Our Venue'));
    if(venue){
      const ps=venue.querySelectorAll('p');
      if(ps.length>=3){setText(ps[1],data.lugar);setText(ps[2],data.direccion);}
    }
    const celebrations=sections.find(s=>s.textContent.includes('The Celebrations'));
    if(celebrations){
      const title=celebrations.querySelector('h3');
      if(title&&data.lugar)title.textContent=data.lugar;
      const dateLabel=[...celebrations.querySelectorAll('p')].find(p=>p.textContent.includes('12 September 2027'));
      setText(dateLabel,date);
    }
    if(data.vestimenta){
      const dressText=[...rv.querySelectorAll('p')].find(p=>p.textContent.includes('Italian Garden Formal'));
      setText(dressText,data.vestimenta);
    }
    if(data.regalos){
      const gift=sections.find(s=>s.textContent.includes('A Thoughtful Gesture'));
      const copy=gift?.querySelector('.font-body.leading-relaxed p');
      setText(copy,data.regalos);
    }
    if(data.rsvpLimite){
      const txt=rv.querySelector('#rsvp h2 + p');
      setText(txt,data.rsvpLimite);
    }
    const footer=rv.querySelector('footer');
    if(footer){
      const ps=footer.querySelectorAll('p');
      if(ps.length>=3) {
        setText(ps[0],data.despedida);
        setText(ps[1],(n1+' & '+n2).toUpperCase());
        setText(ps[2],(data.lugar||'LAKE COMO')+' · '+date);
      }
    }
    if(data.mapaUrl&&/^https:\/\//i.test(data.mapaUrl)){
      rv.querySelectorAll('a[href*="maps"]').forEach(link=>link.href=data.mapaUrl);
    }
    const schedules=rv.querySelector('img[src*="programme-linen.png"]')?.parentElement;
    const rows=schedules?.querySelectorAll('.flex.items-baseline');
    if(rows?.length&&Array.isArray(data.cronograma)&&data.cronograma.length){
      [...rows].forEach((row,i)=>{
        const entry=data.cronograma[i];
        if(!entry){row.style.visibility='hidden';return;}
        const spans=row.querySelectorAll('span');
        if(spans.length>=3){
          const time=String(entry.hora||'').trim().split(' ');
          setText(spans[0],time[0]||'');
          setText(spans[1],time.slice(1).join(' ')||'');
          setText(spans[2],entry.nombre||'');
        }
      });
    }
    const iban=rv.querySelector('#iban-text');
    const copy=rv.querySelector('#copy-iban-btn');
    if(iban) {
      if(data.iban){iban.textContent=data.iban;if(copy)copy.disabled=false;}
      else {iban.textContent='Datos bancarios no configurados';if(copy){copy.disabled=true;copy.title='No se aceptan pagos en esta demo';}}
    }
  }
  function setupFonts(){
    if(document.getElementById('eleganza-fonts'))return;
    const link=document.createElement('link');
    link.id='eleganza-fonts';
    link.rel='stylesheet';
    link.href='https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Jost:wght@300;400;500&display=swap';
    link.media='print';link.onload=()=>link.media='all';
    document.head.appendChild(link);
  }
  // Revelado editorial: únicamente imágenes, nunca ocultar secciones ni formularios.
  // El estado inicial es totalmente visible si JavaScript o IntersectionObserver fallan.
  function initEleganzaImageReveals(rv) {
    if (!rv || !('IntersectionObserver' in window)) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // El editor debe mostrar siempre todas las imágenes para poder seleccionarlas.
    if (new URLSearchParams(location.search).get('editor') === '1') return;

    // La portada permanece visible al salir del video. Los marcos aparecen al deslizar.
    const images = [...rv.querySelectorAll('section img, footer img')]
      .filter(img => !img.closest('#hero-section'));
    if (!images.length) return;

    const perSection = new Map();
    const reveal = (img) => {
      if (!img.isConnected || img.classList.contains('ele-image-visible')) return;
      img.classList.add('ele-image-visible');
    };
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const img = entry.target;
        observer.unobserve(img);
        // Una imagen lenta se revela después de cargar, no de golpe a mitad del efecto.
        if (img.complete) {
          reveal(img);
        } else {
          img.addEventListener('load', () => reveal(img), {once:true});
          img.addEventListener('error', () => reveal(img), {once:true});
          // Respaldo: jamás dejar un marco invisible por un recurso externo lento.
          setTimeout(() => reveal(img), 3500);
        }
      }
    }, {threshold:0.12, rootMargin:'0px 0px -6% 0px'});

    for (const img of images) {
      const section = img.closest('section, footer') || rv;
      const order = perSection.get(section) || 0;
      perSection.set(section, order + 1);
      img.style.setProperty('--ele-image-delay', Math.min(order * 135, 270) + 'ms');
      img.classList.add('ele-image-reveal');
    }
    rv.classList.add('ele-motion-ready');
    requestAnimationFrame(() => images.forEach(img => observer.observe(img)));

    // Soporte para volver desde otra pestaña, restauración y visores móviles.
    const revealOnScreen = () => {
      if (!rv.isConnected) {observer.disconnect();return;}
      for (const img of images) {
        const rect = img.getBoundingClientRect();
        if (rect.bottom >= 0 && rect.top < window.innerHeight * .9 && img.complete)
          reveal(img);
      }
    };
    setTimeout(revealOnScreen, 1800);
    window.addEventListener('pageshow', revealOnScreen, {passive:true});
  }

  window.renderEleganza=async function(data,template,media,payload){
    const reply=await fetch(window.nsSiteUrl('inv/eleganza-template.html'),{cache:'force-cache'});
    if(!reply.ok)throw Error('No se encontró la maqueta completa de Eleganza.');
    const doc=new DOMParser().parseFromString(await reply.text(),'text/html');
    const source=doc.querySelector('.eleganza-root');
    if(!source || !source.querySelector('#rsvp-form') || !source.querySelector('#hero-section'))
      throw Error('El diseño Eleganza está incompleto.');
    setupFonts();
    const root=document.getElementById('root');
    root.replaceChildren(document.importNode(source,true));
    const rv=root.querySelector('.eleganza-root');
    document.body.classList.add('eleganza-mode');
    if(data.colores?.fondo)rv.style.setProperty('--color-background',data.colores.fondo);
    if(data.colores?.texto)rv.style.setProperty('--color-foreground',data.colores.texto);
    if(data.colores?.acento)rv.style.setProperty('--color-primary',data.colores.acento);
    applyTexts(rv,data);
    applyPictures(rv,media);
    const intro=document.getElementById('weiOverlay');
    intro.classList.add('eleganza-opening');
    media.sobre=selected(media.sobre,MEDIA.sobre);
    media.video=selected(media.video,MEDIA.video);
    media.__eleganza=true;
    window.__ELE_DATE=data.fecha||'2027-09-12T17:00:00+02:00';
    window.__ELE_DEMO=payload.tipo!=='evento';
    window.__ELE_RSVP_FORM=data.googleFormUrl||'';
    window.__ELE_WHATSAPP=data.whatsapp||'';
    if(typeof window.startEleganzaOriginal!=='function')
      throw Error('Las interacciones originales de Eleganza no están disponibles.');
    window.startEleganzaOriginal();
    initEleganzaImageReveals(rv);
    // La música ambiental del HTML original se activa solo con la primera interacción.
    if(!media.musica){
      intro.addEventListener('click',()=>{try{window.__startEleganzaAudio?.();}catch(_){}},{once:true});
    }else{
      const ambient=rv.querySelector('#audio-toggle-btn');
      if(ambient)ambient.hidden=true;
    }
    const dock=document.getElementById('fabDock'),amb=rv.querySelector('#audio-toggle-btn');
    if(dock&&amb) {
      const sync=()=>amb.classList.toggle('is-idle',dock.classList.contains('is-idle')||!dock.classList.contains('visible'));
      new MutationObserver(sync).observe(dock,{attributes:true,attributeFilter:['class']});
      sync();
    }
    document.title='Eleganza · N&S ATELIER';
    return rv;
  };
})();
