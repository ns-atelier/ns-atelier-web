/* Dolce Vita · nuevo modelo público y editable, basado en el HTML original. */
(function () {
  'use strict';
  const DEFAULTS = Object.freeze({
    seal:'https://static.tildacdn.net/tild6164-3830-4431-b133-666364353937/Untitled_Project_7.png',
    flaps:[
      'https://static.tildacdn.net/tild6338-3733-4431-a363-306634383864/Polygon_4.png',
      'https://static.tildacdn.net/tild3636-6566-4132-b665-343766326335/Polygon_3.png',
      'https://static.tildacdn.net/tild6262-6339-4933-b833-343039643037/Polygon_2_1.png',
      'https://static.tildacdn.net/tild3762-3738-4361-b134-333538333135/Polygon_1_3.png'
    ],
    music:'https://pub-4dc8201144ca418fb604349c73e8c724.r2.dev/Forever%20and%20Ever%20and%20Always%20(The%20Wedding%20Song)%20-%20Ryan%20Mack%20(1).mp3',
    hero:'https://pub-4dc8201144ca418fb604349c73e8c724.r2.dev/Italian_villa_terrace_202604231419%20(1).MP4',
    venue:'https://static.tildacdn.net/tild3361-3537-4334-b532-323531306235/8cdb6addd9fcedfeb54b.jpg',
    photo:'https://static.tildacdn.net/tild3965-6266-4165-b837-303236623330/elegant-couple-love-.jpg'
  });
  const generic=/(?:^|\/)(?:sobre-portada|apertura-original|melodia-original|jardin-venue|ornamento)\.(?:webp|jpg|mp4|mp3|svg)(?:[?#]|$)/i;
  const canonicalURL=value=>{
    if(typeof value!=='string'||!value||value==='__oculto__')return '';
    if(/^https:\/\//i.test(value))return value;
    if(/^\/(?:ns-atelier-web\/)?(?:inv|assets|images)\//i.test(value))return window.nsSiteUrl(value);
    if(/^(?:\.\/)?assets\//i.test(value))return window.nsSiteUrl('inv/'+value.replace(/^\.\//,''));
    return '';
  };
  const asset=(value,fallback)=>generic.test(value||'')?fallback:(canonicalURL(value)||fallback||'');
  const setText=(node,value)=>{if(node&&value!==undefined&&value!==null&&String(value).trim())node.textContent=String(value)};
  const readableDate=input=>{
    const d=new Date(input);
    if(!Number.isFinite(d.getTime()))return null;
    return {day:String(d.getUTCDate()).padStart(2,'0'),month:d.toLocaleString('en-US',{month:'long',timeZone:'UTC'}),year:String(d.getUTCFullYear())};
  };
  function setupEnvelope(data,media){
    const overlay=document.getElementById('weiOverlay');
    overlay.classList.add('dv-opening');
    overlay.innerHTML=[
      '<div class="dv-envelope-stage">',
      '<img class="env-flap env-flap-left" src="'+DEFAULTS.flaps[0]+'" alt="" aria-hidden="true">',
      '<img class="env-flap env-flap-right" src="'+DEFAULTS.flaps[1]+'" alt="" aria-hidden="true">',
      '<img class="env-flap env-flap-bottom" src="'+DEFAULTS.flaps[2]+'" alt="" aria-hidden="true">',
      '<img class="env-flap env-flap-top" src="'+DEFAULTS.flaps[3]+'" alt="" aria-hidden="true">',
      '<div class="dv-seal"><img id="weiImg" alt="Sello para abrir Dolce Vita">',
      '<div id="weiTapWrap"><span id="weiTapLabel">Click to open</span></div></div></div>'
    ].join('');
    media.sobre=asset(media.sobre,DEFAULTS.seal);
    media.video='';
    if(media.musica!=='__oculto__')media.musica=asset(media.musica,DEFAULTS.music);
    media.__dolceVita=true;
    if(data.textos?.tapAbrir)setText(document.getElementById('weiTapLabel'),data.textos.tapAbrir);
  }
  function setImage(root,selector,value){
    const el=root.querySelector(selector),src=canonicalURL(value);
    if(!el||!src)return;
    el.src=src;el.decoding='async';el.loading='lazy';
  }
  function applyData(root,data,media){
    const n1=data.nombre1||'Alexa',n2=data.nombre2||'Richard';
    const firstName=n1+' & '+n2;
    setText(root.querySelector('main section:first-child h1'),firstName);
    setText(root.querySelector('footer .font-display.text-\\[30px\\]'),firstName);
    setText(root.querySelector('#hero-sub'),data.subtitulo||'are getting married!');
    const date=readableDate(data.fecha||'2027-09-14T17:00:00-05:00');
    if(date){
      setText(root.querySelector('#tdr-tile-day span'),date.day);
      setText(root.querySelector('#tdr-tile-month span'),date.month);
      setText(root.querySelector('#tdr-tile-year span'),date.year);
    }
    const venue=root.querySelector('section.bg-ivory.pt-8.pb-6');
    if(venue){
      const lines=venue.querySelectorAll('.font-display.font-semibold');
      if(lines[0])setText(lines[0],data.lugar);
      if(lines[1])setText(lines[1],data.direccion);
      setImage(venue,'img[alt*="Wedding Venue"]',asset(media.lugar,DEFAULTS.venue));
    }
    const rows=[...root.querySelectorAll('#schedule-section .space-y-8 > div.grid')];
    if(Array.isArray(data.cronograma)&&data.cronograma.length){
      rows.forEach((row,i)=>{
        if(!data.cronograma[i]){row.hidden=true;return;}
        const pieces=row.querySelectorAll('.font-display.font-semibold');
        setText(pieces[0],data.cronograma[i].hora);
        setText(pieces[1],data.cronograma[i].nombre);
      });
    }
    if(data.vestimenta){
      const dress=root.querySelector('#dress-gallery')?.parentElement;
      const description=dress?.querySelector('.font-display.font-semibold.text-\\[19px\\]');
      setText(description,data.vestimenta);
    }
    if(data.rsvpLimite){
      const rsvp=root.querySelector('#rsvp-modal-title')?.parentElement?.querySelector('p');
      setText(rsvp,data.rsvpLimite);
    }
    if(data.despedida){
      const footer=root.querySelector('footer');
      const heading=footer?.querySelector('h2');setText(heading,data.despedida);
    }
    setImage(root,'footer img[alt="Alexa & Richard"]',asset(media.fotoCierre,DEFAULTS.photo));
    if(media.foto1)setImage(root,'.gallery-img:nth-child(1)',media.foto1);
    if(media.foto2)setImage(root,'.gallery-img:nth-child(2)',media.foto2);
    if(media.foto3)setImage(root,'.gallery-img:nth-child(3)',media.foto3);
    const video=root.querySelector('#hero-video');
    if(video){
      const src=asset(media.videoHero,DEFAULTS.hero);
      video.muted=true;video.playsInline=true;video.preload='metadata';
      if(src){video.src=src;video.load();}
      video.addEventListener('error',()=>{video.style.background='linear-gradient(135deg,#d6e7ef,#fffdfb)';},{once:true});
      document.getElementById('weiOverlay')?.addEventListener('click',()=>video.play().catch(()=>{}),{once:true});
    }
  }
  function revealLetter(root) {
    const envelope = root.querySelector('.dv-letter-envelope');
    if (!envelope || !('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches ||
        new URLSearchParams(location.search).get('editor') === '1') return;

    envelope.classList.add('dv-letter-ready');
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      envelope.classList.add('dv-letter-open');
      observer.disconnect();
    }, {rootMargin:'0px 0px -16% 0px', threshold:0.18});
    observer.observe(envelope);
  }
  function fontStyles(){
    if(document.getElementById('dv-fonts'))return;
    const link=document.createElement('link');
    link.id='dv-fonts';link.rel='stylesheet';
    link.href='https://fonts.googleapis.com/css2?family=Beau+Rivage&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Imperial+Script&family=Rufina:wght@400;700&display=swap';
    link.media='print';link.onload=()=>{link.media='all'};
    document.head.appendChild(link);
  }
  window.renderDolceVita=async function renderDolceVita(data,template,media,payload){
    const response=await fetch(window.nsSiteUrl('inv/dolce-vita-template.html')+'?v=carta2',{cache:'no-cache'});
    if(!response.ok)throw Error('No se pudo cargar el diseño Dolce Vita.');
    const documentHTML=new DOMParser().parseFromString(await response.text(),'text/html');
    const source=documentHTML.querySelector('.dv-root');
    if(!source||!source.querySelector('#tdr-cvs-day')||!source.querySelector('#rsvp-form')||!source.querySelector('#dress-gallery'))
      throw Error('La maqueta de Dolce Vita está incompleta.');
    const mount=document.getElementById('root');
    const invitation = document.importNode(source,true);
    for (const image of invitation.querySelectorAll('img[data-fallback]')) {
      image.addEventListener('error', () => { image.src = image.dataset.fallback; }, {once:true});
    }
    mount.replaceChildren(invitation);
    const root=mount.querySelector('.dv-root');
    document.body.classList.add('dv-mode');
    fontStyles();
    const colors=data.colores||{};
    if(colors.fondo)root.style.setProperty('--color-ivory',colors.fondo);
    if(colors.texto)root.style.setProperty('--color-charcoal',colors.texto);
    if(colors.acento)root.style.setProperty('--color-skymain',colors.acento);
    setupEnvelope(data,media);
    applyData(root,data,media);
    // El HTML original mostraba el subtítulo desde su propio controlador
    // de apertura. En el visor compartido lo revelamos tras el toque.
    const subtitle = root.querySelector('#hero-sub');
    document.getElementById('weiOverlay')?.addEventListener('click', () => {
      setTimeout(() => {
        subtitle?.classList.remove('opacity-0');
        subtitle?.classList.add('opacity-100');
      }, 900);
    }, {once:true});
    window.__DV_DEMO=payload.tipo!=='evento';
    window.__DV_RSVP_FORM=data.googleFormUrl||'';
    window.__DV_WHATSAPP=data.whatsapp||'';
    if(typeof window.startDolceVitaOriginal!=='function')throw Error('No se pudo iniciar el motor de Dolce Vita.');
    if('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches && new URLSearchParams(location.search).get('editor')!=='1')
      root.classList.add('dv-motion-ready');
    revealLetter(root);
    window.startDolceVitaOriginal();
    document.title='Dolce Vita · N&S ATELIER';
    return root;
  };
})();
