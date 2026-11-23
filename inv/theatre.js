/* Theatre: public demo, event and admin panel adapter. */
(function(){
 'use strict';
 const VIDEO='https://theatre-demo.thedigitalyes.com/assets/curtain-video-BAKLj3Y5.mp4';
 const MUSIC='https://theatre-demo.thedigitalyes.com/assets/intro-music-CzqJOUtA.mp3';
 const venuePhoto='https://theatre-demo.thedigitalyes.com/assets/venue-illustration-DebdGS8I.png';
 const generic=/(?:^|\/)(?:sobre-portada|apertura-original|melodia-original|jardin-venue)\.(?:jpg|webp|mp4|mp3)(?:[?#]|$)/i;
 function safe(value){
   if(typeof value!=='string'||!value.trim()||value==='__oculto__')return '';
   const v=value.trim();
   if(/^https:\/\//i.test(v))return v;
   if(/^\/(?:ns-atelier-web\/)?(?:inv|assets|images)\//i.test(v))return window.nsSiteUrl(v);
   if(/^(?:\.\/)?assets\//i.test(v))return window.nsSiteUrl('inv/'+v.replace(/^\.\//,''));
   return '';
 }
 function preferred(v,fallback){return (!v||generic.test(v))?fallback:(safe(v)||fallback);}
 function text(node,val){if(node&&val!==null&&val!==undefined&&String(val).trim())node.textContent=String(val).trim();}
 function textKey(root,key,val){text(root.querySelector(`[data-i18n="${key}"]`),val);}
 function updateMedia(root,media){
   const v=root.querySelector('#curtain-video');
   if(v){
     v.muted=true;v.playsInline=true;v.preload='metadata';
     // Same source as the overlay; preserves the open-curtain final video frame.
     v.src=preferred(media.video,VIDEO);v.load();
     v.addEventListener('error',()=>{
       v.style.display='none';
       root.querySelector('#hero-curtain')?.classList.add('curtain-opened');
     },{once:true});
   }
   function image(selector,value){const el=root.querySelector(selector),src=safe(value);if(el&&src){el.src=src;el.decoding='async';el.loading='lazy';}}
   image('img[alt="Villa Medicea di Artimino Illustration"]',media.lugar);
   image('img[alt="Decorative Menu Frame"]',media.flores);
   image('img[alt="Sam & Sofía decorative photo frame"]',media.fotoCierre);
 }
 function applyData(root,data){
   const one=data.nombre1||'Sam',two=data.nombre2||'Sofía';
   const heads=root.querySelectorAll('#hero-curtain h1');
   text(heads[0],one);text(heads[1],two);
   const raw=String(data.fecha||'2027-09-10T16:00:00+02:00');
   const parts=raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
   const d=parts?new Date(Date.UTC(+parts[1],+parts[2]-1,+parts[3])):new Date(raw);
   if(Number.isFinite(d.getTime())){
     const month=d.toLocaleDateString('en-GB',{month:'short',timeZone:'UTC'});
     const monthLong=d.toLocaleDateString('en-GB',{month:'long',timeZone:'UTC'});
     const dateText=data.fechaCorta||`${monthLong} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
     const coins=[...root.querySelectorAll('.scratch-circle .font-display')];
     text(coins[0],String(d.getUTCDate()));
     textKey(root,'coin_month',month);
     text(coins[2],String(d.getUTCFullYear()));
     textKey(root,'venue_date',dateText);
     window.__THEATRE_DATE=raw;
   }
   if(data.lugar){
     const venue=root.querySelector('img[alt="Villa Medicea di Artimino Illustration"]')?.closest('section');
     if(venue){
       const name=venue.querySelector('[data-theatre-venue]');
       if(name)text(name,data.lugar);
     }
   }
   textKey(root,'venue_city',data.direccion||'Artimino, Florence');
   const map=root.querySelector('[data-i18n="view_map"]');
   const mapURL=safe(data.mapaUrl);if(map&&mapURL)map.href=mapURL;
   if(data.vestimenta)textKey(root,'dress_attire',data.vestimenta);
   if(data.mensaje)textKey(root,'hero_message',data.mensaje);
   if(data.despedida)textKey(root,'thanks_desc',data.despedida);
   const iban=root.querySelector('#iban-value'),copy=root.querySelector('#copy-iban-btn');
   if(data.iban){text(iban,data.iban);if(copy){copy.disabled=false;copy.title='Copy IBAN';}}
   else{ text(iban,'Not configured');if(copy){copy.disabled=true;copy.title='No bank details configured';}}
   const pics=['foto1','foto2','foto3'].map(k=>safe((data.medios||{})[k])).filter(Boolean);
   if(pics.length){
     const target=root.querySelector('#reveal-section');
     if(target&&!root.querySelector('.theatre-extra-gallery')){
       const gallery=document.createElement('div');gallery.className='theatre-extra-gallery';
       pics.forEach(src=>{const im=document.createElement('img');im.src=src;im.decoding='async';im.loading='lazy';im.alt='Fotografía de la pareja';gallery.appendChild(im)});
       target.appendChild(gallery);
     }
   }
 }
 function fonts(){
   if(document.getElementById('theatre-fonts'))return;
   const link=document.createElement('link');link.id='theatre-fonts';link.rel='stylesheet';
   link.href='https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Great+Vibes&family=Jost:wght@300;400;500;600&display=swap';
   link.media='print';link.onload=()=>{link.media='all';};document.head.appendChild(link);
 }
 window.renderTheatre=async function(data,template,media,payload){
   const req=await fetch(window.nsSiteUrl('inv/theatre-template.html'),{cache:'force-cache'});
   if(!req.ok)throw Error('No se pudo obtener la plantilla Theatre.');
   const dom=new DOMParser().parseFromString(await req.text(),'text/html');
   const item=dom.querySelector('.theatre-root');
   if(!item||!item.querySelector('#hero-curtain')||!item.querySelector('#rsvp-form')||!item.querySelectorAll('.scratch-canvas').length)
     throw Error('La plantilla Theatre no tiene todos sus elementos interactivos.');
   const mount=document.getElementById('root');mount.replaceChildren(document.importNode(item,true));
   const root=mount.querySelector('.theatre-root');
   const overlay=document.getElementById('weiOverlay');
   overlay.classList.add('theatre-opening');document.body.classList.add('theatre-mode');fonts();
   const colors=data.colores||{};
   if(colors.fondo)root.style.setProperty('--color-paper',colors.fondo);
   if(colors.texto)root.style.setProperty('--color-burgundy',colors.texto);
   if(colors.acento)root.style.setProperty('--burgundy',colors.acento);
   media.sobre=preferred(media.sobre,window.nsSiteUrl('assets/theatre/theatre-opening.webp'));
   media.video=preferred(media.video,VIDEO);
   media.musica=media.musica==='__oculto__'?'__oculto__':preferred(media.musica,MUSIC);
   media.__theatre=true;
   updateMedia(root,media);
   window.__THEATRE_DEMO=payload.tipo!=='evento';
   window.__THEATRE_FORM=data.googleFormUrl||'';
   window.__THEATRE_WHATSAPP=data.whatsapp||'';
   window.__THEATRE_REAPPLY=()=>applyData(root,data);
   window.__THEATRE_REAPPLY();
   if(typeof window.startTheatreOriginal!=='function')throw Error('No se encontró la lógica de Theatre.');
   if('IntersectionObserver' in window && !(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches) && !new URLSearchParams(location.search).has('editor'))
     root.classList.add('theatre-motion-ready');
   window.startTheatreOriginal();
   const hero=root.querySelector('#hero-curtain'),vid=root.querySelector('#curtain-video');
   const show=()=>hero?.classList.add('curtain-opened');
   if(vid){vid.addEventListener('ended',show);vid.addEventListener('error',show);}
   overlay.addEventListener('click',()=>{
     hero?.classList.remove('curtain-opened');
     try{vid?.play()?.catch(()=>show());}catch(_){show();}
     setTimeout(show,1200);
   });
   window.addEventListener('pageshow',show,{once:true});
   document.title='Theatre · N&S ATELIER';
   return root;
 };
})();
