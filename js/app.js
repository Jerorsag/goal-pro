/**
 * app.js — Punto de entrada de la aplicación
 *
 * Orquesta la carga de datos, los listeners del DOM y el flujo de la UI.
 */

import { getProducts, createOrder } from './mockApi.js';
import {
  renderProducts,
  showCatalogLoading,
  hideCatalogLoading,
  showCatalogError,
  populateProductSelect,
  setButtonLoading,
  setButtonReady,
  showOrderSuccess,
  showOrderError,
  clearOrderMessages,
  showFieldError,
  clearFieldErrors,
  showConfirmModal,
} from './ui.js';

// ---------------------------------------------------------------------------
// Inicialización
// ---------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  loadProducts();
  initOrderForm();
});

// ---------------------------------------------------------------------------
// Navegación móvil (hamburguesa)
// ---------------------------------------------------------------------------

function initNav() {
  const btn = document.querySelector('.btn-hamburger');
  const navList = document.querySelector('.nav-list');

  btn.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('is-open');
    btn.classList.toggle('is-open', isOpen);
    btn.setAttribute('aria-expanded', isOpen);
    btn.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  });

  navList.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navList.classList.remove('is-open');
      btn.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Abrir menú');
    });
  });
}

// ---------------------------------------------------------------------------
// Carga de productos (GET /api/products)
// ---------------------------------------------------------------------------

let productsCache = [];

async function loadProducts() {
  showCatalogLoading();

  try {
    const { products } = await getProducts();
    productsCache = products;
    renderProducts(products);
    populateProductSelect(products);
    initProductSelectButtons();
  } catch (err) {
    showCatalogError(err.message);
  } finally {
    hideCatalogLoading();
  }
}

/**
 * Delega el click en los botones "Seleccionar y pedir" de las tarjetas.
 * Desplaza la vista al formulario y preselecciona el producto.
 */
function initProductSelectButtons() {
  const grid = document.getElementById('products-grid');

  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action="select-product"]');
    if (!btn) return;

    const productId = btn.dataset.productId;
    const select = document.getElementById('product-select');

    if (select) {
      select.value = productId;
    }

    document.getElementById('comprar').scrollIntoView({ behavior: 'smooth' });
  });
}

// ---------------------------------------------------------------------------
// Formulario de pedido (POST /api/orders)
// ---------------------------------------------------------------------------

function initOrderForm() {
  const form = document.getElementById('order-form');
  form.addEventListener('submit', handleOrderSubmit);

  // Fecha mínima de entrega (mañana)
  const deliveryInput = document.getElementById('delivery-date');
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  deliveryInput.min = tomorrow.toISOString().split('T')[0];

  // Botones +/− de cantidad
  const qtyInput = document.getElementById('quantity');
  document.getElementById('qty-minus').addEventListener('click', () => {
    const val = Number(qtyInput.value);
    if (val > 1) qtyInput.value = val - 1;
    document.getElementById('qty-minus').disabled = Number(qtyInput.value) <= 1;
    document.getElementById('qty-plus').disabled  = Number(qtyInput.value) >= 5;
  });
  document.getElementById('qty-plus').addEventListener('click', () => {
    const val = Number(qtyInput.value);
    if (val < 5) qtyInput.value = val + 1;
    document.getElementById('qty-minus').disabled = Number(qtyInput.value) <= 1;
    document.getElementById('qty-plus').disabled  = Number(qtyInput.value) >= 5;
  });
  document.getElementById('qty-minus').disabled = true;
}

async function handleOrderSubmit(e) {
  e.preventDefault();

  clearFieldErrors();
  clearOrderMessages();

  const form = e.currentTarget;
  const btn = document.getElementById('submit-order');

  const data = {
    fullName:     form.fullName.value.trim(),
    email:        form.email.value.trim(),
    phone:        form.phone.value.trim(),
    productId:    form.productId.value,
    shoeSize:     form.shoeSize.value,
    surface:      form.surface.value,
    quantity:     form.quantity.value,
    deliveryDate: form.deliveryDate.value,
  };

  if (!validateOrderForm(data)) return;

  // Confirmación antes de enviar (acción con consecuencias)
  const confirmed = await showConfirmModal(
    `¿Confirmas el pedido de ${data.quantity} par(es) en talla ${data.shoeSize} para terreno ${data.surface}?`
  );
  if (!confirmed) return;

  setButtonLoading(btn, 'Registrando pedido…');

  try {
    const { order } = await createOrder(data);
    showOrderSuccess(order);
    form.reset();
  } catch (err) {
    showOrderError(err.message);
  } finally {
    setButtonReady(btn);
  }
}

// ---------------------------------------------------------------------------
// Validación del formulario
// ---------------------------------------------------------------------------

/**
 * Valida los datos del formulario y muestra errores por campo.
 * @param {Object} data
 * @returns {boolean} true si es válido.
 */
function validateOrderForm(data) {
  let valid = true;

  if (!data.fullName) {
    showFieldError('full-name', 'El nombre completo es obligatorio.');
    valid = false;
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    showFieldError('email', 'Ingresa un correo electrónico válido (ej: usuario@dominio.com).');
    valid = false;
  }

  if (!data.productId) {
    showFieldError('product-select', 'Debes seleccionar un guayo antes de continuar.');
    valid = false;
  }

  if (!data.shoeSize) {
    showFieldError('shoe-size', 'Debes seleccionar una talla para continuar.');
    valid = false;
  }

  if (!data.surface) {
    showFieldError('surface', 'Selecciona el tipo de terreno donde usarás los guayos.');
    valid = false;
  }

  const qty = Number(data.quantity);
  if (!data.quantity || qty < 1 || qty > 5 || !Number.isInteger(qty)) {
    showFieldError('quantity', 'La cantidad debe ser un número entero entre 1 y 5 pares.');
    valid = false;
  }

  if (!data.deliveryDate) {
    showFieldError('delivery-date', 'Selecciona una fecha de entrega preferida.');
    valid = false;
  }

  return valid;
}
