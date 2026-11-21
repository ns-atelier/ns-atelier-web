# N&S ATELIER — SEIS DEMOS INTERACTIVAS

## Qué contiene este paquete

- `index.html`: tu página principal original, con los seis botones «Ver demo» activados. Conserva estilos, WhatsApp, animación de tipeo y demás secciones.
- `images/diseno-01.jpg` … `images/diseno-06.jpg`: portadas actualizadas de cada demostración.
- `demos/index.html`: escaparate de las seis invitaciones.
- `demos/{nombre}/index.html`: invitación real de demostración, adaptable a escritorio y móvil.
- `demos/assets/demo.css`: estilos visuales compartidos.
- `demos/assets/demo.js`: animación de apertura, cuenta regresiva, RSVP simulado y compartir.

## Cómo instalar

1. Haz copia de seguridad del `index.html` actual de `E:\ns-atelier-web`.
2. Descomprime el ZIP y copia el contenido *interno* en `E:\ns-atelier-web`, fusionando carpetas. **No borres** `.git` ni reemplaces toda la carpeta del repositorio.
3. Abre la carpeta raíz desde VS Code.
4. Abre `index.html` mediante Live Server. Pulsa «Ver demo» en las seis tarjetas.
5. Para ver la galería completa, entra en `http://127.0.0.1:5500/demos/` (según el puerto de Live Server).
6. Comprueba celular con herramientas de Chrome o desde tu móvil cuando esté publicado.
7. Publica en GitHub con:

```bash
git add .
git commit -m "Agregar seis demos interactivas N&S ATELIER"
git push origin main
```

Netlify publicará automáticamente la nueva versión, si el repositorio continúa conectado.

## Enlaces públicos esperados

- `https://nysatelier.netlify.app/demos/`
- `https://nysatelier.netlify.app/demos/olivo/`
- `https://nysatelier.netlify.app/demos/jardin/`
- `https://nysatelier.netlify.app/demos/dorada/`
- `https://nysatelier.netlify.app/demos/aurora/`
- `https://nysatelier.netlify.app/demos/brisa/`
- `https://nysatelier.netlify.app/demos/estrellas/`

Usa como origen tu dirección real de Netlify. Los enlaces no están activos hasta publicar.

## Qué se puede personalizar

Cada demo tiene nombres, mensajes, fechas y agenda ficticios para visualizar la experiencia. Para crear una invitación real, la IA puede editar el objeto `window.INVITACION_DEMO` y el contenido HTML, o crear un modelo de datos por invitación. No edites a mano todas las páginas si no conoces el código: pide a la IA una versión exacta de la plantilla.

Música: no se incluye ningún audio por motivos de derechos de autor. Podrá añadirse audio con autorización/licencia, activado por el usuario.
Fotos: la galería usa marcadores ficticios para evitar fotos de personas reales sin consentimiento.
Ubicaciones: los mapas abren una búsqueda genérica de ejemplo, no un local real del evento.
RSVP: esta versión es **una demostración local**; **no envía ni guarda respuestas reales**.

## Fase siguiente

1. Formulario de pedido real con Netlify Forms: datos del cliente, tipo de evento, diseño, fecha, estilo, secciones, información de entrega, aceptación de privacidad.
2. Recepción de fotos de manera segura; no subir fotos de clientes ni datos personales al GitHub público.
3. Sistema por evento y panel de RSVP de verdad. Se requiere almacenamiento del lado del servidor para que los invitados confirmen y el cliente vea los resultados.
4. Invitaciones de enlace no listado. Una URL aleatoria + `noindex` disminuye la exposición pero **no asegura privacidad**. Para acceso verdaderamente restringido hace falta autenticación/validación en servidor y mantener secretos fuera del repositorio público.

## Sugerencia para la IA

«Trabaja sobre la carpeta de N&S ATELIER que te proporciono. No elimines componentes existentes. Cambia únicamente lo que te pida, manteniendo los seis demos y sus enlaces, la portada mobile-first y la compatibilidad con GitHub + Netlify. No incluyas datos privados de clientes en el repositorio público. Entrega archivos completos y una lista clara de archivos que debo reemplazar».
