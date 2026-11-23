# Cambio de video y optimización automática — NYS Atelier

## Cambiar Videohistorias (un solo archivo)

1. Abre https://github.com/ns-atelier/ns-atelier-web/tree/main/assets/videohistorias
2. Pulsa **Add file → Upload files**.
3. Sube un MP4 llamado **video-nuevo.mp4** (nombre exacto, sin espacios).
4. Pulsa **Commit changes** en la rama **main**.
5. GitHub Actions ejecutará **Optimizar multimedia de NYS Atelier**.

Cuando el nuevo MP4 pase las comprobaciones, el proceso:
- lo publica como `assets/videohistorias/videohistorias-actual.mp4`;
- lo prepara para reproducción rápida sin recodificar imagen ni audio;
- intenta una alternativa WebM sólo si queda significativamente más pequeña;
- genera `videohistorias-actual.webp` para la portada;
- adapta automáticamente el reproductor a la orientación y duración reales;
- elimina `videohistorias-34s.mp4` y `historias-3d.mp4` **sólo después de validar la nueva versión**;
- elimina el archivo temporal `video-nuevo.mp4`.

Puedes repetir el proceso cuando quieras cambiar nuevamente el video.

## Optimización del resto de medios públicos

Cada vez que añadas o cambies archivos en las carpetas del repositorio, el workflow crea:
- derivados **WebP** de fotos JPG/PNG, preservando los originales (y los píxeles de la transparencia);
- derivados **Opus** de audio MP3/WAV cuando el tamaño es menor, sin borrar los originales;
- referencias WebP para imágenes **estáticas** en HTML, siempre que la versión WebP exista.

Los archivos que ya sean eficientes permanecen tal cual. Los JPG y los MP3/MP4 ya comprimidos no siempre pueden reducirse más sin degradar calidad. WebP con calidad 90 y Opus son codificaciones con pérdida; para no alterar ni perder las fuentes se conservan los archivos originales.

**Importante:** este workflow sólo procesa archivos efectivamente subidos al repositorio GitHub. El **panel administrativo con Google Apps Script** es un servicio distinto y su cargador necesita integrarse con una función de optimización antes de enviar archivos al servidor. Hasta actualizar el código de ese panel, las subidas realizadas desde el panel **no** se comprimen automáticamente por este workflow.

No borres los medios originales de las invitaciones de clientes: podrían estar referenciados por enlaces publicados y por los datos del panel.
