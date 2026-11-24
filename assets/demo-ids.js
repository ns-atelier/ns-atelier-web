/* Identificadores públicos y compatibilidad de enlaces históricos.
 * Las filas de DEMOS_WEB usan id canónico. PLANTILLAS y EVENTOS no se alteran.
 */
(function(){
  'use strict';
  const records=[
    {id:'red-vibrante',name:'Red Vibrante',aliases:['jardin-seda']},
    {id:'nacar',name:'Nácar',aliases:['olivo-marfil']},
    {id:'eleganza',name:'Eleganza',aliases:['jardin-eterno']},
    {id:'odette',name:'Odette',aliases:['noche-dorada']},
    {id:'dolce-vita',name:'Dolce Vita',aliases:[]},
    {id:'fresco',name:'Fresco',aliases:[]},
    {id:'theatre',name:'Theatre',aliases:[]},
    {id:'blossom-oud',name:'Blossom & Oud',aliases:[]},
    {id:'ana-diego',name:'Ana & Diego',aliases:[]}
  ];
  const aliases=Object.create(null);
  const names=Object.create(null);
  for(const row of records){
    names[row.id]=row.name;
    for(const alias of row.aliases)aliases[alias]=row.id;
  }
  const canonical=id=>aliases[id]||id;
  function search(id,name) {
    const design = canonical(id);
    const slug = String(name || '').normalize('NFD').replace(/[̀-ͯ]/g,'')
      .toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,60).replace(/-+$/,'') || design;
    const params = new URLSearchParams({demo:slug});
    // Keep the sheet row addressable after the public name changes.
    if (slug !== id) params.set('modelo',id);
    return params;
  }
  window.NS_DEMO_REGISTRY=Object.freeze({
    records:Object.freeze(records.map(row=>Object.freeze({...row,aliases:Object.freeze(row.aliases)}))),
    aliases:Object.freeze(aliases),
    names:Object.freeze(names),
    canonical, search
  });
})();