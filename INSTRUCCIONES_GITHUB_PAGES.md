# NYS Atelier — versión preparada para GitHub Pages

Fecha de revisión: 22 de noviembre de 2026

## Dirección del sitio

https://ns-atelier.github.io/ns-atelier-web/

## Cómo reemplazar tu proyecto sin perder Git

1. Haz una copia de seguridad de tu carpeta de trabajo `E:\ns-atelier-web`.
2. **No borres la carpeta de trabajo** ni la carpeta oculta `.git` que contiene la conexión a GitHub.
3. Descomprime este ZIP en una carpeta temporal, por ejemplo `Descargas\NYS-ATELIER-CORREGIDO\`.
4. Entra en la subcarpeta `ns-atelier-web` del ZIP y **copia todo su contenido** (no copies la carpeta completa dentro de otra carpeta con el mismo nombre).
5. Pega esos archivos en `E:\ns-atelier-web`, acepta reemplazar los archivos existentes. No elimines tus archivos personales que no vengan en el ZIP.
6. En Visual Studio Code abre la carpeta `E:\ns-atelier-web` y ejecuta en su terminal:

```powershell
git status --short
git add -A
git commit -m "Reparar rutas de GitHub Pages y demos"
git push origin main
```

Si Git indica "nothing to commit", no hay cambios por enviar; revisa que hayas copiado el contenido en la carpeta correcta. No se necesita ejecutar `git init` ni volver a configurar el `remote`.

7. Comprueba los siguientes enlaces después de que GitHub Pages publique el nuevo commit:
   - Inicio: https://ns-atelier.github.io/ns-atelier-web/
   - Logo: https://ns-atelier.github.io/ns-atelier-web/assets/logo-ns.webp
   - Catálogo: https://ns-atelier.github.io/ns-atelier-web/catalogo.html
   - Demo Perla & Nácar: https://ns-atelier.github.io/ns-atelier-web/inv/?demo=perla-nacar
   - Demo The Sacred Garden: https://ns-atelier.github.io/ns-atelier-web/inv/?demo=the-sacred-garden

Si observas imágenes antiguas, prueba Ctrl+F5 o una ventana privada.

## Cambios realizados

- Referencias absolutas `/assets/...`, `/inv/...`, `/catalogo`, etc. corregidas para que no apunten por error a la raíz del dominio `ns-atelier.github.io`.
- Se agregó un resolvedor `nsSiteUrl()` que adapta rutas recibidas desde Google Apps Script, incluidas referencias antiguas a archivos locales de `nysatelier.netlify.app` cuando tienen una ruta `/inv/...`, `/assets/...`, etc.
- Catálogo: al fallar Google Apps Script, se conservan las tarjetas estáticas en vez de quedar vacío. Los tres modelos clásicos locales apuntan a sus demos de la carpeta `/demos/`.
- Visor: cuando falla el servicio, las seis demos del JSON local pueden seguir abriéndose. The Sacred Garden tiene una muestra de respaldo con imágenes y videos identificados dentro del ZIP.
- CSS de corona final centrado. El mensaje `atelier-center` del editor restablece desplazamientos a 0 cuando la corona existe.
- La página `404.html` gestiona las antiguas rutas `/catalogo` y `/inv/TOKEN` en GitHub Pages. Se añadió `.nojekyll`.
- El ZIP de entrega excluye `.git` para que no se reemplace ni exponga el historial local.

## Límites importantes

- **Este ZIP no incluye el código de tu panel administrativo.** El proyecto contiene el visor de invitaciones (`inv/index.html`) y un cliente de consulta de Google Apps Script (`assets/panel-api.js`). No es posible modificar ni verificar el guardado real del panel sin sus archivos y configuración.
- **GitHub Pages es un alojamiento estático.** No almacena por sí solo cambios de plantillas, medios subidos ni respuestas RSVP. El visor sigue consultando Google Apps Script; la funcionalidad de edición/guardado depende de que ese servicio siga activo y responda correctamente.
- **Demos web y Plantillas:** las seis demos de `assets/demos-coleccion-lujo.json` son contenido público de respaldo; los datos de las plantillas privadas NO se incorporaron al catálogo. Las respuestas de la API pueden cambiar el catálogo de acuerdo con la configuración externa.
- **Privacidad:** cualquier archivo subido a un repositorio público es visible y descargable, incluso si está en una carpeta de invitación «no listada» (`/i/`) o se usa `noindex`. Los archivos en `/inv/assets/uploads/` y las invitaciones de clientes no deberían publicarse si contienen información privada o fotografías sin autorización.
- Las imágenes y videos que solo existen en dominios externos (como `static.tildacdn.net`, `assets.webgencyinvitations.com` u otros) **todavía dependen de esos sitios**. Las rutas locales disponibles sí están incluidas. Para hacer una plantilla totalmente independiente de proveedores externos es necesario que tengas y proporciones los archivos originales con derechos de uso.
- Algunos enlaces RSVP del visor son de demostración y no envían datos; verifica Google Forms o el sistema de confirmaciones antes de usar enlaces con clientes.
- Comprueba los derechos de uso de la música y los videos antes de publicarlos, especialmente aquellos subidos para pruebas.

## Validaciones realizadas

- Se revisaron 106 enlaces locales escritos en archivos HTML: no faltan archivos en las rutas resultantes.
- Validación de sintaxis de los scripts principales con Node.js.
- Las 52 imágenes locales del ZIP pasaron la lectura de integridad.
- Comprobados los formatos de los videos de la muestra de The Sacred Garden.
- **No se validó visualmente en un navegador remoto ni se pudo probar el panel administrativo externo.** Después de subirlo a GitHub, revisa la página publicada y, si sigues viendo errores, abre las herramientas de desarrollador de Chrome > Network para comprobar qué dirección falla.

## No borres Netlify todavía

Conserva la copia anterior hasta verificar el catálogo, las invitaciones publicadas y los enlaces de clientes. Algunos enlaces antiguos pueden estar compartidos con invitados y podrían seguir apuntando a Netlify.
