/* Identificadores públicos y compatibilidad de enlaces históricos.
 * Las filas de DEMOS_WEB usan id canónico. PLANTILLAS y EVENTOS no se alteran.
 */
(function(){
  'use strict';
  const records=[
    {id:'red-vibrante',name:'Red Vibrante',aliases:['jardin-seda']},
    {id:'nacar',name:'Nácar',aliases:['olivo-marfil']},
    {id:'eleganza',name:'Eleganza',aliases:['jardin-eterno']},
    {id:'odette',name:'Odette',aliases:['noche-dorada']}
  ];
  const aliases=Object.create(null);
  const names=Object.create(null);
  for(const row of records){
    names[row.id]=row.name;
    for(const alias of row.aliases)aliases[alias]=row.id;
  }
  const canonical=id=>aliases[id]||id;
  window.NS_DEMO_REGISTRY=Object.freeze({
    records:Object.freeze(records.map(row=>Object.freeze({...row,aliases:Object.freeze(row.aliases)}))),
    aliases:Object.freeze(aliases),
    names:Object.freeze(names),
    canonical
  });
})();