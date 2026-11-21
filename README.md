# N&S ATELIER — sitio web

Este proyecto contiene la página web estática de N&S ATELIER.

## Archivos

- `index.html`: página completa (HTML, CSS y JavaScript integrados).
- `images/`: imágenes de ejemplo que puedes sustituir por tus diseños y reseñas reales.
- `PROMPT-PARA-IA.md`: instrucciones para pedirle a una IA que modifique la web sin romper su diseño.

## Abrir y editar en Visual Studio Code

1. Descomprime la carpeta `ns-atelier-web` en Documentos o Escritorio.
2. Instala Visual Studio Code y Git para Windows.
3. Abre Visual Studio Code y selecciona **Archivo > Abrir carpeta**. Elige `ns-atelier-web`.
4. Abre `index.html` y edita con ayuda de una IA. Para ver la web, abre `index.html` en Chrome. También puedes instalar la extensión **Live Server** y elegir **Open with Live Server**.
5. Para cambiar las imágenes, conserva los nombres `diseno-01.jpg` a `diseno-06.jpg` y `resena-01.jpg` a `resena-03.jpg`, o actualiza las rutas correspondientes en `index.html`.

## Datos que todavía debes completar antes de anunciar la web

En `index.html` hay datos provisionales que deben sustituirse:

- WhatsApp: `51999999999`
- Instagram: `https://instagram.com/tuusuario`
- TikTok: `https://tiktok.com/@tuusuario`
- Correo: `hola@tumarca.pe`
- Precios, demos y reseñas reales.

No publiques esos datos provisionales como si fueran los definitivos.

## Publicar con GitHub + Netlify

1. Crea una cuenta personal gratuita en GitHub.
2. Crea un repositorio llamado `ns-atelier-web`. Puedes configurarlo como **Private** para mantener privado el código.
3. En Visual Studio Code abre el panel **Control de código fuente** (icono de rama).
4. Selecciona **Initialize Repository** si aparece.
5. Escribe un mensaje como `Primera versión de N&S ATELIER` y pulsa **Commit**.
6. Pulsa **Publish Branch / Publish to GitHub** y elige el repositorio personal `ns-atelier-web`. Inicia sesión cuando VS Code lo solicite.
7. En Netlify crea una cuenta gratuita y selecciona **Add new project > Import an existing project > GitHub**.
8. Autoriza a Netlify y selecciona `ns-atelier-web`.
9. Para esta web estática deja el comando de compilación vacío y configura el directorio de publicación como `.` (raíz del repositorio).
10. Pulsa **Deploy**. Netlify te dará una dirección `*.netlify.app`.

Cada vez que modifiques archivos en VS Code:

1. Guarda los archivos.
2. Abre **Control de código fuente**.
3. Revisa los cambios, escribe un mensaje breve y pulsa **Commit**.
4. Pulsa **Sync Changes / Push**.
5. Netlify detectará el cambio de GitHub y publicará la nueva versión automáticamente.

## Uso de IA sin programar

Puedes usar ChatGPT: adjunta `index.html` para cambios de texto o diseño sencillos. Si el cambio afecta imágenes o varias carpetas, adjunta el ZIP del proyecto. Pide siempre que conserve las rutas de imágenes, el diseño adaptable a móviles y las secciones existentes. Descarga los archivos modificados y reemplaza los anteriores en esta carpeta.

También puedes instalar GitHub Copilot en VS Code si quieres conversar con una IA dentro del editor. Sus funciones gratuitas tienen límites de uso.

## Recomendaciones

- Antes de cada cambio importante, haz un `Commit` para poder volver a una versión anterior.
- No subas contraseñas, claves privadas, tokens, datos bancarios ni información privada de clientes.
- Comprueba la web en móvil y computadora antes de compartirla.
- Netlify Free tiene límites mensuales de uso; revisa el panel de consumo. El plan gratuito aplica límites duros y no debería generar cargos automáticos por excederlos.
