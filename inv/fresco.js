/* Fresco — editor, demo, and public invitation adapter for N&S ATELIER. */
(function(){
  'use strict';
  const BASE='https://fresco-template.thedigitalyes.com/';
  const DEFAULTS=Object.freeze({
    poster:BASE+'assets/envelope-poster-dG0TpNIf.jpg',
    opening:BASE+'assets/envelope-video-f1CdBR2C.mp4',
    hero:BASE+'__l5e/assets-v1/247a73e0-2b7c-40c3-9a13-bb13a0df66d8/hero-video.mp4',
    heroPoster:BASE+'__l5e/assets-v1/89172c20-f8b3-49b8-92c4-6587b23564cc/fresco-hero-original.jpg'
  });
  const generic=/(?:^|\/)(?:sobre-portada|apertura-original|melodia-original|jardin-venue)\.(?:jpg|webp|mp4|mp3)(?:[?#]|$)/i;
  function url(value){
    if(typeof value!=='string'||!value||value==='__oculto__')return '';
    if(/^https:\/\//i.test(value))return value;
    if(/^\/(?:ns-atelier-web\/)?(?:inv|assets|images)\//i.test(value))return window.nsSiteUrl(value);
    if(/^(?:\.\/)?assets\//i.test(value))return window.nsSiteUrl('inv/'+value.replace(/^\.\//,''));
    return '';
  }
  function asset(value,fallback){return generic.test(value||'')?fallback:url(value)||fallback||'';}
  function text(el,value){if(el&&value!==undefined&&value!==null&&String(value).trim())el.textContent=String(value).trim();}
  function find(root,s){return root.querySelector(s);}
  function updateMedia(root,media){
    const hero=find(root,'#hero-video');
    if(hero){
      const heroURL=asset(media.videoHero,DEFAULTS.hero);
      hero.poster=DEFAULTS.heroPoster;
      hero.muted=true;hero.playsInline=true;hero.preload='metadata';
      if(heroURL){hero.src=heroURL;hero.load();}
      hero.addEventListener('error',()=>{hero.style.background='linear-gradient(150deg,#ede4d4,#c0cab6)';},{once:true});
    }
    const setImage=(selector,value)=>{
      const image=find(root,selector),imageURL=url(value);
      if(image&&imageURL){image.src=imageURL;image.decoding='async';image.loading='lazy';}
    };
    setImage('img[alt="Mediterranean garden fountain illustration"]',media.lugar);
    setImage('img[alt="Mediterranean floral arch"]',media.flores);
    setImage('img[alt="Son Bunyola Mediterranean villa illustration"]',media.fotoCierre);
  }
  function applyTexts(root,data){
    const one=data.nombre1||'Diana',two=data.nombre2||'Richard';
    text(find(root,'#fresco-name-one'),one);
    text(find(root,'#fresco-name-two'),two);
    const date=new Date(data.fecha||'2027-07-27T17:30:00+02:00');
    const valid=Number.isFinite(date.getTime());
    // Match the local calendar date in the configured ISO string, not the visitor's timezone.
    const raw=String(data.fecha||'2027-07-27T17:30:00+02:00');
    const dayIso=raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
    const calendar=dayIso?new Date(Date.UTC(+dayIso[1],+dayIso[2]-1,+dayIso[3])):date;
    const locale='en-GB';
    if(valid){
      const month=calendar.toLocaleDateString(locale,{month:'long',timeZone:'UTC'});
      const weekday=calendar.toLocaleDateString(locale,{weekday:'long',timeZone:'UTC'});
      const dateText=data.fechaCorta||calendar.toLocaleDateString(locale,{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'UTC'});
      text(find(root,'[data-i18n="hero_month"]'),month);
      const block=find(root,'[data-i18n="hero_month"]')?.parentElement;
      if(block){
        const spans=block.querySelectorAll(':scope > span');
        if(spans[1])text(spans[1],String(calendar.getUTCDate()));
        const year=spans[3];if(year)text(year,String(calendar.getUTCFullYear()));
      }
      text(find(root,'[data-i18n="hero_day"]'),weekday);
      text(find(root,'[data-i18n="countdown_until"]'),'Until '+dateText);
      text(find(root,'[data-i18n="celebration_date"]'),dateText);
      text(find(root,'[data-i18n="day_subtitle"]'),'Program · '+weekday+' '+calendar.getUTCDate()+' '+month);
      text(find(root,'#program-section .heart-beat + span'),String(calendar.getUTCDate()));
      window.__FRESCO_DATE=raw;
    }
    const venue=data.lugar||'Son Bunyola, Mallorca';
    const addr=data.direccion||'Mallorca, Spain';
    const heroLocation=find(root,'#hero-section .hero-stagger.flex.flex-col.items-center p.font-display');
    text(heroLocation,venue);
    const celebration=[...root.querySelectorAll('section h2')].find(h=>h.textContent.trim()==='The Celebration')?.closest('section');
    if(celebration){
      text(celebration.querySelector('h3'),venue);
      const map=celebration.querySelector('a[href*="maps"]');
      const mapURL=url(data.mapaUrl);
      if(mapURL)map.href=mapURL;
    }
    if(data.vestimenta)text(find(root,'[data-i18n="dress_subtitle"]'),data.vestimenta);
    if(data.rsvpLimite)text(find(root,'[data-i18n="rsvp_deadline"]'),data.rsvpLimite);
    if(data.mensaje)text(find(root,'[data-i18n="story_p1"]'),data.mensaje);
    if(data.despedida){
      const footer=root.querySelector('footer');
      if(footer){const h=footer.querySelector('h2');text(h,data.despedida);}
    }
    const rows=[...root.querySelectorAll('#timeline-track .space-y-9 > .relative.reveal')];
    if(Array.isArray(data.cronograma)&&data.cronograma.length){
      rows.forEach((row,i)=>{
        const entry=data.cronograma[i];if(!entry){row.hidden=true;return;}
        text(row.querySelector('p.font-body.text-\\[10px\\]'),entry.hora);
        text(row.querySelector('p[data-i18n]'),entry.nombre);
      });
    }
    const iban=find(root,'#bank-iban'),bic=find(root,'#bank-bic'),copy=find(root,'#copy-bank-btn');
    if(data.iban){text(iban,data.iban);if(copy)copy.disabled=false;}
    else {text(iban,'Not configured in this demo');if(copy){copy.disabled=true;copy.title='Bank details are not configured';}}
    if(data.bic)text(bic,data.bic);else text(bic,'—');
    // Optional customer photos stay separate from original Fresco illustrations.
    const pics=['foto1','foto2','foto3'].map(k=>url((data.medios||{})[k])).filter(Boolean);
    if(pics.length){
      const story=find(root,'#our-story');
      if(story){
        const gallery=document.createElement('div');gallery.className='fresco-customer-photos';
        for(const path of pics){
          const image=document.createElement('img'); image.src=path;image.loading='lazy';image.decoding='async';image.alt='Fotografía de los novios';
          gallery.appendChild(image);
        }
        story.appendChild(gallery);
      }
    }
    return {one,two,venue,addr};
  }
  function fonts(){
    if(document.getElementById('fresco-fonts'))return;
    const link=document.createElement('link');link.id='fresco-fonts';link.rel='stylesheet';
    link.href='https://fonts.googleapis.com/css2?family=Alex+Brush&family=Caveat:wght@400;500;600&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Jost:wght@300;400;500&family=Pinyon+Script&display=swap';
    link.media='print';link.onload=()=>{link.media='all';};document.head.appendChild(link);
  }
  window.renderFresco=async function(data,template,media,payload){
    const r=await fetch(window.nsSiteUrl('inv/fresco-template.html'),{cache:'force-cache'});
    if(!r.ok)throw Error('No se encontró la plantilla Fresco completa.');
    const documentHTML=new DOMParser().parseFromString(await r.text(),'text/html');
    const source=documentHTML.querySelector('.fresco-root');
    if(!source||!source.querySelector('#rsvp-form')||!source.querySelector('#hero-section')||!source.querySelector('#bank-modal'))
      throw Error('La plantilla Fresco está incompleta.');
    const mount=document.getElementById('root');mount.replaceChildren(document.importNode(source,true));
    const root=mount.querySelector('.fresco-root');
    const overlay=document.getElementById('weiOverlay');
    overlay.classList.add('fresco-opening');
    document.body.classList.add('fresco-mode');
    fonts();
    const colors=data.colores||{};
    if(colors.fondo)root.style.setProperty('--color-background',colors.fondo);
    if(colors.texto)root.style.setProperty('--color-foreground',colors.texto);
    if(colors.acento){root.style.setProperty('--color-primary',colors.acento);root.style.setProperty('--color-olive',colors.acento);}
    media.sobre=asset(media.sobre,DEFAULTS.poster);
    media.video=asset(media.video,DEFAULTS.opening);
    media.__fresco=true;
    updateMedia(root,media);
    window.__FRESCO_DEMO=payload.tipo!=='evento';
    window.__FRESCO_FORM=data.googleFormUrl||'';
    window.__FRESCO_WHATSAPP=data.whatsapp||'';
    window.__applyFrescoData=()=>applyTexts(root,data);
    window.__applyFrescoData();
    if(typeof window.startFrescoOriginal!=='function')throw Error('No se encontró el motor interactivo de Fresco.');
    if('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches && new URLSearchParams(location.search).get('editor')!=='1')
      root.classList.add('fresco-motion-ready');
    window.startFrescoOriginal();
    // First user gesture opens the envelope; preserve ambient music without double playback.
    const ambient=root.querySelector('#audio-toggle-btn');
    if(media.musica && media.musica!=='__oculto__') {
      if(ambient)ambient.hidden=true;
    } else {
      media.musica='__oculto__';
      overlay.addEventListener('click',()=>{
        try{window.__showFrescoAudioBtn?.();window.__startFrescoAudio?.();}catch(_){}
      },{once:true});
    }
    const hero=root.querySelector('#hero-section');
    const video=root.querySelector('#hero-video');
    overlay.addEventListener('click',()=>{
      try{video?.play()?.catch(()=>{});}catch(_){}
      setTimeout(()=>hero?.classList.add('hero-ready'),900);
    },{once:true});
    window.addEventListener('pageshow',()=>hero?.classList.add('hero-ready'),{once:true});
    document.title='Fresco · N&S ATELIER';
    return root;
  };
})();
