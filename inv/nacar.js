/* Nácar — integración pública del HTML suministrado. ID interno: olivo-marfil.
 * Las plantillas privadas con ese ID conservan su renderizador anterior.
 */
(function () {
  'use strict';
  const SRC = Object.freeze({
    seal: 'https://motherofpearl.thedigitalyes.com/__l5e/assets-v1/ded5dc3b-2809-4259-a52d-b90d16eebd6d/footer-seal.png',
    opening: 'https://motherofpearl.thedigitalyes.com/__l5e/assets-v1/7781d503-b1ec-46c6-bc7b-d41a48374f14/intro-bridge.mp4',
    frame: 'https://motherofpearl.thedigitalyes.com/__l5e/assets-v1/e4c841be-b806-4cde-b447-86c587fc090b/hero-frame.png',
    photo: 'https://motherofpearl.thedigitalyes.com/__l5e/assets-v1/b046e35e-445d-4ccc-a1fb-979e535f3261/couple-scratch.png',
    venue: 'https://motherofpearl.thedigitalyes.com/__l5e/assets-v1/ecfb6efe-f4df-4d4a-8b1b-8256d7086d6f/venue-illustration.png',
    attire: 'https://motherofpearl.thedigitalyes.com/__l5e/assets-v1/97476ad4-c3da-4edf-8db5-e0e4af770951/dresscode-attire-2.png'
  });
  const legacy = /(?:sobre-portada|apertura-original|melodia-original|jardin-venue|ornamento)\.(?:jpg|webp|png|mp4|mp3|svg)/i;
  const url = v => {
    const str = String(v || '').trim();
    if (!str || str === '__oculto__') return '';
    if (/^https:\/\//i.test(str)) return str;
    if (/^\/(?:ns-atelier-web\/)?(?:inv|assets|images|demos)\//i.test(str))
      return window.nsSiteUrl(str);
    if (/^(?:\.\/)?assets\//i.test(str)) return window.nsSiteUrl('inv/' + str.replace(/^\.\//,''));
    return '';
  };
  function source(value, fallback) {
    if (!value || value === '__oculto__' || legacy.test(value)) return fallback;
    return url(value) || fallback;
  }
  function put(selector, value, base) {
    if (!value && value !== 0) return;
    const el=base.querySelector(selector);
    if (el) el.textContent=String(value);
  }
  function image(selector,value,base) {
    const el=base.querySelector(selector),src=url(value);
    if(el && src) {el.src=src;el.decoding='async';el.loading='lazy';}
  }
  function prettyDate(iso) {
    const date=new Date(iso);
    if(!Number.isFinite(date.valueOf()))return '';
    return String(date.getDate()).padStart(2,'0')+'.'+String(date.getMonth()+1).padStart(2,'0')+'.'+date.getFullYear();
  }
  function configureIntro(data,media) {
    const overlay=document.getElementById('weiOverlay');
    const seal=source(media.sobre,SRC.seal);
    overlay.classList.add('nacar-opening');
    overlay.innerHTML=[
      '<div class="nacar-welcome">',
      '<p>You Are Invited</p>',
      '<img id="weiImg" alt="Sello de Nácar para abrir la invitación" draggable="false">',
      '<div id="weiTapWrap"><div id="weiTapLabel">Tap to open</div></div>',
      '<h2 id="nacarWelcomeNames"></h2>',
      '</div>'
    ].join('');
    document.getElementById('weiImg').src=seal;
    const tx=data.textos||{};
    put('#weiTapLabel',tx.tapAbrir||'Tap to open',overlay);
    put('#nacarWelcomeNames',(data.nombre1||'Cornelia')+' & '+(data.nombre2||'James'),overlay);
    media.sobre=seal;
    media.video=source(media.video,SRC.opening);
    // El HTML original incluye música ambiental sintetizada en el botón de la demo.
    // No activar simultáneamente el viejo MP3 genérico de Jardín de Olivo.
    if(legacy.test(media.musica||''))media.musica='';
  }
  function setSchedule(rv,items) {
    if(!Array.isArray(items)||!items.length)return;
    const sec=[...rv.querySelectorAll('section')].find(s=>/the\s*day/i.test(s.textContent));
    const list=sec?.querySelector('.space-y-10');
    if(!list)return;
    const rows=[...list.children];
    const sample=rows[0];
    if(!sample)return;
    list.replaceChildren();
    items.slice(0,12).forEach(item=>{
      if(!item || typeof item!=='object')return;
      const row=sample.cloneNode(true);
      const tim=row.querySelector('.font-display');
      const title=row.querySelector('.font-body');
      const detail=row.querySelector('.font-helvetica');
      if(tim)tim.textContent=item.hora||'';
      if(title)title.textContent=item.nombre||'';
      if(detail)detail.textContent=item.detalle||'';
      list.appendChild(row);
    });
  }
  function applyTexts(rv,data,template) {
    const name1=data.nombre1||'Cornelia',name2=data.nombre2||'James';
    const date=data.fechaCorta||prettyDate(data.fecha)||'20.05.2027';
    const hero=rv.querySelector('#hero-content');
    const n=hero?.querySelectorAll('h1.font-ballet');
    if(n?.length>=2){n[0].textContent=name1;n[1].textContent=name2;}
    const lead=hero?.querySelectorAll(':scope > p');
    if(lead?.length>=2)lead[1].textContent=date;
    const loc=hero?.querySelector(':scope > div:last-child');
    const v=loc?.querySelectorAll('p');
    if(v?.length>=2){if(data.lugar)v[0].textContent=data.lugar;if(data.direccion)v[1].textContent=data.direccion;}
    const sections=[...rv.querySelectorAll('section')];
    const venue=sections.find(s=>s.querySelector('h2')?.textContent.trim()==='Location');
    if(venue){
      if(data.lugar)put('p.font-doulaise',data.lugar,venue);
      if(data.direccion){const p=venue.querySelectorAll('p');if(p.length>1)p[1].textContent=data.direccion;}
      const map=venue.querySelector('a[href*="google.com/maps"]');
      if(map && /^https:\/\//.test(data.mapaUrl||''))map.href=data.mapaUrl;
    }
    if(data.vestimenta){
      const dress=sections.find(s=>s.textContent.includes('Formal Attire'));
      if(dress)put('p.font-doulaise',data.vestimenta,dress);
    }
    if(data.regalos){
      const gifts=sections.find(s=>/wedding\s*gift/i.test(s.textContent));
      if(gifts){const ps=gifts.querySelectorAll('p.font-display');if(ps.length)ps[0].textContent=data.regalos;}
    }
    if(data.rsvpLimite){
      const rsvp=rv.querySelector('#rsvp');
      if(rsvp){const copy=rsvp.querySelector('div.text-center p');if(copy)copy.textContent=data.rsvpLimite;}
    }
    const footer=rv.querySelector('footer');
    if(footer){
      const names=footer.querySelector('p.font-doulaise');
      if(names)names.textContent=name1+' & '+name2;
      const dateP=footer.querySelector('p:last-child');
      if(dateP)dateP.textContent=date;
      if(data.despedida){
        const copy=footer.querySelector('p.font-display');
        if(copy)copy.textContent=data.despedida;
      }
    }
    const registry=rv.querySelector('#registry-modal');
    if(registry){
      put('h3',data.textos?.tituloRegalos||'Wedding Gift',registry);
      const p=registry.querySelector('p.font-display');
      if(p)p.textContent=name1+' & '+name2;
      if(!data.iban){
        put('#iban-value','DEMO — Sin datos de pago',registry);
        const copyBtn=registry.querySelector('#copy-iban-btn');
        if(copyBtn){copyBtn.disabled=true;copyBtn.title='No se aceptan pagos en la demo';}
      }else put('#iban-value',data.iban,registry);
    }
    setSchedule(rv,data.cronograma);
  }
  function applyMedia(rv,media) {
    const custom=(key,defaultUrl)=>source(media[key],defaultUrl);
    image('section img[src*="hero-frame.png"]',custom('flores',SRC.frame),rv);
    image('#scratch-container > img',custom('foto1',SRC.photo),rv);
    image('img[src*="venue-illustration.png"]',custom('lugar',SRC.venue),rv);
    image('img[src*="dresscode-attire-2.png"]',custom('foto2',SRC.attire),rv);
    if(media.fotoCierre && !legacy.test(media.fotoCierre))
      image('footer > img',media.fotoCierre,rv);
    else if(media.sello && !legacy.test(media.sello))
      image('footer > img',media.sello,rv);
  }
  window.renderNacar=async function renderNacar(data,template,media,payload) {
    const res=await fetch(window.nsSiteUrl('inv/nacar-template.html'),{cache:'force-cache'});
    if(!res.ok)throw Error('No se pudo cargar el HTML de Nácar.');
    const doc=new DOMParser().parseFromString(await res.text(),'text/html');
    const markup=doc.querySelector('.nacar-root');
    if(!markup||!markup.querySelector('#scratch-container')||!markup.querySelector('#rsvp-form'))
      throw Error('La estructura interactiva de Nácar está incompleta.');
    const root=document.getElementById('root');
    if(!document.getElementById('nacar-fonts')) {
      const font=document.createElement('link');
      font.id='nacar-fonts';
      font.rel='stylesheet';
      font.href='https://fonts.googleapis.com/css2?family=Ballet:opsz@16..72&family=Jost:wght@300;400;500&family=Monsieur+La+Doulaise&display=swap';
      font.media='print';
      font.onload=()=>{font.media='all';};
      document.head.append(font);
    }
    root.replaceChildren(document.importNode(markup,true));
    const rv=root.querySelector('.nacar-root');
    const colors=data.colores||{};
    if(colors.fondo)rv.style.setProperty('--color-background',colors.fondo);
    if(colors.texto)rv.style.setProperty('--color-foreground',colors.texto);
    // Portada y video del diseño original si no hay un archivo personalizado.
    configureIntro(data,media);
    applyTexts(rv,data,template);
    applyMedia(rv,media);
    const date=data.fecha||'2027-05-20T16:30:00+02:00';
    window.__NACAR_DATE=date;
    window.__NACAR_DEMO=payload.tipo!=='evento';
    window.__NACAR_RSVP_FORM=data.googleFormUrl||'';
    window.__NACAR_WHATSAPP=data.whatsapp||'';
    if(media.musica){
      const ambient=rv.querySelector('#audio-toggle-btn');
      if(ambient)ambient.style.display='none';
    }
    if(typeof window.startNacarOriginal!=='function')
      throw Error('El motor de interacciones de Nácar no está disponible.');
    window.startNacarOriginal();
    // El audio ambiental original inicia con el mismo toque que abre la invitación.
    if (!media.musica) {
      document.getElementById('weiOverlay')?.addEventListener('click',() => {
        try {window.__startWeddingAudio?.();} catch (_) {}
      },{once:true});
    }
    const originalAudio=rv.querySelector('#audio-toggle-btn');
    const dock=document.getElementById('fabDock');
    if(originalAudio && dock) {
      const sync=()=>originalAudio.classList.toggle('nacar-idle',dock.classList.contains('is-idle'));
      new MutationObserver(sync).observe(dock,{attributes:true,attributeFilter:['class']});
      sync();
    }
    document.title='Nácar · N&S ATELIER';
    return rv;
  };
})();
