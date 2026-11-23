/* Odette · visor público editable. ID canónico odette; alias noche-dorada.
 * La muestra nunca registra confirmaciones RSVP ni pagos ficticios.
 */
(function(){
  'use strict';
  const ORIGIN='https://template-odette.thedigitalyes.com';
  const COVER='assets/catalogo/odette.webp';
  const INTRO=ORIGIN+'/__l5e/assets-v1/65b140d3-15ac-4976-af1b-b43dabf43b3c/envelope-video-2.mp4';
  const EMPTY=/^(?:sobre-portada|apertura-original|melodia-original|jardin-venue|ornamento)\./i;

  function mediaUrl(value,fallback) {
    const str=String(value||'').trim();
    if(!str||str==='__oculto__'||EMPTY.test(str.split('/').pop()||'')) return fallback||'';
    if(/^https:\/\//.test(str))return str;
    if(/^\/(?:ns-atelier-web\/)?(?:assets|inv|images)\//.test(str))return window.nsSiteUrl(str);
    if(/^(?:\.\/)?assets\//.test(str))return window.nsSiteUrl('inv/'+str.replace(/^\.\//,''));
    return fallback||'';
  }
  function text(el,value) {if(el&&value!==null&&value!==undefined&&String(value).trim())el.textContent=String(value);}
  function el(rv,selector){return rv.querySelector(selector);}
  function readableDate(input) {
    const date=new Date(input);
    if(!Number.isFinite(date.getTime()))return '';
    return date.toLocaleDateString('en-US',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'});
  }
  function setImage(img,value) {
    const src=mediaUrl(value,'');
    if(!img||!src)return;
    img.src=src;
    img.loading='lazy'; img.decoding='async';
  }
  function setMedia(rv,data,media) {
    const poster=window.nsSiteUrl(COVER);
    const heroVideo=el(rv,'#hero video');
    const videoUrl=mediaUrl(media.videoHero,heroVideo?.src||'');
    if(heroVideo&&videoUrl){
      heroVideo.setAttribute('poster',poster);
      heroVideo.src=videoUrl;
      heroVideo.muted=true;
      heroVideo.playsInline=true;
      heroVideo.preload='metadata';
      heroVideo.addEventListener('error',()=>{
        heroVideo.style.opacity='0';
        heroVideo.parentElement.style.background='center / cover no-repeat url("'+poster+'")';
      },{once:true});
      heroVideo.play().catch(()=>{heroVideo.setAttribute('controls','controls');});
    }
    const images=[
      ['#countdown img',media.flores],
      ['#when-where img',media.lugar],
      ['img[src*="schedule-frame"]',media.foto1],
      ['img[src*="dresscode-embroidery"]',media.foto2],
      ['img[src*="mesa-majestic"]',media.foto3],
      ['footer img',media.fotoCierre]
    ];
    for(const [selector,value] of images) {
      if(value&&value!=='__oculto__')setImage(el(rv,selector),value);
    }
    // Si falla algún recurso externo, conservar una ilustración legible.
    rv.querySelectorAll('img').forEach(image=>{
      image.addEventListener('error',()=>{
        if(image.dataset.odetteFallback==='1')return;
        image.dataset.odetteFallback='1';
        image.src=poster;
        image.style.objectFit='contain';
      },{once:true});
    });
  }
  function setTexts(rv,data) {
    const first=data.nombre1||'Waleed',second=data.nombre2||'Julia';
    const date=data.fechaCorta||readableDate(data.fecha)||'September 29, 2026';
    const heroSpans=rv.querySelectorAll('#hero h1 span');
    if(heroSpans.length>=3){text(heroSpans[0],first);text(heroSpans[2],second);}
    const heroDate=rv.querySelector('#hero .flex-1 > span:last-child');
    text(heroDate,date.toUpperCase());
    const foot=rv.querySelector('footer');
    if(foot) {
      text(foot.querySelector('.font-script'),first+' & '+second);
      text(foot.querySelector('.font-semibold'),date);
    }
    const when=rv.querySelector('#when-where');
    const where=when?.querySelectorAll('.absolute.inset-x-0.top-\\[68\\%\\] p')||[];
    if(where.length>=3){
      text(where[0],data.lugar);
      text(where[1],data.direccion);
      text(where[2],date);
    }
    const venueLink=when?.querySelector('a[href*="maps"]');
    if(venueLink&&/^https:\/\//i.test(data.mapaUrl||'')) venueLink.href=data.mapaUrl;
    if(data.vestimenta) {
      const dress=Array.from(rv.querySelectorAll('section')).find(s=>s.textContent.includes('Dress Code'));
      if(dress)text(dress.querySelector('.font-medium'),data.vestimenta);
    }
    if(Array.isArray(data.cronograma)&&data.cronograma.length) {
      const schedule=Array.from(rv.querySelectorAll('section')).find(s=>s.textContent.includes('Schedule'));
      const rows=schedule?.querySelectorAll('.grid.grid-cols-\\[1fr_auto_1fr\\]')||[];
      [...rows].forEach((row,i)=>{
        const e=data.cronograma[i];if(!e){row.hidden=true;return;}
        const labels=row.querySelectorAll('span');
        if(labels.length>=2){text(labels[0],e.hora);text(labels[labels.length-1],e.nombre);}
      });
    }
    if(data.despedida)text(foot?.querySelector('p.font-script'),data.despedida);
  }
  function setCountdown(rv,value) {
    const target=new Date(value||'2026-09-29T15:30:00-03:00').valueOf();
    const spans=rv.querySelectorAll('#countdown .absolute span.font-display');
    function draw(){
      let ms=Math.max(0,target-Date.now());
      const values=[Math.floor(ms/86400000),Math.floor(ms/3600000)%24,
        Math.floor(ms/60000)%60,Math.floor(ms/1000)%60];
      spans.forEach((x,i)=>text(x,String(values[i]||0).padStart(2,'0')));
    }
    draw();const timer=setInterval(()=>{if(!rv.isConnected){clearInterval(timer);return;}draw();},1000);
  }
  function makeReveals(rv) {
    if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    if(new URLSearchParams(location.search).get('editor')==='1')return;
    const nodes=[...rv.querySelectorAll('[data-odette-reveal]')];
    const obs=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('odette-visible');obs.unobserve(entry.target);}});
    },{threshold:.07,rootMargin:'0px 0px 8% 0px'});
    rv.classList.add('odette-motion-ready');
    nodes.forEach(n=>{n.style.setProperty('transition-delay',Math.min(nodes.indexOf(n)%3*75,150)+'ms');obs.observe(n);});
    // Nunca dejar elementos invisibles si el navegador restaura la posición.
    setTimeout(()=>nodes.forEach(n=>{
      const bounds=n.getBoundingClientRect();
      if(bounds.top<innerHeight&&bounds.bottom>0)n.classList.add('odette-visible');
    }),1800);
  }
  function enableGifts(rv,data,payload) {
    const section=Array.from(rv.querySelectorAll('section')).find(s=>s.textContent.includes('Regalos'));
    const btn=section?.querySelector('button[aria-label]');
    if(!btn)return;
    const panel=document.createElement('div');
    panel.className='odette-gifts-detail';
    panel.hidden=true;
    panel.textContent=payload.tipo==='evento'&&data.regalos?
      data.regalos:'El detalle de los regalos se personaliza para cada pareja.';
    btn.after(panel);
    btn.addEventListener('click',()=>{panel.hidden=!panel.hidden;btn.setAttribute('aria-expanded',String(!panel.hidden));});
  }
  function wireRsvp(rv,data,payload) {
    const section=el(rv,'#rsvp');
    const form=section?.querySelector('form');if(!form)return;
    const groups=section.querySelectorAll('[role="radiogroup"]');
    groups.forEach(g=>g.addEventListener('click',event=>{
      const radio=event.target.closest('button[role="radio"]');
      if(!radio||!g.contains(radio))return;
      g.querySelectorAll('button[role="radio"]').forEach(x=>{x.setAttribute('aria-checked',String(x===radio));x.dataset.state=x===radio?'checked':'unchecked';});
    }));
    const stepper=Array.from(form.querySelectorAll('button[type="button"]')).filter(b=>b.textContent.trim()==='+'||b.textContent.trim()==='-');
    const countEl=stepper[0]?.parentElement?.querySelector('span');
    let guests=1;
    stepper.forEach(button=>button.addEventListener('click',()=>{
      guests=Math.max(1,Math.min(10,guests+(button.textContent.trim()==='+'?1:-1)));
      if(countEl)countEl.textContent=String(guests);
      stepper.forEach(b=>b.disabled=b.textContent.trim()==='-'&&guests===1);
    }));
    const namesBlock=Array.from(form.querySelectorAll('input[placeholder="Full Name"]'));
    const feedback=document.createElement('p');
    feedback.className='odette-rsvp-feedback';
    feedback.setAttribute('role','status');feedback.hidden=true;
    form.after(feedback);
    form.addEventListener('submit',event=>{
      event.preventDefault();
      if(!form.reportValidity())return;
      const name=namesBlock[0]?.value.trim()||'Invitado';
      const attend=groups[0]?.querySelector('button[aria-checked="true"]')?.value||'yes';
      const transport=groups[1]?.querySelector('button[aria-checked="true"]')?.value||'no';
      if(payload.tipo==='evento'&&/^https:\/\//i.test(data.googleFormUrl||'')){
        window.open(data.googleFormUrl,'_blank','noopener');return;
      }
      const number=String(data.whatsapp||'').replace(/\D/g,'');
      if(payload.tipo==='evento'&&number.length>=10){
        const msg='RSVP - '+name+' | '+(attend==='yes'?'Asistiré':'No asistiré')+
          ' | Invitados: '+guests+' | Transporte: '+transport;
        window.open('https://wa.me/'+number+'?text='+encodeURIComponent(msg),'_blank','noopener');return;
      }
      feedback.hidden=false;
      feedback.textContent=payload.tipo==='evento'?
        'Esta invitación aún no tiene un destino de RSVP configurado.':'Esta es una demostración. No se ha enviado ni guardado ninguna confirmación.';
    });
    const hero=el(rv,'#hero');
    hero?.querySelector('button')?.addEventListener('click',()=>section.scrollIntoView({behavior:'smooth'}));
    const scrollBtn=hero?.querySelectorAll('button')[1];
    scrollBtn?.addEventListener('click',()=>el(rv,'#countdown')?.scrollIntoView({behavior:'smooth'}));
  }
  function fonts(){
    if(document.getElementById('odette-fonts'))return;
    const link=document.createElement('link');link.id='odette-fonts';link.rel='stylesheet';
    link.href='https://fonts.googleapis.com/css2?family=Great+Vibes&family=Cormorant+Garamond:wght@400;500;600&family=Jost:wght@300;400;500;600&display=swap';
    link.media='print';link.onload=()=>link.media='all';document.head.append(link);
  }
  window.renderOdette=async function renderOdette(data,template,media,payload){
    const response=await fetch(window.nsSiteUrl('inv/odette-template.html'),{cache:'force-cache'});
    if(!response.ok)throw Error('No se pudo cargar la demo Odette.');
    const doc=new DOMParser().parseFromString(await response.text(),'text/html');
    const markup=doc.querySelector('.odette-root');
    if(!markup||!markup.querySelector('#hero')||!markup.querySelector('#rsvp'))throw Error('La plantilla Odette está incompleta.');
    const root=document.getElementById('root');
    root.replaceChildren(document.importNode(markup,true));
    const rv=el(root,'.odette-root');
    fonts();document.body.classList.add('odette-mode');
    if(data.colores?.fondo)rv.style.background=data.colores.fondo;
    if(data.colores?.texto)rv.style.color=data.colores.texto;
    setTexts(rv,data);setMedia(rv,data,media);setCountdown(rv,data.fecha);
    wireRsvp(rv,data,payload);enableGifts(rv,data,payload);makeReveals(rv);
    media.sobre=mediaUrl(media.sobre,window.nsSiteUrl(COVER));
    media.video=mediaUrl(media.video,INTRO);
    media.__odette=true;
    document.getElementById('weiOverlay').classList.add('odette-opening');
    document.title='Odette · N&S ATELIER';
    return rv;
  };
})();
