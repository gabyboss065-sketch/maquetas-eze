# Maquetas Ezequiel

Catálogo web de maquetas a escala de estadios de fútbol, hechas a mano en Argentina. Los clientes exploran los modelos disponibles y realizan consultas directamente por WhatsApp.

🌐 [maquetasezequiel.com](https://maquetasezequiel.com)

---

## Stack

- **Frontend:** Vanilla JavaScript (ES Modules), HTML5, CSS3
- **Base de datos:** Supabase (PostgreSQL + Storage)
- **Deploy:** Vercel
- **Sin frameworks, sin bundlers** — el proyecto corre directo en el browser

---

## Estructura del proyecto

```
├── inicio.html             # Página principal
├── product.html            # Página de detalle de producto
├── admin.html              # Panel de administración (protegido por login)
├── index.html              # Redirect a inicio.html
│
├── css/
│   ├── base.css
│   ├── layout.css
│   └── components/         # Un archivo CSS por componente
│
├── js/
│   ├── app.js              # Entry point
│   ├── data.js             # Fallback local de productos
│   ├── components/         # Componentes UI
│   ├── modules/            # Sliders, filtros, paginación
│   ├── services/           # Capa de acceso a datos (Supabase)
│   ├── store/              # Estado del carrito
│   └── utils/              # Helpers (WhatsApp, formatters, icons)
│
├── assets/
│   ├── img/products/       # Fotos de cada maqueta
│   ├── img/best-sells/     # Imágenes destacadas
│   └── icons/              # SVGs
│
├── scripts/
│   └── sync-data.js        # Sincroniza Supabase → data.js (uso local)
│
├── robots.txt
└── sitemap.xml
```

---

## Funcionalidades

- **Catálogo completo** con 26 modelos de estadios argentinos e internacionales
- **Más vendidos** destacados en la sección principal
- **Pedidos personalizados** — sección dedicada para estadios a medida
- **Carrito de consulta** — el checkout se realiza vía WhatsApp
- **Modal y página de detalle** por producto con galería de imágenes
- **Búsqueda** por nombre de estadio o club
- **Panel admin** para gestionar productos, stock y precios (con autenticación)
- **Lazy loading** de imágenes y carga diferida para performance
- **Responsive** — diseñado mobile-first

---

## Datos de productos

Los productos se leen desde **Supabase** en tiempo real. El archivo `js/data.js` actúa como fallback si la conexión falla.

Cada producto tiene:

```js
{
  id, estadio, club, escala, precio, stock,
  edicion, material, descripcion,
  imagen, galeria,
  destacado, referenciaPersonalizada
}
```

Para sincronizar la base de datos con el fallback local:

```bash
node scripts/sync-data.js
```

---

## Variables de entorno

No requiere `.env`. Las claves de Supabase están en `js/lib/supabase.js` (se usa la `anon key` pública con Row Level Security habilitado).

---

## Correr localmente

No requiere instalación. Cualquier servidor estático funciona:

```bash
# Con VS Code: instalar extensión Live Server y abrir inicio.html
# Con Python:
python -m http.server 3000
# Con Node:
npx serve .
```

---

## Deploy

El proyecto se despliega automáticamente en **Vercel** con cada push a `main`.

