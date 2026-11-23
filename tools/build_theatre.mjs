/* Regenerate scoped Theatre assets from the user-supplied HTML. */
import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const tw=require('tailwindcss');
const postcss=require('postcss');
const dir='inv/';
const source=fs.readFileSync(dir+'theatre-source.html','utf8').replace(/\r\n/g,'\n');
const start=source.indexOf('<canvas id="confetti-canvas"');
const end=source.lastIndexOf('<script>');
if(start<0||end<start)throw Error('Theatre source bounds not found');
let body=source.slice(start,end).trim();
// Shared viewer owns the music playback; avoid competing audio controllers.
body=body.replace(/<!-- Original Background Wedding Music -->\s*<audio id="bg-music"[\s\S]*?<\/audio>/,'');
for(const id of ['hero-curtain','curtain-video','rsvp-form','copy-iban-btn','cd-days','rsvp-confirmation','reveal-section']){
 if(!body.includes(`id="${id}"`))throw Error('Missing Theatre element: '+id);
}
const html=`<div class="theatre-root" data-template="theatre">\n${body}\n</div>\n`;
fs.writeFileSync(dir+'theatre-template.html',html);
const custom=(source.match(/<style>([\s\S]*?)<\/style>/)||[])[1];
if(!custom)throw Error('Missing Theatre custom style');
const theme=fs.readFileSync(require.resolve('tailwindcss/theme.css'),'utf8');
const preflight=fs.readFileSync(require.resolve('tailwindcss/preflight.css'),'utf8');
const config=`@theme {
 --color-burgundy:#5C2018;
 --color-paper:#FAF8F5;
 --color-backdrop:#F2EDE8;
 --font-display:'Cormorant Garamond',Georgia,serif;
 --font-script:'Great Vibes',cursive;
 --font-body:'Jost',sans-serif;
 --color-red-700:#b91c1c;
}\n@tailwind utilities;`;
const compiler=await tw.compile(theme+'\n'+config+'\n'+preflight);
const classes=[...html.matchAll(/\bclass\s*=\s*"([^"]+)"/g)].flatMap(x=>x[1].trim().split(/\s+/));
const runtime=[...source.matchAll(/['"`]([^'"`\n]{2,160})['"`]/g)].flatMap(x=>x[1].trim().split(/\s+/));
const generated=compiler.build([...new Set([...classes,...runtime])]);
if(generated.length<12000||!generated.includes('burgundy'))throw Error('Incomplete styles: '+generated.length);
const scopedCustom=custom.replace(/body\.scroll-locked/g,'.theatre-root.scroll-locked')
 .replace(/\bbody\b/g,'.theatre-root').replace(/\bhtml\b/g,'.theatre-root');
const parsed=postcss.parse(generated+'\n'+scopedCustom);
parsed.walkAtRules('media',r=>{
 if(r.params.trim()==='(width >= 40rem)'){r.name='container';r.params='(min-width: 520px)';}
 if(r.params.trim()==='(width >= 48rem)'){r.name='container';r.params='(min-width: 590px)';}
});
parsed.walkRules(rule=>{
 if(rule.parent?.type==='atrule'&&/keyframes/i.test(rule.parent.name))return;
 const sel=rule.selector.trim();
 if(/^\.theatre-root(?:\b|\.|\s|$)/.test(sel))return;
 const parts=sel.split(/,(?![^()]*\))/).map(x=>x.trim()).filter(Boolean);
 rule.selector=parts.map(p=>[':root',':host','html','body'].includes(p)?'.theatre-root':'.theatre-root '+p).join(', ');
});
const extra=`
/* Theatre: isolated, responsive, with robust safe reveal. */
.theatre-root{--burgundy:#5C2018;--paper:#FAF8F5;--backdrop:#F2EDE8;--color-burgundy:#5C2018;--color-paper:#FAF8F5;--font-display:'Cormorant Garamond',Georgia,serif;--font-script:'Great Vibes',cursive;--font-body:'Jost',sans-serif;container-type:inline-size;max-width:620px;width:100%;min-height:100svh;margin:0 auto;background:#faf8f5;color:#5c2018;font-family:'Jost',sans-serif;position:relative;overflow-x:clip;}
.theatre-root>div.w-full.max-w-\\[440px\\]{width:100%;max-width:none;box-shadow:none;}
.theatre-root #hero-curtain{height:100svh;min-height:min(680px,100svh);max-height:none;background:radial-gradient(ellipse,#faf0df,#7c3034 75%);}
.theatre-root #hero-curtain video{max-width:100%;}
.theatre-root #hero-curtain .hero-reveal{opacity:1;transform:none;}
.theatre-root.theatre-motion-ready #hero-curtain .hero-reveal{opacity:0;transform:translateY(14px);}
.theatre-root.theatre-motion-ready #hero-curtain.curtain-opened .hero-reveal{opacity:1;transform:none;}
.theatre-root .reveal,.theatre-root .reveal-scale{opacity:1;transform:none;}
.theatre-root.theatre-motion-ready .reveal:not(.is-visible){opacity:0;transform:translateY(20px);}
.theatre-root.theatre-motion-ready .reveal-scale:not(.is-visible){opacity:0;transform:scale(.91);}
.theatre-root .reveal.is-visible,.theatre-root .reveal-scale.is-visible{opacity:1;transform:none;}
.theatre-root #curtain-prompt,.theatre-root #curtain-skip-btn,.theatre-root #audio-toggle-btn{display:none!important;}
.theatre-root #confetti-canvas{pointer-events:none;}
.theatre-root .theatre-extra-gallery{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;max-width:550px;margin:18px auto 0;padding:0 16px;}
.theatre-root .theatre-extra-gallery img{width:100%;height:auto;aspect-ratio:3/4;object-fit:cover;border-radius:10px;}
.theatre-root #copy-iban-btn:disabled{opacity:.4;cursor:not-allowed;}
.theatre-root #hero-curtain h1{overflow-wrap:anywhere;max-width:100%;}
body.theatre-mode{background:radial-gradient(ellipse at 50% 20%,#f5eee7,#e8dcd8 77%);}
body.ns-mobile-immersive .theatre-root{max-width:none;}
#weiOverlay.theatre-opening{padding:0;background:#4f1c27;overflow:hidden;}
#weiOverlay.theatre-opening #weiImg{display:block;max-width:none;width:min(100%,620px);height:100dvh;object-fit:cover;object-position:center;filter:none;}
#weiOverlay.theatre-opening #weiTapWrap{position:absolute;inset:auto 0 10%;z-index:4;transform:none;}
#weiOverlay.theatre-opening #weiTapLabel{font:600 11px/1.4 'Jost',sans-serif;letter-spacing:.24em;text-transform:uppercase;color:#fff0e0;text-shadow:0 2px 12px #150809;animation:none;}
#weiOverlay.theatre-opening .wei-chevron{display:none;}
@media(max-width:620px){.theatre-root{max-width:100%;}}
@media(prefers-reduced-motion:reduce){.theatre-root .hero-reveal,.theatre-root .reveal,.theatre-root .reveal-scale,.theatre-root.theatre-motion-ready #hero-curtain .hero-reveal,.theatre-root.theatre-motion-ready .reveal:not(.is-visible),.theatre-root.theatre-motion-ready .reveal-scale:not(.is-visible){opacity:1!important;transform:none!important;animation:none!important;transition:none!important;}}
`;
fs.writeFileSync(dir+'theatre.css',parsed.toString()+'\n'+extra);
const scripts=[...source.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(x=>x[1]);
let logic=scripts.find(x=>x.includes('function initLanguageSwitcher'));
if(!logic)throw Error('Missing Theatre interactions');
const introStart=logic.indexOf('    // 2. CURTAIN OPENING VIDEO & BACKGROUND MUSIC');
const introEnd=logic.indexOf('    // 3. INTERACTIVE 3-CIRCLE SCRATCH-OFF',introStart);
if(introStart<0||introEnd<introStart)throw Error('Cannot split Theatre original intro');
logic=logic.slice(0,introStart)+`    // 2. The central viewer provides the curtain opening and music controls.\n    document.getElementById('hero-scroll-btn')?.addEventListener('click',()=>document.getElementById('reveal-section')?.scrollIntoView({behavior:'smooth'}));\n\n`+logic.slice(introEnd);
logic=logic.replaceAll("document.querySelectorAll('.lang-btn')","document.querySelectorAll('.theatre-root .lang-btn')")
 .replaceAll("document.querySelectorAll('[data-i18n]')","document.querySelectorAll('.theatre-root [data-i18n]')")
 .replaceAll("document.querySelectorAll('[data-i18n-placeholder]')","document.querySelectorAll('.theatre-root [data-i18n-placeholder]')")
 .replaceAll("document.querySelectorAll('.scratch-canvas')","document.querySelectorAll('.theatre-root .scratch-canvas')")
 .replaceAll("document.querySelectorAll('.attend-btn')","document.querySelectorAll('.theatre-root .attend-btn')")
 .replaceAll("document.querySelectorAll('.reveal, .reveal-scale')","document.querySelectorAll('.theatre-root .reveal, .theatre-root .reveal-scale')")
 .replace('new Date(2027, 8, 10, 16, 0, 0).getTime()','new Date(window.__THEATRE_DATE||"2027-09-10T16:00:00+02:00").getTime()');
// Dynamic editorial fields are re-applied after language changes.
const languageMarker='        document.querySelectorAll(\'.theatre-root [data-i18n-placeholder]\').forEach((el) => {';
if(!logic.includes(languageMarker))throw Error('No placeholder translations');
logic=logic.replace('      langBtns.forEach((btn) => {\n        btn.addEventListener', '      langBtns.forEach((btn) => {\n        btn.addEventListener');
const afterPlaceholder='      }\n\n      langBtns.forEach((btn) => {';
if(!logic.includes(afterPlaceholder))throw Error('Language callback end not found');
logic=logic.replace(afterPlaceholder, '        window.__THEATRE_REAPPLY?.();\n      }\n\n      langBtns.forEach((btn) => {');
// No fake bank details or copies.
logic=logic.replace("      copyBtn.addEventListener('click', () => {","      copyBtn.addEventListener('click', () => {\n        if(copyBtn.disabled)return;");
// Restore truthful RSVP for demos and redirect to configured real destination.
const submitStart=logic.indexOf("        if (attendance === 'yes') {",logic.indexOf("form.addEventListener('submit'"));
const submitEnd=logic.indexOf("        form.classList.add('hidden');",submitStart);
if(submitStart<0||submitEnd<submitStart)throw Error('RSVP block not found');
logic=logic.slice(0,submitStart)+`        const isDemo = window.__THEATRE_DEMO !== false;\n        const formURL = window.__THEATRE_FORM || '';\n        const phone = String(window.__THEATRE_WHATSAPP||'').replace(/\\D/g,'');\n        if(!isDemo && /^https:\\/\\//i.test(formURL)){window.open(formURL,'_blank','noopener');return;}\n        if(!isDemo && phone.length>=10 && phone.length<=15){\n          window.open('https://wa.me/'+phone+'?text='+encodeURIComponent('RSVP · '+guestName+' · '+(attendance==='yes'?'Yes':'No')),'_blank','noopener');return;\n        }\n        summaryEl.textContent = isDemo\n          ? (currentLang==='it' ? 'Questa è una demo. Nessuna risposta è stata inviata o salvata.' : 'This is a demo. No response has been sent or saved.')\n          : (currentLang==='it' ? 'La destinazione RSVP non è ancora configurata.' : 'The RSVP destination is not configured.');\n\n`+logic.slice(submitEnd);
// Motion must not hide content on unsupported browsers.
const obsMarker="      const observer = new IntersectionObserver(\n";
if(!logic.includes(obsMarker))throw Error('Scroll observer not found');
logic=logic.replace(obsMarker,"      if(!('IntersectionObserver' in window)){elements.forEach(el=>el.classList.add('is-visible'));return;}\n      const observer = new IntersectionObserver(\n");
// Restore text from editable panel on initial load and after language switch.
fs.writeFileSync(dir+'theatre-original.js','/* Theatre original interactive code adapted to the N&S shared viewer. */\nwindow.startTheatreOriginal=function(){\n'+logic+'\n};\n');
console.log(JSON.stringify({template:html.length,css:generated.length+extra.length,js:logic.length,classes:new Set([...classes,...runtime]).size}));
