import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const tw=require('tailwindcss'), postcss=require('postcss');
const dir='inv/';
const source=fs.readFileSync(dir+'odette-source.html','utf8');
const begin=source.indexOf('<main class="">'),end=source.indexOf('</main>',begin);
if(begin<0||end<begin)throw Error('Odette: no se encontró <main>');
const host='https://template-odette.thedigitalyes.com';
const markup=source.slice(begin,end+7)
 .replace(/style="opacity:\s*0;\s*transform:[^"]+"/g,'data-odette-reveal')
 .replace(/style="transform: scaleY\(0\);"/g,'style="transform: scaleY(1);"')
 .replace(/(<video\b[^>]*?)(\sautoplay="")/g,'$1 muted=""$2')
 .replace(/\bpreload="auto"/g,'preload="metadata"')
 .replace(/\b(src|poster)="(\/(?:__l5e|assets)\/[^"]+)"/g,(_match,attr,value)=>attr+'="'+host+value+'"');
const template='<div class="odette-root" data-template="odette">\n'+markup+'\n</div>\n';
if(!template.includes('id="countdown"')||!template.includes('id="hero"')||!template.includes('id="rsvp"'))throw Error('Secciones principales ausentes');
fs.writeFileSync(dir+'odette-template.html',template);
const theme=fs.readFileSync(require.resolve('tailwindcss/theme.css'),'utf8');
const preflight=fs.readFileSync(require.resolve('tailwindcss/preflight.css'),'utf8');
const custom=[
'@theme {','--color-background:#c8ced2;','--color-foreground:#1a2a40;',
'--color-sage-dark:#1a2a40;','--color-sage:#aebdd2;','--color-gold:#b79a6c;',
'--color-ivory:#f8f6f2;','--color-carbon:#273746;','--color-primary:#1a2a40;',
'--color-ring:#1a2a40;','--font-display:"Cormorant Garamond",Georgia,serif;',
'--font-script:"Great Vibes",cursive;','--font-body:"Jost",sans-serif;','}',
'@tailwind utilities;'].join('\n');
const compiler=await tw.compile(theme+'\n'+custom+'\n'+preflight);
const classes=[...markup.matchAll(/\bclass\s*=\s*"([^"]+)"/g)].flatMap(m=>m[1].trim().split(/\s+/));
const generated=compiler.build([...new Set(classes)]);
if(generated.length<10000)throw Error('No se generaron estilos suficientes');
const root=postcss.parse(generated);
root.walkAtRules('media',rule=>{
 if(rule.params.trim()==='(width >= 48rem)'){rule.name='container';rule.params='(min-width: 620px)';}
 if(rule.params.trim()==='(width >= 64rem)'){rule.name='container';rule.params='(min-width: 750px)';}
});
root.walkRules(rule=>{
 if(rule.parent?.type==='atrule'&&/keyframes/i.test(rule.parent.name))return;
 const val=rule.selector.trim();
 if(val===':root, :host'||val===':host, :root'){rule.selector='.odette-root';return;}
 const bits=val.split(/,(?![^()]*\))/).map(x=>x.trim()).filter(Boolean);
 rule.selector=bits.map(part=>[':root',':host','html','body'].includes(part)?'.odette-root':'.odette-root '+part).join(', ');
});
const extras=[
'.odette-root{--color-background:#c8ced2;--color-foreground:#1a2a40;container-type:inline-size;position:relative;width:100%;max-width:800px;margin:0 auto;min-height:100vh;overflow-x:clip;background:linear-gradient(#c8ced2,#eef0ef 45%,#d6dcdf);color:#1a2a40;font-family:"Jost",sans-serif;}',
'.odette-root main{width:100%;max-width:none;margin:0;}',
'.odette-root img,.odette-root video{max-width:100%;}',
'.odette-root .font-script{font-family:"Great Vibes",cursive;}',
'.odette-root .font-display{font-family:"Cormorant Garamond",Georgia,serif;}',
'.odette-root [data-odette-reveal]{opacity:1;transform:none;transition:opacity 950ms ease,transform 1100ms cubic-bezier(.22,1,.36,1);}',
'.odette-root.odette-motion-ready [data-odette-reveal]{opacity:0;transform:translateY(24px) scale(.99);}',
'.odette-root.odette-motion-ready [data-odette-reveal].odette-visible{opacity:1;transform:none;}',
'.odette-root :is(section,footer){width:100%;}',
'.odette-root .section-padding{padding:clamp(32px,6vw,60px) clamp(14px,4vw,30px);}',
'.odette-root :is(input,textarea){max-width:100%;}',
'.odette-root :is(button,a){touch-action:manipulation;}',
'.odette-root .odette-rsvp-feedback{border-radius:12px;padding:13px 16px;margin-top:18px;background:#eaf0f1;color:#1a2a40;font:500 13px/1.5 "Jost",sans-serif;}',
'.odette-root .odette-gifts-detail{max-width:450px;margin:16px auto 0;text-align:center;padding:18px;border-radius:12px;background:rgba(255,255,255,.7);color:#1a2a40;box-shadow:0 6px 22px rgba(25,40,62,.07);}',
'.odette-root .odette-gifts-detail[hidden]{display:none!important;}',
'.odette-root #hero video{background:#c8ced2;}',
'body.odette-mode{background:radial-gradient(ellipse at 40% 12%,#ebeff1,#bac6ce 70%);}',
'body.ns-mobile-immersive .odette-root{max-width:none;}',
'#weiOverlay.odette-opening{background:#c8ced2;}',
'#weiOverlay.odette-opening #weiImg{width:min(100%,550px);height:100dvh;max-width:none;object-fit:cover;object-position:center;filter:none;}',
'#weiOverlay.odette-opening #weiTapWrap{position:absolute;z-index:4;bottom:12%;left:0;right:0;transform:none;}',
'#weiOverlay.odette-opening #weiTapLabel{color:#fff;font:600 12px/1.4 "Jost",sans-serif;letter-spacing:.2em;text-transform:uppercase;text-shadow:0 2px 12px #182944;animation:none;}',
'#weiOverlay.odette-opening .wei-chevron{display:none;}',
'@media(max-width:620px){.odette-root{max-width:100%;}.odette-root .section-padding{padding:32px 14px;}}',
'@media(prefers-reduced-motion:reduce){.odette-root.odette-motion-ready [data-odette-reveal]{opacity:1;transform:none;transition:none;}}'
].join('\n');
fs.writeFileSync(dir+'odette.css',root.toString()+'\n'+extras);
console.log(JSON.stringify({html:template.length,css:(root.toString()+extras).length,classes:new Set(classes).size}));
