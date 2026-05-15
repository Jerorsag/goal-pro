/**
 * ui.js — Funciones de manipulación del DOM
 *
 * Solo renderiza y muestra/oculta elementos. No contiene lógica de negocio.
 */

// ---------------------------------------------------------------------------
// Catálogo
// ---------------------------------------------------------------------------

/**
 * Renderiza las tarjetas de productos en el grid.
 * @param {Array} products
 */
export function renderProducts(products) {
  const grid = document.getElementById('products-grid');
  const empty = document.getElementById('catalog-empty');

  grid.innerHTML = '';

  if (products.length === 0) {
    showElement(empty);
    return;
  }

  hideElement(empty);

  products.forEach((product) => {
    const card = createProductCard(product);
    grid.appendChild(card);
  });
}

/**
 * Crea el elemento HTML de una tarjeta de producto.
 * @param {Object} product
 * @returns {HTMLElement}
 */
function createProductCard(product) {
  const inStock = product.stock > 0;
  const stockLabel = inStock
    ? product.stock <= 3
      ? `<span class="badge badge-warning">Últimas ${product.stock} unidades</span>`
      : `<span class="badge badge-success">En stock</span>`
    : `<span class="badge badge-danger">Agotado</span>`;

  const article = document.createElement('article');
  article.className = 'product-card';
  article.dataset.productId = product.id;

  const terrainLabels = { FG: 'Césped natural', AG: 'Césped artificial', TF: 'Turf', IC: 'Indoor' };
  const terrainTags = (product.terrain || [])
    .map((t) => `<span class="badge badge-success">${terrainLabels[t] ?? t}</span>`)
    .join(' ');

  article.innerHTML = `
    <img
      src="${product.image}"
      alt="Fotografía de ${product.name}"
      loading="lazy"
      onerror="this.src='assets/images/placeholder.jpg'"
    />
    <div class="product-card-body">
      <p class="product-card-brand">${product.brand}</p>
      <h3 class="product-card-title">${product.name}</h3>
      <p class="product-card-desc">${product.description}</p>
      <div class="product-card-terrain">${terrainTags}</div>
      <p class="product-card-price">${formatPrice(product.price)}</p>
      ${stockLabel}
    </div>
    <footer class="product-card-footer">
      <button
        class="btn btn-primary"
        data-action="select-product"
        data-product-id="${product.id}"
        ${inStock ? '' : 'disabled aria-disabled="true"'}
      >
        ${inStock ? 'Seleccionar y pedir' : 'Guayo agotado'}
      </button>
    </footer>
  `;

  return article;
}

// ---------------------------------------------------------------------------
// Estados del catálogo
// ---------------------------------------------------------------------------

export function showCatalogLoading() {
  showElement(document.getElementById('catalog-loading'));
  hideElement(document.getElementById('catalog-error'));
  hideElement(document.getElementById('catalog-empty'));
}

export function hideCatalogLoading() {
  hideElement(document.getElementById('catalog-loading'));
}

export function showCatalogError(message) {
  const el = document.getElementById('catalog-error');
  el.textContent = message;
  showElement(el);
}

// ---------------------------------------------------------------------------
// Formulario — estados del botón
// ---------------------------------------------------------------------------

/**
 * Pone el botón en estado "cargando": lo deshabilita y cambia el texto.
 * @param {HTMLButtonElement} btn
 * @param {string} loadingText
 */
export function setButtonLoading(btn, loadingText = 'Procesando…') {
  btn.disabled = true;
  btn.dataset.originalText = btn.textContent;
  btn.textContent = loadingText;
}

/**
 * Restaura el botón a su estado original.
 * @param {HTMLButtonElement} btn
 */
export function setButtonReady(btn) {
  btn.disabled = false;
  btn.textContent = btn.dataset.originalText ?? btn.textContent;
}

// ---------------------------------------------------------------------------
// Mensajes del formulario
// ---------------------------------------------------------------------------

export function showOrderSuccess(order) {
  hideElement(document.getElementById('order-error'));
  showSuccessModal(order);
}

const SURFACE_LABELS = { FG: 'Césped natural (FG)', AG: 'Césped artificial (AG)', TF: 'Turf / Sintético (TF)', IC: 'Indoor / Cubierta (IC)' };

