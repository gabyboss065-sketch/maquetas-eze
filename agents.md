## Project Context
Overview
Catalogo web de maquetas a escala de estadios de futbol. Los clientes consultan y compran via WhatsApp; no hay checkout integrado en la pagina.

## Tech Stack
Vanilla JavaScript con ES6 modules
CSS con arquitectura basada en componentes
HTML plano
## Archivos Clave
js/data.js - Catalogo de productos con 26 modelos de estadios
js/store/cartStore.js - Gestion del estado del carrito
js/components/ - Componentes UI (header, catalog, productModal, cart, gallery)
js/modules/ - Modulos utilitarios (heroSlider, catalogFilter, personalizedSlider)
js/utils/ - Funciones helper (whatsapp, formatters, imageLoader)
js/productPage.js - Logica de pagina de producto individual
index.html - Pagina principal del catalogo
product.html - Pagina de detalle de producto
## Features
Catalogo de productos con filtrado
Carrito de compras con checkout por WhatsApp
Modal de detalle de producto y paginas dedicadas
Galeria de imagenes
Pedidos personalizados/custom de estadios (referenciaPersonalizada: true)
Gestion de stock (algunos productos tienen stock: 0)
Boton flotante de WhatsApp para contacto
Notificaciones toast
## Estructura de Datos de Producto
{
  id, estadio, club, escala, precio, stock,
  edicion, material, descripcion, imagen, galeria,
  destacado, referenciaPersonalizada
}
## Notas
Productos personalizados o sin stock con referenciaPersonalizada: true usan precio: 0 y stock: 0.
Algunos productos tienen destacado: true para displays destacados.
El checkout se realiza via mensaje de WhatsApp.
Guardrails de Mantenimiento
Los textos visibles de club, estadio, edicion y descripcion pueden cambiar por copy, pero no deben asumirse como claves estables para logica de negocio.
Si una feature depende de nombres oficiales, aliases o terminos de busqueda, agregar un campo explicito en js/data.js o una capa de normalizacion en vez de depender solo del texto renderizado.
Cambios de copy en js/data.js deben revisar impacto en busqueda, filtros, mensajes de WhatsApp y cualquier ordenamiento o destacado basado en strings.
Las features responsive no deben depender solo del ancho de pantalla en el momento de inicializacion si el componente puede sobrevivir a resize, rotacion o cambios de viewport.
Si una vista tiene comportamiento distinto entre desktop y mobile, el codigo debe tolerar re-inicializacion, escuchar cambios relevantes o usar CSS cuando sea suficiente para evitar estados inconsistentes.
Antes de cerrar cambios en catalogo o mobile, validar al menos estos escenarios: carga inicial en mobile, carga inicial en desktop, resize desktop->mobile y resize mobile->desktop.