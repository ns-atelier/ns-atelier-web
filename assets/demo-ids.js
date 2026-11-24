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
  const reservedDemoIds = new Set([
    'red-vibrante','nacar','eleganza','odette','dolce-vita','fresco','theatre','blossom-oud','ana-diego',
    'the-sacred-garden','perla-nacar','encaje-marfil','vitral-floral','villa-toscana','costa-azul','gala-terciopelo'
  ]);
  const demoFamily = canonical;
  const validDemoRoute = value => typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length <= 60;

  const slugDemoName = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
    .replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,60).replace(/-+$/,'');
  function demoRoutes(items) {
    const owners = new Map(items.map(item=>[item.id,item.id]));
    const routes = new Map(items.map(item=>[item.id,{rutaDemo:'',rutasAnterioresDemo:[]}]));
    function claim(route,id) {
      if (!validDemoRoute(route) || (owners.has(route) && owners.get(route)!==id)) return false;
      const family = demoFamily(route);
      if (reservedDemoIds.has(family) && family!==demoFamily(id)) return false;
      owners.set(route,id);
      return true;
    }
    // Reserve previous addresses and saved current addresses before assigning new ones.
    for (const item of items) {
      const previous = Array.isArray(item.rutasAnterioresDemo) ? item.rutasAnterioresDemo : [];
      routes.get(item.id).rutasAnterioresDemo = [...new Set(previous)].filter(route=>claim(route,item.id));
    }
    for (const item of items) {
      if (claim(item.rutaDemo,item.id)) routes.get(item.id).rutaDemo=item.rutaDemo;
    }
    for (const item of items) {
      const assigned = routes.get(item.id);
      if (!assigned.rutaDemo) {
        const base = slugDemoName(item.nombre) || slugDemoName(item.id) || 'demo';
        let candidate = base;
        for (let number=2; !claim(candidate,item.id); number++) {
          const suffix = '-' + number;
          candidate = base.slice(0,60-suffix.length).replace(/-+$/,'') + suffix;
        }
        assigned.rutaDemo = candidate;
      }
      assigned.rutasAnterioresDemo = assigned.rutasAnterioresDemo.filter(route=>route!==assigned.rutaDemo);
    }
    return routes;
  }
  window.NS_DEMO_REGISTRY=Object.freeze({
    records:Object.freeze(records.map(row=>Object.freeze({...row,aliases:Object.freeze(row.aliases)}))),
    aliases:Object.freeze(aliases),
    names:Object.freeze(names),
    canonical, catalogRoutes:demoRoutes, validDemoRoute
  });
})();