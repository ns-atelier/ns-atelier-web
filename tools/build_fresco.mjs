/* Compile Fresco's supplied HTML to GitHub Pages-safe, scoped assets. */
import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const tw=require('tailwindcss');
const postcss=require('postcss');
const dir='inv/';
const source=fs.readFileSync(dir+'fresco-source.html','utf8').replace(/\r\n/g,'\n');
const mainStart=source.indexOf('<div class="pointer-events-none fixed inset-y-0');
const scriptStart=source.lastIndexOf('<script>');
if(mainStart<0||scriptStart<mainStart)throw Error('Missing Fresco source bounds');
const body=source.slice(mainStart,scriptStart).trim();
for(const id of ['fresco-name-one','fresco-name-two','rsvp-form','lang-en-btn','bank-modal','hero-video','cd-days'])
  if(!body.includes('id="'+id+'"'))throw Error('Fresco missing element '+id);
const template='<div class="fresco-root" data-template="fresco">\n'+body+'\n</div>\n';
fs.writeFileSync(dir+'fresco-template.html',template);
const style=(source.match(/<style>([\s\S]*?)<\/style>/)||[])[1];
if(!style)throw Error('Missing Fresco source style');
const theme=fs.readFileSync(require.resolve('tailwindcss/theme.css'),'utf8');
const preflight=fs.readFileSync(require.resolve('tailwindcss/preflight.css'),'utf8');
const conf=`@theme {
--color-background:#faf8f4;
--color-foreground:#2c3327;
--color-primary:#566544;
--color-primary-foreground:#faf8f4;
--color-olive:#566544;
--color-secondary:#ebe6dc;
--color-border:#d6cfc2;
--color-gold:#a89367;
--font-display:'Cormorant Garamond',Georgia,serif;
--font-body:'Jost',sans-serif;
--font-script:'Alex Brush','Pinyon Script',cursive;
--font-hand:'Caveat',cursive;
--shadow-soft:0 4px 20px -2px rgba(44,51,39,.08);
}
@tailwind utilities;`;
const compiler=await tw.compile(theme+'\n'+conf+'\n'+preflight);
const htmlClasses=[...template.matchAll(/\bclass\s*=\s*"([^"]+)"/g)].flatMap(x=>x[1].trim().split(/\s+/));
const runtimeStrings=[...source.matchAll(/['"`]([^'"`\n]{2,180})['"`]/g)].flatMap(x=>x[1].trim().split(/\s+/));
const candidateClasses=[...new Set([...htmlClasses,...runtimeStrings])].filter(Boolean);
const generated=compiler.build(candidateClasses);
if(generated.length<16000||!generated.includes('.text-'))throw Error('Tailwind generated CSS is incomplete: '+generated.length);
const scopedSource=style.replace(/body\.scroll-locked/g,'.fresco-root.scroll-locked')
  .replace(/\bbody\b/g,'.fresco-root').replace(/\bhtml\b/g,'.fresco-root');
const root=postcss.parse(generated+'\n'+scopedSource);
root.walkAtRules('media',rule=>{
  if(rule.params.trim()==='(width >= 40rem)'){rule.name='container';rule.params='(min-width: 520px)';}
  if(rule.params.trim()==='(width >= 48rem)'){rule.name='container';rule.params='(min-width: 590px)';}
});
root.walkRules(rule=>{
  if(rule.parent?.type==='atrule'&&/keyframes/i.test(rule.parent.name))return;
  const selector=rule.selector.trim();
  if(/^\.fresco-root(?:\b|\.|\s|$)/.test(selector))return;
  if(selector===':root, :host'||selector===':host, :root'){rule.selector='.fresco-root';return;}
  const parts=selector.split(/,(?![^()]*\))/).map(x=>x.trim()).filter(Boolean);
  rule.selector=parts.map(p=>[':root',':host','html','body'].includes(p)?'.fresco-root':'.fresco-root '+p).join(', ');
});
const extra=`
/* Premium responsive Fresco, isolated inside the shared viewer. */
.fresco-root{--background:#faf8f4;--foreground:#2c3327;--olive:#566544;--secondary:#ebe6dc;--border:#d6cfc2;container-type:inline-size;max-width:620px;width:100%;min-height:100svh;margin:0 auto;background:#faf8f4;color:#2c3327;font-family:'Jost',sans-serif;position:relative;overflow-x:clip;-webkit-font-smoothing:antialiased;}
.fresco-root > .w-full.max-w-\\[440px\\]{max-width:none;width:100%;box-shadow:none;}
.fresco-root #hero-section:before{content:'';position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(180deg,rgba(250,248,244,.15),rgba(250,248,244,.45) 43%,rgba(250,248,244,.75));}
.fresco-root #hero-section > .relative.z-10{position:relative;z-index:3;}
.fresco-root #hero-section h1{overflow-wrap:anywhere;}
.fresco-root img,.fresco-root video{max-width:100%;}
.fresco-root .hero-stagger,.fresco-root .reveal,.fresco-root .reveal-fade{opacity:1;transform:none;}
.fresco-root.fresco-motion-ready #hero-section .hero-stagger{opacity:0;transform:translateY(16px);}
.fresco-root.fresco-motion-ready #hero-section.hero-ready .hero-stagger{opacity:1;transform:none;}
.fresco-root.fresco-motion-ready .reveal:not(.is-visible){opacity:0;transform:translateY(22px);}
.fresco-root.fresco-motion-ready .reveal-fade:not(.is-visible){opacity:0;}
.fresco-root .reveal.is-visible,.fresco-root .reveal-fade.is-visible{opacity:1;transform:none;}
.fresco-root #bank-modal{z-index:200050;}
.fresco-root .fresco-lang-dock{z-index:800;}
.fresco-root #audio-toggle-btn{z-index:810;}
.fresco-root #copy-bank-btn:disabled{opacity:.45;cursor:not-allowed;}
body.fresco-mode{background:radial-gradient(ellipse at 50% 18%,#eee9e2,#ded7cd 75%);}
body.ns-mobile-immersive .fresco-root{max-width:none;}
#weiOverlay.fresco-opening{padding:0;background:#e9e4da;overflow:hidden;}
#weiOverlay.fresco-opening #weiImg{display:block;width:min(100%,620px);height:100dvh;max-width:none;object-fit:cover;object-position:center;filter:none;}
#weiOverlay.fresco-opening #weiTapWrap{position:absolute;left:0;right:0;bottom:10%;transform:none;z-index:4;}
#weiOverlay.fresco-opening #weiTapLabel{font:500 12px/1.4 'Jost',sans-serif;letter-spacing:.25em;text-transform:uppercase;color:white;text-shadow:0 2px 10px rgba(0,0,0,.75);animation:none;}
#weiOverlay.fresco-opening .wei-chevron{display:none;}
.fresco-root .fresco-customer-photos{position:relative;z-index:5;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:22px auto 0;max-width:560px;padding:0 16px;}
.fresco-root .fresco-customer-photos img{display:block;width:100%;height:auto;aspect-ratio:3/4;object-fit:cover;border-radius:10px;box-shadow:0 8px 24px #1d241d1a;}
@media(max-width:420px){.fresco-root .fresco-customer-photos{gap:5px;padding:0 12px;}}
@media(max-width:620px){.fresco-root{max-width:100%;}}
@media(prefers-reduced-motion:reduce){.fresco-root .hero-stagger,.fresco-root .reveal,.fresco-root .reveal-fade,.fresco-root.fresco-motion-ready #hero-section .hero-stagger,.fresco-root.fresco-motion-ready .reveal:not(.is-visible){opacity:1!important;transform:none!important;transition:none!important;animation:none!important;}}
`;
fs.writeFileSync(dir+'fresco.css',root.toString()+'\n'+extra);
const scripts=[...source.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(x=>x[1]);
let logic=scripts.find(x=>x.includes('function initLanguageSwitcher'));
if(!logic)throw Error('Missing Fresco interactive JS');
const introStart=logic.indexOf('    // 3. ENVELOPE OPENING VIDEO OVERLAY');
const introEnd=logic.indexOf('    // 4. LIVE COUNTDOWN TIMER',introStart);
if(introStart<0||introEnd<introStart)throw Error('Cannot separate Fresco original intro');
logic=logic.slice(0,introStart)+`    // 3. Shared opening overlay is provided by /inv/index.html.
    document.getElementById('hero-scroll-btn')?.addEventListener('click',()=>
      document.getElementById('countdown')?.scrollIntoView({behavior:'smooth'}));

`+logic.slice(introEnd);
logic=logic.replace("        if (typeof window.__rerenderRsvpGuests === 'function') {",
"        if(typeof window.__applyFrescoData==='function')window.__applyFrescoData();\n        if (typeof window.__rerenderRsvpGuests === 'function') {");
logic=logic.replaceAll("document.querySelectorAll('.lang-btn')","document.querySelectorAll('.fresco-root .lang-btn')")
 .replaceAll("document.querySelectorAll('[data-i18n]')","document.querySelectorAll('.fresco-root [data-i18n]')")
 .replaceAll("document.querySelectorAll('[data-i18n-placeholder]')","document.querySelectorAll('.fresco-root [data-i18n-placeholder]')")
 .replaceAll("document.querySelectorAll('[data-attend-card]')","document.querySelectorAll('.fresco-root [data-attend-card]')")
 .replaceAll("document.querySelectorAll('.event-check-card')","document.querySelectorAll('.fresco-root .event-check-card')")
 .replaceAll("document.querySelectorAll('[data-child-card]')","document.querySelectorAll('.fresco-root [data-child-card]')")
 .replaceAll("document.querySelectorAll('input[name=\"events\"]:checked')","document.querySelectorAll('.fresco-root input[name=\"events\"]:checked')")
 .replaceAll("document.querySelector('input[name=\"attending\"]:checked')","document.querySelector('.fresco-root input[name=\"attending\"]:checked')")
 .replaceAll("document.querySelectorAll('.reveal, .reveal-fade')","document.querySelectorAll('.fresco-root .reveal, .fresco-root .reveal-fade')")
 .replace('new Date(2027, 6, 27, 17, 30, 0).getTime()','new Date(window.__FRESCO_DATE || "2027-07-27T17:30:00+02:00").getTime()');
const before="        form.classList.add('hidden');\n        confirmation.classList.remove('hidden');";
if(logic.split(before).length!==2)throw Error('RSVP submit block not found');
const safeRsvp=[
 "        const demo = window.__FRESCO_DEMO !== false;",
 "        const formUrl=window.__FRESCO_FORM||'';",
 "        const phone=String(window.__FRESCO_WHATSAPP||'').replace(/\\D/g,'');",
 "        if(!demo && /^https:\\/\\//i.test(formUrl)){window.open(formUrl,'_blank','noopener');return;}",
 "        if(!demo && phone.length>=10 && phone.length<=15){",
 "          window.open('https://wa.me/'+phone+'?text='+encodeURIComponent('RSVP · '+names.join(', ')+' · '+(attending?'Yes':'No')),'_blank','noopener');return;",
 "        }",
 "        confirmSummary.textContent = demo",
 "          ? (currentLang==='de' ? 'Dies ist eine Demo. Keine Antwort wurde versendet oder gespeichert.' : 'This is a demo. No RSVP has been submitted or saved.')",
 "          : (currentLang==='de' ? 'Die Bestätigung ist noch nicht eingerichtet.' : 'The RSVP destination has not been configured.');",
 "        form.classList.add('hidden');",
 "        confirmation.classList.remove('hidden');"
].join('\n');
logic=logic.replace(before,safeRsvp);
logic=logic.replace("copyBtn.addEventListener('click', () => {","copyBtn.addEventListener('click', () => {\n        if(copyBtn.disabled) return;");
logic=logic.replace("      const observer = new IntersectionObserver(\n        (entries)","      if (!('IntersectionObserver' in window)) { targets.forEach(el => el.classList.add('is-visible')); return; }\n      const observer = new IntersectionObserver(\n        (entries)");
fs.writeFileSync(dir+'fresco-original.js','/* Fresco original interactions scoped to the public viewer. */\nwindow.startFrescoOriginal=function(){\n'+logic+'\n};\n');
console.log(JSON.stringify({template:template.length,css:generated.length+extra.length,js:logic.length,classes:candidateClasses.length}));
// Optional client photographs, kept separate from the original painted assets.
// Custom additions live in the adapter and CSS and are not regenerated.
