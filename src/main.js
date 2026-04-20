import './style.css';
import { supabase } from './lib/supabase.js';

// Mock Data para contingencia cuando no hay conexión a BD
const MOCK_DATA = {
  dashboard: {
    inflacionMensual: "+0.8%",
    variacionCanasta: "+$12.50",
    oportunidadInversion: "Certificados a Plazo (Hasta 7.5%)"
  },
  canasta: [
    { id: 1, name: "Frijol Rojo Seda (1 lb)", price: 1.25, oldPrice: 1.10, store: "Súper Selectos", trend: "up" },
    { id: 2, name: "Cartón de Huevos (30 uds)", price: 4.50, oldPrice: 4.65, store: "La Despensa", trend: "down" },
    { id: 3, name: "Arroz Blanco (1 lb)", price: 0.60, oldPrice: 0.55, store: "Walmart", trend: "up" }
  ],
  inversiones: [
    { id: 1, title: "Depósito a Plazo Fijo", rate: "6.5% - 7.5% APY", description: "Bancos e instituciones locales.", category: "bank" },
    { id: 2, title: "S&P 500 ETF (VOO)", rate: "~10% Histórico", description: "Empresas top de USA.", category: "market" }
  ]
};

const appContent = document.getElementById('app-content');
const authBtn = document.getElementById('auth-btn');

// --- Lógica de Supabase Auth Simulada / Inicial ---
async function handleAuth() {
  if (!supabase) {
    alert("Para iniciar sesión, primero debes configurar tus credenciales de Supabase en el archivo .env");
    return;
  }
  
  // Aquí podemos llamar a un modal real, hoy lo haremos simplificado
  const email = prompt("Ingresa tu email para entrar (Ej. admin@pricepulse.com):");
  if (email) {
    authBtn.textContent = "Sesión Activa: " + email.split('@')[0];
    authBtn.style.backgroundColor = "var(--success-color)";
    authBtn.style.color = "white";
    alert(`Teóricamente iniciando SignIn Auth de Supabase para: ${email}`);
  }
}

authBtn.addEventListener('click', handleAuth);

// --- Funciones de Fetch con Fallback a Mock Data ---
async function fetchCanastaData() {
  if (!supabase) return MOCK_DATA.canasta;
  // Intento real en la nube
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Error al obtener nube, usando mock:", err);
    return MOCK_DATA.canasta;
  }
}

async function fetchInversionData() {
  if (!supabase) return MOCK_DATA.inversiones;
  try {
    const { data, error } = await supabase.from('investment_assets').select('*');
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Error al obtener nube, usando mock:", err);
    return MOCK_DATA.inversiones;
  }
}

// --- Vistas ---
function renderDashboard() {
  appContent.innerHTML = `
    <div class="section-header">
      <h2>Panorama Actual</h2>
      <p>Métricas clave de inflación en El Salvador hoy.</p>
    </div>
    <div class="dashboard-grid">
      <div class="card">
        <h3 class="card-title">Inflación Mensual</h3>
        <p class="card-value up">${MOCK_DATA.dashboard.inflacionMensual}</p>
        <span class="trend up">↑ Últimos 30 días</span>
      </div>
      <div class="card" style="grid-column: span 1; background: linear-gradient(135deg, var(--accent-color), var(--accent-hover)); color: white; border: none;">
        <h3 class="card-title" style="color: rgba(255,255,255,0.9);">Mejor Opción Anti-Inflación</h3>
        <p class="card-value" style="font-size: 1.5rem; color: white;">${MOCK_DATA.dashboard.oportunidadInversion}</p>
        <span class="trend down" style="color: #d1fae5;">Protege tu poder adquisitivo</span>
      </div>
    </div>
    <div class="card">
      <h3 style="margin-bottom: 1rem;">Estado del Sistema</h3>
      <p style="color: var(--secondary-text);">
        Estado Backend (Supabase): <strong>${supabase ? '<span style="color: var(--success-color)">CONECTADO</span>' : '<span style="color: var(--warning-color)">MODO LOCAL MOCK (No .env)</span>'}</strong>
      </p>
    </div>
  `;
}

async function renderCanasta() {
  appContent.innerHTML = `<p>Cargando datos desde la nube...</p>`;
  const items = await fetchCanastaData();
  
  const itemsHtml = items.map(item => `
    <div class="data-item">
      <div class="item-info">
        <h3>${item.name}</h3>
        <p>Referencia del producto</p>
      </div>
      <div class="item-price">
        <p class="price">$${item.price ? item.price : '--'}</p>
      </div>
    </div>
  `).join('');

  appContent.innerHTML = `
    <div class="section-header">
      <h2>Canasta Básica V2</h2>
      <p>Consultando base de precios ${supabase ? 'desde POSTGRES (Nube)' : 'desde archivo local'}.</p>
    </div>
    <div class="data-list">${itemsHtml}</div>
  `;
}

async function renderInversion() {
  appContent.innerHTML = `<p>Cargando datos desde la nube...</p>`;
  const items = await fetchInversionData();

  const itemsHtml = items.map(item => `
    <div class="card" style="margin-bottom: 1rem;">
      <h3>${item.title}</h3>
      <p style="color: var(--secondary-text); font-size: 0.875rem;">${item.description}</p>
    </div>
  `).join('');

  appContent.innerHTML = `
    <div class="section-header">
      <h2>Hub de Inversión</h2>
      <p>Activos generadores de riqueza de la base de datos.</p>
    </div>
    <div style="max-width: 800px;">${itemsHtml}</div>
  `;
}

// Router Simple
function navigateTo(view) {
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.querySelector(`.nav-btn[data-view="${view}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  appContent.style.opacity = 0;
  
  setTimeout(() => {
    if (view === 'dashboard') renderDashboard();
    if (view === 'canasta') renderCanasta();
    if (view === 'inversion') renderInversion();
    appContent.style.transition = 'opacity 0.2s ease-in';
    appContent.style.opacity = 1;
  }, 150);
}

document.querySelector('.main-nav').addEventListener('click', (e) => {
  if (e.target.classList.contains('nav-btn')) {
    navigateTo(e.target.dataset.view);
  }
});

// Inicializar
appContent.style.opacity = 1;
renderDashboard();
