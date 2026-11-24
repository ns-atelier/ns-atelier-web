/* N&S Atelier — contenido público y vista previa del panel. */
(() => {
  'use strict';
  const assets = new URL('./', document.currentScript.src);
  const page = /\/catalogo\.html$/i.test(location.pathname) ? 'catalogo' : 'inicio';
  const preview = window.parent !== window && new URLSearchParams(location.search).get('atelierweb') === '1';
  const original = new Map(), applied = new Map();
  let fields, published = {}, lastHighlight;
  function read(file) {
    return fetch(new URL(file,assets), {cache:'no-cache'}).then(res=>{
      if (!res.ok) throw Error('No se pudo cargar el contenido web.');
      return res.json();
    });
  }
  function resourceUrl(value) {
    if (!value || /[\s<>"'\\]/.test(value)) return '';
    const local = /^(?!\/\/)(?:\/?(?:assets|inv|images|demos)\/|(?:index|catalogo|condiciones)\.html(?:[?#]|$)|#)/i.test(value);
    if (!local && !/^https:\/\//i.test(value)) return '';
    try {
      const url = new URL(local && value.startsWith('/') ? value.slice(1) : value,new URL('../',assets));
      return url.protocol === 'https:' || local && url.origin === location.origin ? url.href : '';
    } catch (error) { return ''; }
  }
  function targets(field) {
    return document.querySelectorAll(field.selector);
  }
  function snapshot(field,el) {
    const {mode}=field;
    if (mode==='video') return el.getAttribute('src');
    if (['src','poster','href','alt','data-wa'].includes(mode)) return el.getAttribute(mode);
    if (mode==='lead' || mode==='after') {
      const text = [...el.childNodes].filter(node=>node.nodeType===3 && node.textContent.trim());
      const node = mode==='after' ? text.at(-1) : text[0];
      return node ? {node,text:node.textContent} : null;
    }
    return el.textContent;
  }
  function update(field,el,previous,value) {
    const mode=field.mode;
    const unset=value===undefined;
    if (mode==='lead' || mode==='after') {
      if (previous) previous.node.textContent = unset ? previous.text :
        previous.text.replace(previous.text.trim(),()=>value);
      return;
    }
    if (mode==='video') {
      if (unset && previous===null) el.removeAttribute('src');
      else el.setAttribute('src',unset ? previous : value);
      // Un src en <video> tiene prioridad sobre las fuentes originales.
      el.load();
      return;
    }
    if (mode==='typing') {
      el.textContent=unset ? previous : value;
      if (unset) delete el.dataset.webPhrase;
      else el.dataset.webPhrase=value;
      return;
    }
    if (mode==='data-wa') {
      el.dataset.wa=unset ? previous : value;
      const url=new URL(el.href,document.baseURI);
      if (url.hostname==='wa.me') {
        url.searchParams.set('text',el.dataset.wa);
        el.href=url.href;
      }
      return;
    }
    if (['src','poster','href','alt'].includes(mode)) {
      if (unset && previous===null) el.removeAttribute(mode);
      else el.setAttribute(mode,unset ? previous : value);
      return;
    }
    el.textContent=unset ? previous : value;
  }
  function apply(values) {
    for (const field of fields) {
      const raw = Object.hasOwn(values,field.id) && typeof values[field.id] === 'string' ? values[field.id].trim() : '';
      const value = raw ? (field.kind==='text' ? raw : resourceUrl(raw)) || undefined : undefined;
      if (applied.get(field.id) === value) continue;
      const elements = targets(field);
      if (!original.has(field.id)) original.set(field.id,[...elements].map(el=>snapshot(field,el)));
      elements.forEach((el,index)=>update(field,el,original.get(field.id)[index],value));
      if (value===undefined) applied.delete(field.id); else applied.set(field.id,value);
    }
    const video=document.getElementById('videoHistorias');
    if (video && !preview) document.dispatchEvent(new Event('ns-web-content-updated'));
  }
  const settings=read('web-content.json').catch(()=>({}));
  const initialized=settings.then(async values=>{
    published=values&&typeof values==='object'&&!Array.isArray(values) ? values : {};
    if (!preview && !Object.keys(published).length) return;
    fields=(await read('web-fields.json')).filter(field=>field.page===page);
    apply(published);
  }).catch(error=>{if(preview)throw error;});
  if (!preview) return;

  // La vista previa es temporal. Solo la página padre puede mandar cambios.
  // En Apps Script el iframe padre puede tener un origen opaco.
  let panelOrigin;
  window.addEventListener('message',async event=>{
    if (event.source!==window.parent || !['atelier-web-preview','atelier-web-focus'].includes(event.data?.type)) return;
    if (panelOrigin!==undefined && panelOrigin!==event.origin) return;
    panelOrigin=event.origin;
    try {
      await initialized;
      if (event.data.type==='atelier-web-preview' && event.data.values && typeof event.data.values==='object') {
        apply(event.data.values);
        parent.postMessage({type:'atelier-web-ready'},panelOrigin==='null' ? '*' : panelOrigin);
      }
      if (event.data.type==='atelier-web-focus') {
        const field=fields.find(item=>item.id===event.data.key);
        const node=field && targets(field)[0];
        if (!node) return;
        if (lastHighlight) lastHighlight.style.outline=lastHighlight.dataset.webOutline || '';
        node.dataset.webOutline=node.style.outline;
        node.style.outline='3px solid #b47b49';
        lastHighlight=node;
        node.closest('details')?.setAttribute('open','');
        node.scrollIntoView({block:'center',behavior:'instant'});
      }
    } catch (error) {
      parent.postMessage({type:'atelier-web-error'},panelOrigin==='null' ? '*' : panelOrigin);
    }
  });
  document.addEventListener('click', event=>{
    // Mantener la vista previa en la misma página y evitar abrir contactos reales.
    if (event.target.closest('a')) event.preventDefault();
  },true);
})();
