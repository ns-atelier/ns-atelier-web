# N&S ATELIER — Próximas etapas: pedidos, personalización, RSVP y enlaces privados

## Punto de partida

La web pública y las seis demos son estáticas y están guardadas en GitHub. Actualmente, el RSVP mostrado dentro de las demos solo simula la experiencia; no recoge ni guarda datos de personas reales.

## Fase 1 — Formulario de contratación

Implementar `/pedido/index.html` usando **Netlify Forms** para recibir pedidos sin crear un servidor aparte. Los datos se almacenarán en el panel de Netlify Forms y podrán consultarse y exportarse por la persona administradora. El formulario debe tener validación, aviso de privacidad y protección contra spam.

Campos recomendados, agrupados en pasos cortos:

1. Datos de contacto: nombre del cliente, email y WhatsApp (opcionales según canal, al menos uno obligatorio).
2. Servicio: invitación digital o videohistoria 3D; paquete; código de diseño seleccionado.
3. Evento: tipo, protagonistas, fecha, hora, ceremonia, recepción y enlaces reales de Google Maps.
4. Personalización: paleta, tipografía, saludo, idioma, música que el cliente tenga derecho a utilizar, tres fotos, preferencias de animaciones.
5. Bloques opcionales: RSVP, cuenta regresiva, itinerario, dress code, galería, obsequios, recomendaciones, FAQ.
6. Revisiones: texto de observaciones y medio de contacto preferido.
7. Consentimiento: confirmación de términos y tratamiento de datos; informar almacenamiento, finalidad, plazo y contacto de privacidad.

Los archivos personales y las fotografías de los invitados **no deben publicarse en el repositorio GitHub público**. Si en el futuro se habilitan cargas desde la web, se debe configurar almacenamiento con controles de acceso adecuados y restricciones de tipo/tamaño.

## Fase 2 — Diseño personalizado y cambios

Usaremos como **modelo** cada demo (`demos/<modelo>/`). La próxima versión del sistema debería separar presentación de datos:

- `plantilla`: estructura reusable de la invitación.
- `tema`: colores, fuentes, ornamentación y animaciones propias.
- `datos`: nombres, fechas, cronograma, mapas y textos del evento.
- `bloques`: opciones mostradas y el orden de las secciones.

Entonces la IA podrá cambiar solo los datos del cliente y el estilo solicitado sin reescribir toda la invitación. Para clientes premium, se crea un tema CSS o una portada enteramente nueva, manteniendo el funcionamiento del RSVP.

Proceso sugerido: pedido → confirmar pago → recibir datos → preparar borrador privado → comentarios del cliente → corregir → aprobar → publicar enlace final → gestionar confirmaciones.

## Fase 3 — Enlaces individuales y privacidad

Diferenciar dos niveles de acceso:

**A. No listado (cualquiera con el enlace puede abrirlo):** URL no enlazada desde el catálogo, con una ruta aleatoria y etiquetas `noindex`. Es útil si no hay datos sensibles. `noindex` no es control de acceso, y los visitantes pueden compartir la URL.

**B. Realmente restringido:** solicitar una contraseña, código o autenticación validada **en el servidor** antes de mostrar los datos del evento. No basta con JavaScript del navegador ni con esconder la ruta.

Ejemplo de estructura futura del mismo dominio:

- `https://TU-SITIO.netlify.app/` — sitio comercial público.
- `https://TU-SITIO.netlify.app/demos/olivo/` — demo pública.
- `https://TU-SITIO.netlify.app/i/<token_aleatorio>` — invitación individual, con datos servidos desde un componente privado.
- `https://TU-SITIO.netlify.app/rsvp/<token_aleatorio>` — recepción de confirmaciones del evento.

Para los enlaces individuales podemos crear una **Netlify Function** con una ruta `/i/:token` y almacenar el contenido en **Netlify Blobs** o una base de datos administrada, fuera del repositorio público. El token debe generarse con suficiente aleatoriedad y validarse en el servidor. Para proteger realmente los datos se añade autenticación y permisos; un token por sí solo sigue siendo un enlace compartible.

## Fase 4 — RSVP real y panel

Formulario independiente del de contratación. Recibir nombre de invitado, grupo, asistencia, acompañantes autorizados y observaciones voluntarias. Enviar datos a backend de forma validada y con medidas anti-spam. Guardar respuestas asociadas al identificador de evento. El cliente solo podrá consultar **sus** respuestas tras verificación. No exponer el contenido del panel sin autenticación.

Para un comienzo económico, el **formulario de contratación** puede usar Netlify Forms. Para un **panel RSVP multi-evento** con filtros por evento y acceso por cliente hará falta lógica del lado servidor y almacenamiento estructurado. Netlify Functions es una opción integrada; Netlify Blobs sirve para casos simples de clave/valor, mientras que una base de datos estructurada es mejor si hay muchas confirmaciones simultáneas.

## Lo que NO hace el paquete actual

- No guarda RSVPs de invitados reales.
- No crea todavía formularios de pedido activos.
- No produce ni verifica enlaces secretos reales.
- No incluye usuarios, contraseñas, paneles privados ni archivos personales de clientes.

La implementación de esas funciones será la siguiente fase de trabajo. Se mantendrá toda la lógica en archivos editables desde VS Code y almacenados en GitHub, mientras que los datos personales y las claves permanecerán fuera del repositorio público.

## Referencias técnicas consultadas

- https://docs.netlify.com/manage/forms/setup/
- https://docs.netlify.com/manage/forms/submissions/
- https://docs.netlify.com/build/functions/configuration/
- https://docs.netlify.com/build/data-and-storage/netlify-blobs/
- https://developers.google.com/search/docs/crawling-indexing/control-what-you-share
