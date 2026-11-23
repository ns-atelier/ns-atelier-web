/* Generate static CSS + interactive assets from user supplied Nácar HTML.
  npm install --no-save tailwindcss@4.1.10 postcss@8
  node tools/build_nacar.mjs
*/
import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const tw=require('tailwindcss'),postcss=require('postcss');
const dir='inv/';
const source=fs.readFileSync(dir+'nacar-source.html','utf8');
const mainStart=source.indexOf('<main '),codeStart=source.indexOf('<script>',mainStart);
if(mainStart<0||codeStart<0)throw Error('Main / code missing');
const body=source.slice(mainStart,codeStart).trim();
if(!body.includes('id="scratch-canvas"')||!body.includes('id="rsvp-form"')||!body.includes('id="audio-toggle-btn"'))throw Error('Some sections are missing');
const template='<div class="nacar-root" data-template="olivo-marfil">\n'+body+'\n</div>\n';
fs.writeFileSync(dir+'nacar-template.html',template);
const originalStyle=(source.match(/<style>([\s\S]*?)<\/style>/)||[])[1];
if(!originalStyle)throw Error('CSS missing');
const theme=fs.readFileSync(require.resolve('tailwindcss/theme.css'),'utf8');
const custom='@theme {\n--color-background:#f8f6f2;\n--color-foreground:#3c4b5d;\n--font-display:"Cormorant Garamond",Georgia,serif;\n--font-ballet:"Ballet",cursive;\n--font-doulaise:"Monsieur La Doulaise",cursive;\n--font-body:"Jost",sans-serif;\n--font-helvetica:"Helvetica Neue",Helvetica,Arial,sans-serif;\n}\n@tailwind utilities;';
const preflight=fs.readFileSync(require.resolve('tailwindcss/preflight.css'),'utf8');
const compiler=await tw.compile(theme+'\n'+custom+'\n'+preflight);
const classes=[...source.matchAll(/\bclass\s*=\s*"([^"]+)"/g)].flatMap(x=>x[1].trim().split(/\s+/));
const generated=compiler.build([...new Set(classes)]);
if(!generated.includes('.min-h-')||!generated.includes('.text-'))throw Error('CSS compilation empty');
const sourceStyle=originalStyle.replace(/body\.scroll-locked/g,'.nacar-root.scroll-locked').replace(/\bbody\b/g,'.nacar-root').replace(/\bhtml\b/g,'.nacar-root');
const root=postcss.parse(generated+'\n'+sourceStyle);
root.walkRules(rule=>{
  if(rule.parent?.type==='atrule'&&/keyframes/i.test(rule.parent.name))return;
  const sel=rule.selector.trim();
  if(/^\.nacar-root(?:\b|\.|\s|$)/.test(sel)){rule.selector=sel;return;}
  const bits=sel.split(/,(?![^()]*\))/).map(x=>x.trim()).filter(Boolean);
  rule.selector=bits.map(part=>(part===':root'||part===':host'||part==='html'||part==='body')?
    '.nacar-root':'.nacar-root :where('+part+')').join(', ');
});
const extras=[
'/* Component scope and shared N&S Atelier viewer integration */',
'.nacar-root{--color-background:#f8f6f2;--color-foreground:#3c4b5d;position:relative;width:100%;min-height:100vh;max-width:560px;margin:0 auto;background:#f8f6f2;color:#3c4b5d;font-family:"Jost",sans-serif;overflow-x:clip;-webkit-font-smoothing:antialiased;}',
'.nacar-root .reveal{opacity:0;transform:translateY(32px);transition:opacity .9s ease,transform .9s ease;}',
'.nacar-root .reveal.is-visible{opacity:1;transform:translateY(0);}',
'.nacar-root .rsvp-form-collapse{max-height:0;opacity:0;overflow:hidden;transition:max-height .85s ease,opacity .65s ease;}',
'.nacar-root .rsvp-form-collapse.is-open{max-height:1100px;opacity:1;}',
'.nacar-root #hero-content{opacity:1;transition:opacity 1.6s ease-out;}',
'#weiOverlay.nacar-opening{background:radial-gradient(circle at 50% 42%,#fff 0%,#f8f6f2 55%,#eae3d5 100%);color:#3c4b5d;}',
'#weiOverlay.nacar-opening #weiImg{width:135px;height:auto;max-width:60vw;object-fit:contain;filter:drop-shadow(0 8px 18px rgba(60,75,93,.22));}',
'#weiOverlay.nacar-opening #weiTapLabel{font-family:"Jost",sans-serif;font-size:11px;letter-spacing:.22em;color:#3c4b5d;text-transform:uppercase;background:transparent;animation:none;}',
'#weiOverlay.nacar-opening .nacar-welcome{display:flex;flex-direction:column;align-items:center;justify-content:center;width:100%;min-height:100%;padding:24px;text-align:center;gap:24px;}',
'#weiOverlay.nacar-opening .nacar-welcome h2{font:400 44px/1.1 "Monsieur La Doulaise",cursive;color:#3c4b5d;}',
'#weiOverlay.nacar-opening .nacar-welcome p{font:400 16px/1.4 "Cormorant Garamond",serif;letter-spacing:.25em;text-transform:uppercase;}',
'#weiOverlay.nacar-opening #weiTapWrap{position:static;transform:none;}',
'#weiOverlay.nacar-opening .wei-chevron{display:none;}',
'body.ns-mobile-immersive .nacar-root{max-width:none;}',
'@media(max-width:560px){.nacar-root{max-width:100%;}}',
'@media(prefers-reduced-motion:reduce){.nacar-root .reveal{opacity:1;transform:none;transition:none;}}'
].join('\n');
const css=root.toString()+'\n'+extras;
fs.writeFileSync(dir+'nacar.css',css);
const scripts=[...source.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)];
const logic=scripts.map(x=>x[1]).find(x=>x.includes('function initScratchOff'));
if(!logic)throw Error('User interactive code missing');
const from=logic.indexOf('    // 6. INTRO VIDEO SEQUENCE'),to=logic.indexOf('    // 7. SCROLL-REVEAL ANIMATIONS',from);
if(from<0||to<from)throw Error('Intro block boundaries missing');
let script=logic.slice(0,from)+logic.slice(to);
script=script.replace(/new Date\(2027,\s*4,\s*20,\s*16,\s*30,\s*0\)\.getTime\(\)/,'new Date(window.__NACAR_DATE||"2027-05-20T16:30:00+02:00").getTime()');
script=script.replace("document.querySelectorAll('.reveal')","document.querySelectorAll('.nacar-root .reveal')");
const before="        rsvpForm.classList.add('hidden');\n        confirmation.classList.remove('hidden');";
const after=[
"        const preview = window.__NACAR_DEMO !== false;",
"        const formUrl = window.__NACAR_RSVP_FORM || '';",
"        const whatsapp = String(window.__NACAR_WHATSAPP || '').replace(/\\D/g,'');",
"        if (!preview && /^https:\\/\\//.test(formUrl)) { window.open(formUrl,'_blank','noopener'); return; }",
"        if (!preview && whatsapp.length >= 10) {",
"          const name = document.getElementById('rsvp-name')?.value || '';",
"          const yes = !!rsvpForm.querySelector('input[name=\"attending\"]:checked[value=\"yes\"]');",
"          window.open('https://wa.me/'+whatsapp+'?text='+encodeURIComponent('RSVP - '+name+' - '+(yes?'Accepts':'Declines')),'_blank','noopener'); return;",
"        }",
"        rsvpForm.classList.add('hidden');",
"        confirmation.classList.remove('hidden');",
"        const notice=confirmation.querySelector('p:nth-child(2)');",
"        if(notice) notice.textContent='This is a demo. No RSVP was sent or recorded.';"
].join('\n');
if(!script.includes(before))throw Error('RSVP section not found');
script=script.replace(before,after);
fs.writeFileSync(dir+'nacar-original.js','/* User supplied interactive logic (intro now shared with viewer). */\nwindow.startNacarOriginal=function(){\n'+script+'\n};\n');
console.log(JSON.stringify({classes:new Set(classes).size,template:template.length,css:css.length,runtime:script.length}));
