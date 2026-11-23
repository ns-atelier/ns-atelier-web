/* Dolce Vita: compile the supplied self-contained HTML into static scoped assets. */
import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const tw=require('tailwindcss'),postcss=require('postcss');
const dir='inv/';
const source=fs.readFileSync(dir+'dolce-vita-source.html','utf8').replace(/\r\n/g,'\n');
const mainStart=source.indexOf('<div class="w-full max-w-[440px] mx-auto bg-ivory');
const jsStart=source.lastIndexOf('<script>');
if(mainStart<0||jsStart<mainStart)throw Error('Source main or script not found');
const part=source.slice(mainStart,jsStart).trim();
if(!part.includes('id="tdr-cvs-day"')||!part.includes('id="lightbox-modal"')||!part.includes('id="rsvp-form"'))throw Error('Incomplete interactive HTML');
const hiddenLayers='<canvas id="tdr-confetti" class="fixed inset-0 pointer-events-none z-[9999]"></canvas>\n<div id="tdr-flash" class="fixed inset-0 pointer-events-none z-[9998] opacity-0"></div>';
const template='<div class="dv-root" data-template="dolce-vita">\n'+hiddenLayers+'\n'+part+'\n</div>\n';
fs.writeFileSync(dir+'dolce-vita-template.html',template);
const customStyle=(source.match(/<style>([\s\S]*?)<\/style>/)||[])[1];
if(!customStyle)throw Error('Source styles missing');
const theme=fs.readFileSync(require.resolve('tailwindcss/theme.css'),'utf8');
const preflight=fs.readFileSync(require.resolve('tailwindcss/preflight.css'),'utf8');
const config=`@theme {
 --color-ivory:#fffdfb;
 --color-skydeep:#52839c;
 --color-skymain:#64a0bd;
 --color-skymuted:#7a9aaa;
 --color-skylight:#9bc9e1;
 --color-charcoal:#3a3a3a;
 --color-charcoalsoft:#4a4a4a;
 --font-display:"Cormorant Garamond",Georgia,serif;
 --font-rufina:"Rufina",Georgia,serif;
 --font-script:"Imperial Script","Beau Rivage",cursive;
 --font-rivage:"Beau Rivage",cursive;
}
@tailwind utilities;`;
const compiler=await tw.compile(theme+'\n'+config+'\n'+preflight);
const cls=[...template.matchAll(/\bclass\s*=\s*"([^"]+)"/g)].flatMap(m=>m[1].trim().split(/\s+/));
const generated=compiler.build([...new Set(cls)]);
if(generated.length<10000||!generated.includes('.text-'))throw Error('Tailwind compilation did not create utilities');
const sourceStyle=customStyle
 .replace(/body\.scroll-locked/g,'.dv-root.scroll-locked')
 .replace(/\bbody\b/g,'.dv-root')
 .replace(/\bhtml\b/g,'.dv-root');
