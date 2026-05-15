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
      description: 'Máxima velocidad con placa de fibra de carbono y tacos cónicos FG. El favorito de los delanteros explosivos.',
      price: 650000,
      stock: 10,
      image: 'https://images.unsplash.com/photo-1633306603064-582250e68a1a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bmlrZSUyMG1lcmN1cmlhbCUyMHZhcG9yfGVufDB8fDB8fHwy',
      brand: 'Nike',
      terrain: ['FG', 'AG'],
    },
    {
      id: 2,
      name: 'Adidas Predator Accuracy+ FG',
      description: 'Zonas de agarre en el empeine para control y potencia de disparo. Ideal para mediocampistas técnicos.',
      price: 520000,
      stock: 7,
      image: 'https://images.unsplash.com/photo-1612387049695-637b743f80ad?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YWRpZGFzJTIwcHJlZGF0b3J8ZW58MHx8MHx8fDI%3D',
      brand: 'Adidas',
      terrain: ['FG'],
    },
    {
      id: 3,
      name: 'Puma Future 7 Pro TF',
      description: 'Cordones asimétricos FUZIONFIT+ para un ajuste personalizado. Multitaco para pasto sintético.',
      price: 380000,
      stock: 0,
      image: 'https://images.unsplash.com/photo-1612387605285-7ee92eae6958?q=80&w=787&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      brand: 'Puma',
      terrain: ['TF', 'AG'],
    },
    {
      id: 4,
      name: 'New Balance Furon v7 Pro IC',
      description: 'Suela lisa de goma para máximo agarre en canchas cubiertas. Corte bajo y horma estrecha.',
      price: 310000,
      stock: 4,
      image: 'https://images.unsplash.com/photo-1511167814253-23b850fcd859?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      brand: 'New Balance',
      terrain: ['IC'],
    },
    {
      id: 5,
      name: 'Adidas Copa Pure 2 Elite FG',
      description: 'Cuero K-Leather de primera calidad para un tacto suave e incomparable. El clásico reinventado para césped natural.',
      price: 480000,
      stock: 6,
      image: 'https://images.unsplash.com/photo-1684355412644-10428a9d7b86?q=80&w=758&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      brand: 'Adidas',
      terrain: ['FG'],
    },
    {
      id: 6,
      name: 'Nike Tiempo Legend 10 Elite FG',
      description: 'Cuero ACC que mantiene el agarre en seco y húmedo. Horma amplia y amortiguación superior para partidos largos.',
      price: 530000,
      stock: 8,
      image: 'https://images.unsplash.com/photo-1674023797493-e332aa4c6f4b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8bmlrZSUyMG1lcmN1cmlhbCUyMHZhcG9yfGVufDB8fDB8fHwy',
      brand: 'Nike',
      terrain: ['FG', 'AG'],
    },
    {
      id: 7,
      name: 'Mizuno Morelia Neo IV Japan FG',
      description: 'Piel de canguro ultrafina hecha a mano en Japón. El guayo preferido de jugadores de alto rendimiento técnico.',
      price: 720000,
      stock: 3,
      image: 'https://cdnx.jumpseller.com/portel1te/image/26122401/c17290a8ed1cb05ad9a279eeb41245ec.jpg?1659924719',
      brand: 'Mizuno',
      terrain: ['FG'],
    },
    {
      id: 8,
      name: 'Puma King Platinum 21 IC',
      description: 'Diseño clásico con cuero suave y suela plana de goma. Perfecto para fútbol sala y canchas cubiertas.',
      price: 290000,
      stock: 5,
      image: 'https://images.unsplash.com/photo-1612387048732-1840c48c0976?q=80&w=1189&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      brand: 'Puma',
      terrain: ['IC'],
    },
    {
      id: 9,
      name: 'Under Armour Magnetico Pro 3 TF',
      description: 'Suela de tacos pequeños para turf y sintético. Entresuela UA FORM moldeada al pie para comodidad extrema.',
      price: 340000,
      stock: 0,
      image: 'https://underarmourcol.vtexassets.com/arquivos/ids/556956/3027038_001_N11_1.png?v=638402435496400000',
      brand: 'Under Armour',
      terrain: ['TF', 'AG'],
    },
    {
      id: 10,
      name: 'Nike Phantom GX II Elite FG',
      description: 'Costura GripKnit en la zona de contacto para precisión de pase y disparo. El guayo de los mediocampistas creativos.',
      price: 610000,
      stock: 9,
      image: 'https://images.unsplash.com/photo-1597274791287-72d00bf0dc80?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bmlrZSUyMHBoYW50b218ZW58MHx8MHx8fDI%3D',
      brand: 'Nike',
      terrain: ['FG', 'AG'],
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
 * Obtiene la lista completa de productos.
 *
 * @returns {Promise<{products: Array}>}
 * @throws {Error} Mensaje para mostrar en la UI.
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
 * @returns {Promise<{order: object}>}
 * @throws {Error} Mensaje para mostrar en la UI.
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
