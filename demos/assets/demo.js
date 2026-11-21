/* N&S ATELIER — Interacciones de demostración. No envía ni guarda respuestas. */
(function(){
  'use strict';
  const event=window.INVITACION_DEMO||{};
  const opening=document.getElementById('opening');
  const startBtn=document.getElementById('openInvite');
  const reduced=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(opening&&!reduced) document.body.classList.add('no-scroll');
  function open(){if(!opening)return;opening.classList.add('closing');document.body.classList.remove('no-scroll');setTimeout(()=>{opening.hidden=true},reduced?0:850);}
  if(startBtn)startBtn.addEventListener('click',open);
  if(reduced)open();
  const target=new Date(event.fecha||'2027-06-01T17:00:00-05:00').getTime();
  const fields=['dias','horas','minutos','segundos'];
  function update(){
    const diff=Math.max(0,target-Date.now());
    const arr=[Math.floor(diff/86400000),Math.floor((diff%86400000)/3600000),Math.floor((diff%3600000)/60000),Math.floor((diff%60000)/1000)];
    fields.forEach((k,i)=>{const el=document.querySelector(`[data-counter="${k}"]`);if(el)el.textContent=String(arr[i]).padStart(2,'0');});
  }
  update();setInterval(update,1000);
  const form=document.getElementById('demoRsvp');
  const status=document.getElementById('status');
  form?.addEventListener('submit',(e)=>{
    e.preventDefault();
    const who=(form.elements['nombre']?.value||'invitado').trim();
    const will=form.elements['asistencia']?.value==='si';
    status.textContent=`${will?'¡Gracias por confirmar, ':'Gracias por responder, '}${who}! Esta es una simulación: NO se enviaron ni almacenaron tus datos.`;
    status.classList.add('visible');
    status.setAttribute('role','status');
    form.reset();
    status.scrollIntoView({behavior:reduced?'auto':'smooth',block:'nearest'});
  });
  const copy=document.getElementById('shareDemo');
  copy?.addEventListener('click', async ()=>{
    const url=location.href.split('#')[0];
    try {
      if(navigator.share) await navigator.share({title:`Demo ${event.diseno} - N&S ATELIER`,url});
      else if(navigator.clipboard&&location.protocol==='https:'){await navigator.clipboard.writeText(url);copy.textContent='Enlace copiado ✓';setTimeout(()=>copy.textContent='Compartir este demo',1800);}
      else prompt('Copia el enlace de la demostración:',url);
    }catch(err){if(err.name!=='AbortError')prompt('Copia el enlace:',url)}
  });
  if('IntersectionObserver' in window && !reduced){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in');observer.unobserve(entry.target)}}),{threshold:.08});
    document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
  }else document.querySelectorAll('.reveal').forEach(el=>el.classList.add('in'));
})();