const root=postcss.parse(generated+'\n'+sourceStyle);
root.walkAtRules('media',rule=>{
 if(rule.params.trim()==='(width >= 40rem)') {rule.name='container';rule.params='(min-width: 600px)';}
});
root.walkRules(rule=>{
 if(rule.parent?.type==='atrule'&&/keyframes/i.test(rule.parent.name)) return;
 const selector=rule.selector.trim();
 if(/^\.dv-root(?:\b|\.|\s|$)/.test(selector))return;
 if(selector===':root, :host'||selector===':host, :root'){rule.selector='.dv-root';return;}
 const parts=selector.split(/,(?![^()]*\))/).map(x=>x.trim()).filter(Boolean);
 rule.selector=parts.map(p=>[':root',':host','html','body'].includes(p)?'.dv-root':'.dv-root '+p).join(', ');
});
const extras=`
/* Centered editorial layout, responsive to the invitation rather than the display. */
.dv-root{--ivory:#fffdfb;--sky-main:#64a0bd;--sky-deep:#52839c;--sky-muted:#7a9aaa;--sky-light:#9bc9e1;--charcoal:#3a3a3a;--charcoal-soft:#4a4a4a;width:100%;max-width:560px;min-height:100svh;margin:0 auto;background:#fffdfb;color:#3a3a3a;font-family:'Cormorant Garamond',Georgia,serif;overflow-x:clip;position:relative;}
.dv-root >div.w-full.max-w-\\[440px\\]{width:100%;max-width:none;margin:auto;}
.dv-root img,.dv-root video{max-width:100%;}
.dv-root .reveal,.dv-root .fade-only{opacity:1;transform:none;}
.dv-root.dv-motion-ready .reveal:not(.is-visible){opacity:0;transform:translateY(22px);}
.dv-root.dv-motion-ready .fade-only:not(.is-visible){opacity:0;}
.dv-root .reveal.is-visible,.dv-root .fade-only.is-visible{opacity:1;transform:none;}
.dv-root #hero-video{width:100%;height:100%;object-fit:cover;}
.dv-root #rsvp-modal,.dv-root #lightbox-modal{z-index:200050;position:fixed;}
.dv-root #tdr-confetti,.dv-root #tdr-flash{position:fixed;pointer-events:none;}
body.dv-mode{background:radial-gradient(circle at 50% 10%,#faf7f1,#e7e9eb 75%);}
body.ns-mobile-immersive .dv-root{max-width:none;}
#weiOverlay.dv-opening{padding:0;background:#fffdfb;overflow:hidden;}
#weiOverlay.dv-opening .dv-envelope-stage{position:relative;width:min(100%,440px);height:100svh;max-height:850px;background:#fffdfb;overflow:hidden;display:flex;align-items:center;justify-content:center;}
#weiOverlay.dv-opening .env-flap{position:absolute;pointer-events:none;will-change:transform,opacity;max-width:none;}
#weiOverlay.dv-opening .env-flap-left{top:-10px;left:0;height:104%;width:auto;z-index:2;transition:transform 1.6s cubic-bezier(.32,0,.2,1) .65s,opacity .55s ease 1.75s;}
#weiOverlay.dv-opening .env-flap-right{top:-10px;right:0;height:104%;width:auto;z-index:2;transition:transform 1.6s cubic-bezier(.32,0,.2,1) .65s,opacity .55s ease 1.75s;}
#weiOverlay.dv-opening .env-flap-bottom{bottom:-8px;left:50%;transform:translateX(-50%);width:112%;z-index:3;transition:transform 1.35s cubic-bezier(.32,0,.2,1) .55s,opacity .5s ease 1.5s;}
#weiOverlay.dv-opening .env-flap-top{top:-8px;left:50%;transform:translateX(-50%);width:112%;z-index:4;transition:transform 1.35s cubic-bezier(.32,0,.2,1) .55s,opacity .5s ease 1.5s;}
#weiOverlay.dv-opening.opened .env-flap-left{transform:translateX(-115%);opacity:0;}
#weiOverlay.dv-opening.opened .env-flap-right{transform:translateX(115%);opacity:0;}
#weiOverlay.dv-opening.opened .env-flap-bottom{transform:translate(-50%,115%);opacity:0;}
#weiOverlay.dv-opening.opened .env-flap-top{transform:translate(-50%,-115%);opacity:0;}
#weiOverlay.dv-opening .dv-seal{position:relative;z-index:10;display:flex;align-items:center;justify-content:center;flex-direction:column;transition:transform 1.1s cubic-bezier(.22,1,.36,1),opacity .9s ease;}
#weiOverlay.dv-opening.opened .dv-seal{transform:scale(1.22);opacity:0;}
#weiOverlay.dv-opening #weiImg{display:block;width:min(220px,57vw);height:auto;max-width:none;object-fit:contain;filter:drop-shadow(0 10px 18px rgba(0,0,0,.12));}
#weiOverlay.dv-opening #weiTapLabel{font:600 20px/1.25 'Cormorant Garamond',Georgia,serif;color:#52839c;letter-spacing:.025em;background:none;animation:none;}
#weiOverlay.dv-opening #weiTapWrap{position:static;transform:none;}
#weiOverlay.dv-opening .wei-chevron{display:none;}
@media(max-width:560px){.dv-root{max-width:100%;}.dv-root #hero-video{object-position:center;}.dv-root #letter-section{overflow:hidden;}}
@media(prefers-reduced-motion:reduce){.dv-root .reveal,.dv-root .fade-only,.dv-root.dv-motion-ready .reveal,.dv-root.dv-motion-ready .fade-only{opacity:1!important;transform:none!important;transition:none!important;}#weiOverlay.dv-opening .env-flap{transition-duration:.01ms!important;}}
`;
fs.writeFileSync(dir+'dolce-vita.css',root.toString()+'\n'+extras);
const scripts=[...source.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(x=>x[1]);
let logic=scripts.find(x=>x.includes('function initDateScratch'));
if(!logic) throw Error('Missing source interactions');
const start=logic.indexOf('    // 2. THE DATE — INTERACTIVE SCRATCH-OFF');
if(start<0)throw Error('Missing source scratch section');
const firstDivider=logic.lastIndexOf('    // =========================================================================',start);
logic=logic.slice(firstDivider);
logic=logic.replace("document.querySelectorAll('.gallery-img')","document.querySelectorAll('.dv-root .gallery-img')");
logic=logic.replace("document.querySelectorAll('.reveal, .fade-only')","document.querySelectorAll('.dv-root .reveal, .dv-root .fade-only')");
logic=logic.replace("      const observer = new IntersectionObserver(","      if (!('IntersectionObserver' in window)) { elements.forEach(el => el.classList.add('is-visible')); return; }\n      const observer = new IntersectionObserver(");
const before="        form.classList.add('hidden');\n        successBox.classList.remove('hidden');";
if(!logic.includes(before))throw Error('Cannot find RSVP success transition');
const after=[
"        const isDemo = window.__DV_DEMO !== false;",
"        const formUrl=window.__DV_RSVP_FORM || '';",
"        const whatsapp=String(window.__DV_WHATSAPP||'').replace(/\\D/g,'');",
"        if (!isDemo && /^https:\\/\\//i.test(formUrl)) { window.open(formUrl,'_blank','noopener'); return; }",
"        if (!isDemo && whatsapp.length>=10 && whatsapp.length<=15) {",
"          const msg = 'RSVP: '+guestName+' · '+choice;",
"          window.open('https://wa.me/'+whatsapp+'?text='+encodeURIComponent(msg),'_blank','noopener'); return;",
"        }",
"        successMsg.textContent = isDemo",
"          ? 'Esta es una demostración. No se ha enviado ni registrado ninguna respuesta.'",
"          : 'La confirmación todavía no está configurada para este evento.';",
"        form.classList.add('hidden');",
"        successBox.classList.remove('hidden');"
].join('\n');
logic=logic.replace(before,after);
const runtime='/* Código interactivo original de Dolce Vita, adaptado al visor compartido. */\nwindow.startDolceVitaOriginal=function(){\n'+logic+'\n};\n';
fs.writeFileSync(dir+'dolce-vita-original.js',runtime);
console.log(JSON.stringify({template:template.length,css:(root.toString()+extras).length,js:runtime.length,classes:[...new Set(cls)].length}));
