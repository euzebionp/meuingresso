// === CAROUSEL ===
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.dot');
const carousel = document.querySelector('.hero-carousel');
let autoplay;

function goToSlide(n) {
  currentSlide = (n + slides.length) % slides.length;
  carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
}
function nextSlide() { goToSlide(currentSlide + 1); }
function prevSlide() { goToSlide(currentSlide - 1); }

function startAutoplay() {
  autoplay = setInterval(nextSlide, 4000);
}
function stopAutoplay() { clearInterval(autoplay); }

document.querySelector('.hero').addEventListener('mouseenter', stopAutoplay);
document.querySelector('.hero').addEventListener('mouseleave', startAutoplay);
startAutoplay();

// === AGENDA ===
function setAgenda(btn, filter) {
  document.querySelectorAll('.agenda-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  showToast('Exibindo eventos: ' + btn.textContent);
}

// === CATEGORIES ===
function filterCat(btn) {
  document.querySelectorAll('.category-card').forEach(b => b.classList.remove('active-cat'));
  btn.classList.add('active-cat');
  showToast('Filtrando: ' + btn.querySelector('span:last-child').textContent);
}

// === FAVORITES ===
function toggleFav(e, btn) {
  e.stopPropagation();
  btn.classList.toggle('active');
  btn.textContent = btn.classList.contains('active') ? '♥' : '♡';
  showToast(btn.classList.contains('active') ? '❤️ Adicionado aos favoritos' : 'Removido dos favoritos');
}

// === CITY SELECT ===
function selectCity(city) {
  document.getElementById('cityBtn').textContent = '📍 ' + city;
  showToast('Mostrando eventos em ' + city);
}

// === MODALS ===
function showScreen(screen) {
  closeAllModals();
  if (screen === 'event') openModal('eventModal');
  else if (screen === 'checkout') openModal('checkoutModal');
  else if (screen === 'organizer') openModal('organizerModal');
  else if (screen === 'cart') { openModal('checkoutModal'); }
}

function openModal(id) {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
  document.body.style.overflow = '';
}

// === TICKET QUANTITY ===
function changeQty(e, delta, btn) {
  e.stopPropagation();
  const ctrl = btn.parentElement;
  const qtyEl = ctrl.querySelector('.qty');
  let qty = parseInt(qtyEl.textContent) + delta;
  if (qty < 0) qty = 0;
  if (qty > 10) qty = 10;
  qtyEl.textContent = qty;
  updateSubtotal();
}

function updateSubtotal() {
  let total = 0;
  document.querySelectorAll('.ticket-type:not(.disabled-ticket)').forEach(tt => {
    const ctrl = tt.querySelector('.qty-ctrl:not(.disabled)');
    if (!ctrl) return;
    const qty = parseInt(ctrl.querySelector('.qty').textContent);
    const priceStr = tt.querySelector('.t-price').textContent.replace('R$ ', '').replace(',', '.');
    const price = parseFloat(priceStr);
    total += qty * price;
  });
  const el = document.getElementById('subtotalVal');
  if (el) el.textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
}

function selectTicket(el) {
  if (el.querySelector('.disabled')) return;
  document.querySelectorAll('.ticket-type').forEach(t => t.style.borderColor = '');
  el.style.borderColor = 'var(--primary)';
}

// === CHECKOUT ===
function selectPay(btn, method) {
  document.querySelectorAll('.pay-opt').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const pixBox = document.getElementById('pixBox');
  if (pixBox) pixBox.style.display = method === 'pix' ? 'block' : 'none';
}

// === ORGANIZER SUCCESS ===
function showOrgSuccess() {
  document.querySelector('.org-form').style.display = 'none';
  document.getElementById('orgSuccess').style.display = 'block';
}

// === BOTTOM NAV ===
function setNavActive(btn) {
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

// === TOAST ===
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// === SEARCH ===
document.getElementById('searchInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    showToast('🔍 Buscando: ' + this.value);
  }
});

// === HEADER BUTTON ACTIONS ===
document.getElementById('loginBtn').addEventListener('click', () => showToast('💡 Tela de login — em breve!'));
document.getElementById('orgBtn').addEventListener('click', () => showScreen('organizer'));
document.getElementById('cartBtn').addEventListener('click', () => showScreen('cart'));
document.getElementById('cityBtn').addEventListener('click', () => {
  const cities = ['Uberlândia','Uberaba','Ituiutaba','Araguari'];
  const idx = cities.indexOf(document.getElementById('cityBtn').textContent.replace('📍 ',''));
  selectCity(cities[(idx + 1) % cities.length]);
});

// Timer countdown
let timerSecs = 598;
function updateTimer() {
  const el = document.getElementById('timerVal');
  if (!el) return;
  const m = Math.floor(timerSecs / 60).toString().padStart(2,'0');
  const s = (timerSecs % 60).toString().padStart(2,'0');
  el.textContent = m + ':' + s;
  if (timerSecs > 0) timerSecs--;
}
setInterval(updateTimer, 1000);
