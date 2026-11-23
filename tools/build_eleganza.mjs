import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const tw=require('tailwindcss'),postcss=require('postcss');
const dir='inv/';
const source=fs.readFileSync(dir+'eleganza-source.html','utf8');
const begin=source.indexOf('<div class="w-full max-w-[540px] mx-auto');
const end=source.lastIndexOf('<script>');
if(begin<0||end<begin)throw Error('Eleganza main fragment not found');
const body=source.slice(begin,end).trim();
if(!body.includes('id="rsvp-form"')||!body.includes('id="copy-iban-btn"')||!body.includes('id="audio-toggle-btn"'))throw Error('Eleganza interactive sections missing');
const template='<div class="eleganza-root" data-template="eleganza">\n'+body+'\n</div>\n';
fs.writeFileSync(dir+'eleganza-template.html',template);
const originalStyle=(source.match(/<style>([\s\S]*?)<\/style>/)||[])[1];
if(!originalStyle)throw Error('Styles missing');
const theme=fs.readFileSync(require.resolve('tailwindcss/theme.css'),'utf8');
const preflight=fs.readFileSync(require.resolve('tailwindcss/preflight.css'),'utf8');
const custom=[
'@theme {',
'--color-background:#faf7f2;',
'--color-foreground:#3a3430;',
'--color-primary:#4a3f3a;',
'--font-display:"Cormorant Garamond",Georgia,serif;',
'--font-body:"Jost",sans-serif;',
'}',
'@tailwind utilities;'].join('\n');
const compiler=await tw.compile(theme+'\n'+custom+'\n'+preflight);
const classes=[...template.matchAll(/\bclass\s*=\s*"([^"]+)"/g)].flatMap(x=>x[1].trim().split(/\s+/));
const generated=compiler.build([...new Set(classes)]);
if(!generated.includes('.min-h-')||!generated.includes('.text-'))throw Error('CSS compilation empty');
const sourceStyle=originalStyle.replace(/body\.scroll-locked/g,'.eleganza-root.scroll-locked').replace(/\bbody\b/g,'.eleganza-root').replace(/\bhtml\b/g,'.eleganza-root');
const root=postcss.parse(generated+'\n'+sourceStyle);
root.walkAtRules('media',rule=>{
if(rule.params.trim()==='(width >= 40rem)'){rule.name='container';rule.params='(min-width: 580px)';}
});
root.walkRules(rule=>{
if(rule.parent?.type==='atrule'&&/keyframes/i.test(rule.parent.name))return;
const selector=rule.selector.trim();
if(/^\.eleganza-root(?:\b|\.|\s|$)/.test(selector))return;
if(selector===':root, :host'||selector===':host, :root'){rule.selector='.eleganza-root';return;}
const parts=selector.split(/,(?![^()]*\))/).map(x=>x.trim()).filter(Boolean);
rule.selector=parts.map(part=>([':root',':host','html','body'].includes(part))?'.eleganza-root':'.eleganza-root '+part).join(', ');
});
const extra=[
'/* Eleganza · Editorial Lake Como responsive */',
'.eleganza-root{--background:#faf7f2;--foreground:#3a3430;--primary:#4a3f3a;--color-background:#faf7f2;--color-foreground:#3a3430;--color-primary:#4a3f3a;position:relative;container-type:inline-size;width:100%;max-width:740px;min-height:100vh;margin:0 auto;background:#faf7f2;color:#3a3430;font-family:"Jost",sans-serif;overflow-x:clip;}',
'.eleganza-root>div:first-child{width:100%;max-width:none;margin:auto;box-shadow:none;}',
'.eleganza-root .hero-stagger,.eleganza-root .reveal{opacity:1;transform:none;}',
'.eleganza-root .reveal.is-visible{opacity:1;transform:none;}',
'.eleganza-root .cq-inline{container-type:inline-size;}',
'.eleganza-root img,.eleganza-root video{max-width:100%;}',
'.eleganza-root #audio-toggle-btn{z-index:810;}',
'.eleganza-root #audio-toggle-btn.is-idle{opacity:0;pointer-events:none;}',
'.eleganza-root #copy-iban-btn:disabled{opacity:.45;cursor:not-allowed;}',
'body.eleganza-mode{background:radial-gradient(ellipse at 48% 15%,#f3eee7,#ded4ca 75%);}',
'body.ns-mobile-immersive .eleganza-root{max-width:none;}',
'#weiOverlay.eleganza-opening{background:#f2ede6;overflow:hidden;padding:0;}',
'#weiOverlay.eleganza-opening #weiImg{display:block;width:min(100%,740px);height:100dvh;max-width:none;object-fit:cover;object-position:center;filter:none;}',
'#weiOverlay.eleganza-opening #weiTapWrap{position:absolute;bottom:11%;left:0;right:0;transform:none;z-index:3;}',
'#weiOverlay.eleganza-opening #weiTapLabel{font:500 12px/1.4 "Jost",sans-serif;letter-spacing:.28em;text-transform:uppercase;color:white;text-shadow:0 1px 8px #000;animation:none;}',
'#weiOverlay.eleganza-opening .wei-chevron{display:none;}',
'@media(max-width:620px){.eleganza-root{max-width:100%;}}',
'@media(prefers-reduced-motion:reduce){.eleganza-root .hero-stagger,.eleganza-root .reveal{opacity:1!important;transform:none!important;transition:none!important;}}',
"/* Aparición suave al deslizar: animación aplicada sólo con observador operativo. */",
".eleganza-root.ele-motion-ready img.ele-image-reveal{opacity:0;transform:translate3d(0,20px,0) scale(.982);transition:opacity 1100ms cubic-bezier(.22,1,.36,1),transform 1350ms cubic-bezier(.22,1,.36,1);transition-delay:var(--ele-image-delay,0ms);will-change:opacity,transform;}",
".eleganza-root.ele-motion-ready img.ele-image-reveal.ele-image-visible{opacity:1;transform:translate3d(0,0,0) scale(1);}",
"@media(max-width:620px){.eleganza-root.ele-motion-ready img.ele-image-reveal{transform:translate3d(0,13px,0) scale(.99);transition-duration:950ms,1100ms;}.eleganza-root.ele-motion-ready img.ele-image-reveal.ele-image-visible{transform:translate3d(0,0,0) scale(1);}}",
"@media(prefers-reduced-motion:reduce){.eleganza-root.ele-motion-ready img.ele-image-reveal{opacity:1!important;transform:none!important;transition:none!important;will-change:auto!important;}}"
].join('\n');
fs.writeFileSync(dir+'eleganza.css',root.toString()+'\n'+extra);
const scripts=[...source.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(x=>x[1]);
let logic=scripts.find(x=>x.includes('function initAmbientPad'));
if(!logic)throw Error('Interactive code missing');
const a=logic.indexOf('    // 2. INTRO VIDEO OVERLAY & STAGGERED HERO REVEAL');
const b=logic.indexOf('    // 3. LIVE COUNTDOWN TIMER',a);
if(a<0||b<a)throw Error('Intro boundaries missing');
logic=logic.slice(0,a)+logic.slice(b);
logic=logic.replace('new Date(2027, 8, 12, 17, 0, 0).getTime()','new Date(window.__ELE_DATE||"2027-09-12T17:00:00+02:00").getTime()');
logic=logic.replace("document.querySelectorAll('.reveal')","document.querySelectorAll('.eleganza-root .reveal')");
const before="        form.classList.add('hidden');\n        confirmation.classList.remove('hidden');";
if(!logic.includes(before))throw Error('RSVP block missing');
const after=[
"        const preview = window.__ELE_DEMO !== false;",
"        const formUrl = window.__ELE_RSVP_FORM || '';",
"        const phone = String(window.__ELE_WHATSAPP || '').replace(/\\D/g,'');",
"        if (!preview && /^https:\\/\\//i.test(formUrl)) { window.open(formUrl,'_blank','noopener'); return; }",
"        if (!preview && phone.length >= 10) {",
"          const msg = 'RSVP · '+guestName+' · '+(attendance==='yes'?'Asistiré':'No podré asistir');",
"          window.open('https://wa.me/'+phone+'?text='+encodeURIComponent(msg),'_blank','noopener');",
"          return;",
"        }",
"        form.classList.add('hidden');",
"        confirmation.classList.remove('hidden');",
"        const note=confirmation.querySelector('p.font-body');",
"        if(note)note.textContent= preview",
"          ? 'Esta es una demostración. No se ha enviado ninguna confirmación.'",
"          : 'La confirmación todavía no está configurada para esta invitación.';"
].join('\n');
logic=logic.replace(before,after);
logic=logic.replace("const value = ibanText.textContent.trim();","if (btn.disabled) return;\n        const value = ibanText.textContent.trim();");
fs.writeFileSync(dir+'eleganza-original.js','/* Eleganza original interactive code adapted to the public viewer. */\nwindow.startEleganzaOriginal=function(){\n'+logic+'\n};\n');
console.log(JSON.stringify({template:template.length,css:(root.toString()+extra).length,js:logic.length,classes:new Set(classes).size}));
