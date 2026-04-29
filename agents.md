# Project Context

## Overview
Catálogo web de maquetas a escala de estadios de fútbol. Los clientes consultan y compran vía WhatsApp - no hay checkout integrado en la página.

## Tech Stack
- Vanilla JavaScript con ES6 modules
- CSS con arquitectura basada en componentes
- HTML plano

## Archivos Clave
- `js/data.js` - Catálogo de productos con 26 modelos de estadios
- `js/store/cartStore.js` - Gestión del estado del carrito
- `js/components/` - Componentes UI (header, catalog, productModal, cart, gallery)
- `js/modules/` - Módulos utilitarios (heroSlider, catalogFilter, personalizedSlider)
- `js/utils/` - Funciones helper (whatsapp, formatters, imageLoader)
- `js/productPage.js` - Lógica de página de producto individual
- `index.html` - Página principal del catálogo
- `product.html` - Página de detalle de producto

## Features
- Catálogo de productos con filtrado
- Carrito de compras con checkout por WhatsApp
- Modal de detalle de producto y páginas dedicadas
- Galería de imágenes
- Pedidos personalizados/custom de estadios (referenciaPersonalizada: true)
- Gestión de stock (algunos productos tienen stock: 0)
- Botón flotante de WhatsApp para contacto
- Notificaciones toast

## Estructura de Datos de Producto
```javascript
{
  id, estadio, club, escala, precio, stock,
  edicion, material, descripcion, imagen, galeria,
  destacado, referenciaPersonalizada
}
```

## Notas
- Productos personalizados/sin stock (referenciaPersonalizada: true) tienen precio: 0 y stock: 0
- Algunos productos tienen `destacado: true` para displays destacados
- El checkout se realiza vía mensaje de WhatsApp