export function showSuccessModal(order) {
  const modal = document.getElementById('success-modal');
  const closeBtn = document.getElementById('success-modal-close');

  document.getElementById('success-order-id').textContent = order.id;
  document.getElementById('success-order-product').textContent = order.product;
  document.getElementById('success-order-size').textContent = `Talla ${order.shoeSize}`;
  document.getElementById('success-order-surface').textContent = SURFACE_LABELS[order.surface] ?? order.surface;
  document.getElementById('success-order-quantity').textContent = `${order.quantity} par${Number(order.quantity) > 1 ? 'es' : ''}`;
  document.getElementById('success-order-total').textContent = formatPrice(order.total);

  const deliveryDate = new Date(order.estimatedDelivery + 'T12:00:00');
  document.getElementById('success-order-delivery').textContent = deliveryDate.toLocaleDateString('es-CO', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  modal.showModal();

  const onClose = () => {
    modal.close();
    closeBtn.removeEventListener('click', onClose);
    document.getElementById('comprar').scrollIntoView({ behavior: 'smooth' });
  };
  closeBtn.addEventListener('click', onClose);
}

export function showOrderError(message) {
  const el = document.getElementById('order-error');
  el.textContent = message;
  showElement(el);
  hideElement(document.getElementById('order-success'));
}

export function clearOrderMessages() {
  hideElement(document.getElementById('order-success'));
  hideElement(document.getElementById('order-error'));
}

// ---------------------------------------------------------------------------
// Errores de campo individual
// ---------------------------------------------------------------------------

/**
 * Muestra el error de validación de un campo específico.
 * @param {string} fieldId
 * @param {string} message
 */
export function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorEl = document.getElementById(`${fieldId}-error`);
  if (field) field.classList.add('is-invalid');
  if (errorEl) errorEl.textContent = message;
}

/** Limpia todos los errores de campo del formulario. */
export function clearFieldErrors() {
  document.querySelectorAll('.is-invalid').forEach((el) => el.classList.remove('is-invalid'));
  document.querySelectorAll('.field-error').forEach((el) => (el.textContent = ''));
}

// ---------------------------------------------------------------------------
// Modal de confirmación
// ---------------------------------------------------------------------------

/**
 * Muestra el modal de confirmación y devuelve una promesa que resuelve
 * true (confirmó) o false (canceló).
 *
 * @param {string} message  Texto descriptivo de la acción a confirmar.
 * @returns {Promise<boolean>}
 */
export function showConfirmModal(message, product = null, quantity = 1) {
  const modal = document.getElementById('confirm-modal');
  const desc = document.getElementById('modal-desc');
  const btnConfirm = document.getElementById('modal-confirm');
  const btnCancel = document.getElementById('modal-cancel');
  const productDetail = document.getElementById('modal-product-detail');

  desc.textContent = message;

  if (product) {
    document.getElementById('modal-product-img').src = product.image;
    document.getElementById('modal-product-img').alt = product.name;
    document.getElementById('modal-product-name').textContent = product.name;
    document.getElementById('modal-product-brand').textContent = product.brand;
    document.getElementById('modal-product-price').textContent = formatPrice(product.price);
    document.getElementById('modal-product-total').textContent = formatPrice(product.price * Number(quantity));
    document.getElementById('modal-product-terrain').textContent = product.terrain.join(', ');
    productDetail.removeAttribute('hidden');
  } else {
    productDetail.setAttribute('hidden', '');
  }

  modal.showModal();

  return new Promise((resolve) => {
    const onConfirm = () => { cleanup(); resolve(true); };
    const onCancel  = () => { cleanup(); resolve(false); };

    function cleanup() {
      modal.close();
      btnConfirm.removeEventListener('click', onConfirm);
      btnCancel.removeEventListener('click', onCancel);
    }

    btnConfirm.addEventListener('click', onConfirm);
    btnCancel.addEventListener('click', onCancel);
  });
}

// ---------------------------------------------------------------------------
// Select de productos en el formulario
// ---------------------------------------------------------------------------

/**
 * Popula el <select> de productos con los datos cargados.
 * @param {Array} products
 */
export function populateProductSelect(products) {
  const select = document.getElementById('product-select');
  const availableProducts = products.filter((p) => p.stock > 0);

  if (availableProducts.length === 0) {
    const opt = document.createElement('option');
    opt.value = '';
    opt.textContent = '-- No hay productos disponibles --';
    opt.disabled = true;
    select.appendChild(opt);
    return;
  }

  availableProducts.forEach((p) => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = `${p.name} — ${formatPrice(p.price)}`;
    select.appendChild(opt);
  });
}

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------

/** Formatea un número como precio en pesos colombianos. */
export function formatPrice(amount) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(amount);
}

function showElement(el) {
  if (el) el.removeAttribute('hidden');
}

function hideElement(el) {
  if (el) el.setAttribute('hidden', '');
}
