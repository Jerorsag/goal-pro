# GoalPro — Tienda de Guayos de Fútbol

Página web para promocionar y vender guayos de fútbol de las principales marcas. Desarrollada con HTML5 semántico, CSS3 (Flexbox + Grid + variables) y JavaScript Vanilla ES6+ modular. Sin frameworks externos.

Parcial 1 — Programación con Tecnologías Web · V Semestre · Universidad Humboldt

---

## Cómo correrlo localmente

El proyecto usa módulos ES6 (`type="module"`), por lo que requiere un servidor HTTP local (no funciona abriendo `index.html` directamente en el navegador).

**Opción 1 — VS Code Live Server**
1. Instala la extensión [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer).
2. Click derecho sobre `index.html` → *Open with Live Server*.

**Opción 2 — Node.js `serve`**
```bash
npx serve .
```

**Opción 3 — Python**
```bash
# Python 3
python -m http.server 3000
```

Luego abre `http://localhost:3000` (o el puerto que corresponda) en tu navegador.

---

## Estructura de archivos

```
/
├── index.html
├── css/
│   ├── variables.css   # Tokens de diseño (colores, espaciados, tipografía)
│   ├── reset.css       # Normalización y base
│   ├── layout.css      # Estructura de página, grid, responsive
│   └── components.css  # Botones, tarjetas, formulario, mensajes
├── js/
│   ├── mockApi.js      # API simulada (GET /api/products, POST /api/orders)
│   ├── ui.js           # Funciones de renderizado y manipulación del DOM
│   └── app.js          # Punto de entrada: orquesta datos y eventos
└── assets/
    └── images/         # Imágenes de productos
```

---

## Endpoints simulados (`mockApi.js`)

### `getProducts()`
| Campo         | Detalle |
|---------------|---------|
| Equivalente   | `GET /api/products` |
| Parámetros    | Ninguno |
| Respuesta OK  | `{ products: Array<Product> }` donde cada producto tiene `id`, `name`, `description`, `price`, `stock`, `image`, `switchType` |
| Respuesta error | `Error` con mensaje para mostrar en la UI + `console.error("500 Internal Server Error: GET /api/products")` |
| Delay         | 800 ms (simula latencia de red) |

**Ejemplo de respuesta exitosa:**
```json
{
  "products": [
    {
      "id": 1,
      "name": "Nike Mercurial Vapor 15 Elite",
      "description": "Diseñado para máxima velocidad...",
      "price": 650000,
      "stock": 10,
      "image": "assets/images/mercurial.jpg",
      "brand": "Nike",
      "terrain": ["FG", "AG"]
    }
  ]
}
```

---

### `createOrder(orderData)`
| Campo         | Detalle |
|---------------|---------|
| Equivalente   | `POST /api/orders` |
| Parámetros    | `{ productId: number, quantity: number, shoeSize: string, surface: string, fullName: string, email: string, phone?: string, deliveryDate: string }` |
| Respuesta OK  | `{ order: { id, product, quantity, total, status, estimatedDelivery } }` |
| Respuesta error | `Error` con mensaje descriptivo para la UI + `console.error("500 Internal Server Error: POST /api/orders")` |
| Delay         | 800 ms (simula latencia de red) |

**Ejemplo de respuesta exitosa:**
```json
{
  "order": {
    "id": "GP-1715800000000-42",
    "product": "Nike Mercurial Vapor 15 Elite",
    "shoeSize": "42",
    "surface": "FG",
    "quantity": 1,
    "total": 650000,
    "status": "confirmed",
    "estimatedDelivery": "2025-05-20"
  }
}
```

**Casos de error manejados:**
- Error de servidor aleatorio (15 % de probabilidad, configurable con `ERROR_RATE`).
- Producto no encontrado.
- Stock insuficiente para la cantidad solicitada.

---

## Criterios cubiertos

| Criterio | Implementación |
|----------|---------------|
| Semántica HTML | `header`, `nav`, `main`, `section`, `article`, `footer`; un solo `h1`; labels visibles con `for`; types correctos (`email`, `tel`, `number`, `date`) |
| Responsividad | Mobile-first, Grid + Flexbox, media queries en 768 px |
| Usabilidad | Textos de botón específicos, loading state, mensajes de error descriptivos, confirmación de pedido, estados vacíos |
| API simulada | `getProducts` (GET) y `createOrder` (POST) con delay 800 ms, éxito y error |
| Repositorio | Público en GitHub, README completo, estructura organizada |
