# Organizacion de imagenes de producto

Esta carpeta queda preparada para migrar las imagenes remotas actuales a assets locales sin romper rutas.

## Estructura recomendada

Usa siempre esta forma:

`assets/img/products/<equipo-slug>/<estadio-slug>/`

Ejemplo:

`assets/img/products/boca-juniors/la-bombonera/`

## Nombres de archivo

Mantener estos nombres evita cambios innecesarios en el futuro:

- `cover.webp`: imagen principal del producto
- `gallery-01.webp`
- `gallery-02.webp`
- `gallery-03.webp`
- `gallery-04.webp`
- `gallery-05.webp`
- `gallery-06.webp`

Si un producto tiene menos imagenes, deja solo las que existan.

## Reglas para no romper enrutamiento

- No usar espacios, tildes ni `ñ` en carpetas o archivos.
- Mantener todas las rutas relativas desde la raiz del proyecto:
  - `assets/img/products/...`
- No mover `product.html`, `index.html` ni la carpeta `assets`.
- Si luego cambias `js/data.js`, apunta siempre a rutas como:
  - `assets/img/products/boca-juniors/la-bombonera/cover.webp`

## Flujo recomendado

1. Optimizar la imagen final.
2. Guardarla en la carpeta del equipo y estadio correspondiente.
3. Reemplazar primero `cover.webp`.
4. Agregar despues `gallery-01.webp`, `gallery-02.webp`, etc.
5. Cuando quieras, migramos `js/data.js` de URLs externas a estas rutas locales.

## Nota

Por ahora la web sigue funcionando con las URLs remotas actuales, asi no se rompe nada hoy. Esta estructura deja listo el lugar correcto para que pegues las imagenes optimizadas despues.
