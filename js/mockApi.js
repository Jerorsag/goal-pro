/**
 * mockApi.js — API simulada
 *
 * Simula las respuestas de un servidor REST con latencia de red.
 * El front consume estas funciones igual que consumiría fetch() a un endpoint real.
 *
 * Endpoints documentados:
 *   getProducts()   → GET  /api/products
 *   createOrder()   → POST /api/orders
 */

const DELAY_MS = 800;

/** Datos en memoria (simula la base de datos) */
const DB = {
  products: [
    {
      id: 1,
      name: 'Nike Mercurial Vapor 15 Elite',
      description: 'Diseñado para máxima velocidad. Suela FG con tacos conicos y placa de fibra de carbono para explosividad en cada arranque.',
      price: 650000,
      stock: 10,
      image: 'assets/images/mercurial.jpg',
      brand: 'Nike',
      terrain: ['FG', 'AG'],
    },
    {
      id: 2,
      name: 'Adidas Predator Accuracy+ FG',
      description: 'Control total del balón gracias a las zonas de agarre en el empeine. Ideal para mediocampistas técnicos.',
      price: 520000,
      stock: 7,
      image: 'assets/images/predator.jpg',
      brand: 'Adidas',
      terrain: ['FG'],
    },
    {
      id: 3,
      name: 'Puma Future 7 Pro TF',
      description: 'Cordones asimétricos y suela multitaco para pasto sintético. Flexibilidad y ajuste personalizado.',
      price: 380000,
      stock: 0,
      image: 'assets/images/puma-future.jpg',
      brand: 'Puma',
      terrain: ['TF', 'AG'],
    },
    {
      id: 4,
      name: 'New Balance Furon v7 Pro IC',
      description: 'Suela lisa para canchas cubiertas. Corte bajo y horma estrecha para máxima sensibilidad táctil.',
      price: 310000,
      stock: 4,
      image: 'assets/images/nb-furon.jpg',
      brand: 'New Balance',
      terrain: ['IC'],
    },
  ],
};

/** Probabilidad de error simulado (0–1). Cambiar a 0 para deshabilitar errores. */
const ERROR_RATE = 0.15;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const shouldFail = () => Math.random() < ERROR_RATE;

// ---------------------------------------------------------------------------
// GET /api/products
// ---------------------------------------------------------------------------

/**
 * Obtiene la lista de productos disponibles.
 *
 * @returns {Promise<{products: Array}>} Lista de productos.
 * @throws {Error} Mensaje descriptivo para mostrar en la UI.
 */
export async function getProducts() {
  await delay(DELAY_MS);

  if (shouldFail()) {
    console.error('500 Internal Server Error: GET /api/products');
    throw new Error('No pudimos cargar los productos. Intenta recargar la página.');
  }

  return { products: DB.products };
}

// ---------------------------------------------------------------------------
// POST /api/orders
// ---------------------------------------------------------------------------

/**
 * Registra un nuevo pedido.
 *
 * @param {{
 *   productId:    number,
 *   quantity:     number,
 *   shoeSize:     string,
 *   surface:      string,
 *   fullName:     string,
 *   email:        string,
 *   phone?:       string,
 *   deliveryDate: string,
 * }} orderData
 *
 * @returns {Promise<{order: {id: string, status: string, estimatedDelivery: string}}>}
 * @throws {Error} Mensaje descriptivo para mostrar en la UI.
 */
export async function createOrder(orderData) {
  await delay(DELAY_MS);

  if (shouldFail()) {
    console.error('500 Internal Server Error: POST /api/orders');
    throw new Error('No pudimos procesar tu pedido por un error del servidor. Vuelve a intentarlo en unos minutos.');
  }

  const product = DB.products.find((p) => p.id === Number(orderData.productId));

  if (!product) {
    console.error('500 Internal Server Error: POST /api/orders');
    throw new Error('El guayo seleccionado ya no está disponible. Por favor elige otro modelo.');
  }

  if (product.stock < Number(orderData.quantity)) {
    throw new Error(
      `Solo quedan ${product.stock} pares de "${product.name}". Reduce la cantidad e intenta de nuevo.`
    );
  }

  const orderId = `GP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  return {
    order: {
      id: orderId,
      product: product.name,
      shoeSize: orderData.shoeSize,
      surface: orderData.surface,
      quantity: orderData.quantity,
      total: product.price * Number(orderData.quantity),
      status: 'confirmed',
      estimatedDelivery: orderData.deliveryDate,
    },
  };
}
