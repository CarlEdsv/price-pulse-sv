import './style.css'

const appContent = document.getElementById('app-content')

const productsData = {
  canasta: [
    { id: 1, name: 'Frijol Rojo de Seda (Libra)', min: 0.90, avg: 1.15, max: 1.35, quality: 4.5 },
    { id: 2, name: 'Cartón de Huevos (30 u)', min: 3.50, avg: 4.25, max: 5.00, quality: 4.2 },
    { id: 3, name: 'Harina de Maíz (Maseca)', min: 0.50, avg: 0.60, max: 0.75, quality: 4.8 },
  ],
  servicios: [
    { id: 4, name: 'Gasolina Regular (Galón)', min: 3.80, avg: 3.95, max: 4.10, quality: null },
    { id: 5, name: 'Internet Residencial 50MB', min: 25.00, avg: 30.00, max: 40.00, quality: 3.9 },
  ],
  insumos: [
    { id: 6, name: 'Detergente en Polvo (1kg)', min: 1.50, avg: 1.80, max: 2.20, quality: 4.1 },
  ]
};

const providersData = [
  { name: 'Super Selectos', price: '$1.25', rating: 4.5, distance: '1.2 km' },
  { name: 'Mercado Central', price: '$0.90', rating: 4.0, distance: '3.5 km' },
  { name: 'Tienda La Esquina', price: '$1.35', rating: 3.8, distance: '0.1 km' }
];

function initApp() {
  const navBtns = document.querySelectorAll('.nav-btn');
  navBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      navBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const view = e.target.dataset.view;
      routeTo(view);
    });
  });
  routeTo('dashboard');
}

function routeTo(view) {
  appContent.innerHTML = ''; // Clear current
  switch(view) {
    case 'dashboard':
      appContent.innerHTML = renderDashboard();
      break;
    case 'canasta':
      appContent.innerHTML = renderCategoryView('Canasta Básica', productsData.canasta);
      break;
    case 'inversion':
      appContent.innerHTML = renderInversionHub();
      break;
    case 'b2b':
      appContent.innerHTML = renderB2BHub();
      break;
    case 'support':
      appContent.innerHTML = renderSupportHub();
      break;
    default:
      appContent.innerHTML = `<h2>Vista no encontrada</h2>`;
  }
  attachDynamicListeners();
}

function renderDashboard() {
  return `
    <div class="animate-fade-in">
      <div class="flex-between" style="margin-bottom: 2rem;">
        <h2>Bienvenido de nuevo, Carlos.</h2>
        <button class="btn btn-premium" onclick="alert('Abriendo funciones premium...')">💎 Pásate a Premium</button>
      </div>

      <div class="dashboard-grid">
        <div class="card market-card">
          <h3><span class="icon">🛒</span> Canasta Básica</h3>
          <p class="text-sm" style="margin-bottom: 1rem;">Alimentos y víveres esenciales</p>
          <ul class="market-list">
            ${productsData.canasta.map(p => `
              <li class="product-item" data-id="${p.id}" data-cat="canasta">
                <span>${p.name}</span>
                <span class="text-success">$${p.avg.toFixed(2)}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="card market-card">
          <h3><span class="icon">⚡</span> Servicios</h3>
          <p class="text-sm" style="margin-bottom: 1rem;">Luz, agua, gas, gasolina, internet</p>
          <ul class="market-list">
            ${productsData.servicios.map(p => `
              <li class="product-item" data-id="${p.id}" data-cat="servicios">
                <span>${p.name}</span>
                <span class="text-success">$${p.avg.toFixed(2)}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="card market-card">
          <h3><span class="icon">🧼</span> Insumos y Otros</h3>
          <p class="text-sm" style="margin-bottom: 1rem;">Limpieza, hogar, herramientas</p>
          <ul class="market-list">
            ${productsData.insumos.map(p => `
              <li class="product-item" data-id="${p.id}" data-cat="insumos">
                <span>${p.name}</span>
                <span class="text-success">$${p.avg.toFixed(2)}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>

      <!-- Crowdsourcing Widget -->
      <div class="card" style="margin-top: 2rem; border-color: rgba(16, 185, 129, 0.4);">
        <div class="flex-between">
          <div>
            <h3>📷 Escanea tu factura y gana</h3>
            <p class="text-sm">Ayuda a la comunidad reportando precios y obtén insignias o Premium gratis.</p>
          </div>
          <button class="btn btn-primary" onclick="alert('Abriendo cámara...')">Escanear Ticket</button>
        </div>
      </div>
    </div>
  `;
}

function renderCategoryView(title, products) {
  return `
    <div class="animate-fade-in">
      <h2 style="margin-bottom: 2rem;">${title}</h2>
      <div class="dashboard-grid">
        ${products.map(p => `
          <div class="card" style="cursor: pointer;" class="product-item" data-id="${p.id}" data-cat="canasta">
            <h3 style="margin-bottom: 0.5rem;">${p.name}</h3>
            <div class="flex-between">
              <span class="text-sm">Precio Promedio:</span>
              <strong class="text-success">$${p.avg.toFixed(2)}</strong>
            </div>
            <button class="btn btn-primary product-item" data-id="${p.id}" data-cat="canasta" style="width: 100%; margin-top: 1rem;">Ver Detalle</button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderProductDetail(product) {
  return `
    <div class="animate-fade-in">
      <button class="btn" style="background: rgba(255,255,255,0.1); margin-bottom: 1rem;" id="back-btn">← Volver</button>
      
      <div style="display: flex; gap: 2rem; flex-wrap: wrap;">
        <!-- Detalles lado izquierdo -->
        <div style="flex: 1; min-width: 300px;">
          <h2 style="margin-bottom: 0.5rem;">${product.name}</h2>
          <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem;">
            <span class="badge success">Calidad: ${product.quality || 'N/A'} ⭐</span>
            <span class="badge">Suficiente disponibilidad</span>
          </div>

          <div class="card" style="margin-bottom: 1.5rem;">
            <h3 style="margin-bottom: 1rem; font-size: 1.1rem;">Resumen de Precios (Nacional)</h3>
            <div style="display: flex; justify-content: space-between; text-align: center;">
              <div>
                <div class="text-sm">Mínimo</div>
                <div class="text-success" style="font-size: 1.25rem; font-weight: 700;">$${product.min.toFixed(2)}</div>
              </div>
              <div>
                <div class="text-sm">Promedio</div>
                <div style="font-size: 1.25rem; font-weight: 700;">$${product.avg.toFixed(2)}</div>
              </div>
              <div>
                <div class="text-sm">Máximo</div>
                <div class="text-danger" style="font-size: 1.25rem; font-weight: 700;">$${product.max.toFixed(2)}</div>
              </div>
            </div>
          </div>

          <h3>Proveedores Cercanos</h3>
          <ul class="market-list" style="margin-top: 1rem;">
            ${providersData.map(prov => `
              <li style="flex-direction: column; gap: 0.5rem;">
                <div class="flex-between">
                  <strong>${prov.name}</strong>
                  <span class="text-success font-bold">${prov.price}</span>
                </div>
                <div class="flex-between text-sm">
                  <span>⭐ ${prov.rating} / 5</span>
                  <span>📍 a ${prov.distance}</span>
                </div>
              </li>
            `).join('')}
          </ul>
        </div>

        <!-- Mapa y herramientas Premium lado derecho -->
        <div style="flex: 1; min-width: 300px;">
          <div class="map-container" style="margin-bottom: 1rem;">
            <div class="pin" style="top: 40%; left: 30%;"></div>
            <div class="pin" style="top: 60%; left: 50%; background: var(--success);"></div>
            <div class="pin" style="top: 20%; left: 70%;"></div>
            <div class="map-overlay">
               <button class="btn btn-primary" onclick="alert('Abriendo vista de mapa interactivo...')">Ampliar Mapa</button>
            </div>
          </div>

          <div class="card" style="border-color: var(--accent-premium);">
            <h3 class="text-premium" style="margin-bottom: 0.5rem;">💎 Predicción de IA</h3>
            <p class="text-sm" style="margin-bottom: 1rem;">Basado en historial, se espera que el precio suba 5% la próxima semana. Sugerimos comprar hoy.</p>
            <div style="padding: 1rem; background: rgba(0,0,0,0.2); border-radius: var(--radius-sm);">
              <div class="flex-between" style="margin-bottom: 0.5rem;">
                <span class="text-sm">Gasto Transporte:</span>
                <span>$0.35 (Bus)</span>
              </div>
              <div class="flex-between">
                <span class="text-sm">Tiempo aprox:</span>
                <span>15 mins</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderInversionHub() {
  return `
    <div class="animate-fade-in">
      <h2 style="margin-bottom: 0.5rem;">Hub de Inversión 📊</h2>
      <p class="text-sm" style="margin-bottom: 2rem;">Alternativas para proteger y crecer tu dinero desde El Salvador</p>

      <div class="dashboard-grid">
        <div class="card">
          <h3>🇸🇻 Opciones Nacionales</h3>
          <ul class="market-list" style="margin-top: 1rem;">
            <li><span>Certificados a Plazo (Bancos)</span> <span class="text-success">5 - 7%</span></li>
            <li><span>Aportaciones (Cooperativas)</span> <span class="text-success">8 - 10%</span></li>
            <li><span>Bolsa de Valores SV</span> <span class="text-success">Variable</span></li>
          </ul>
        </div>

        <div class="card">
          <h3>🌎 Mercados Internacionales</h3>
          <p class="text-sm" style="margin-bottom: 1rem;">Invierte en la bolsa americana con nuestros brokers verificados.</p>
          <div style="display: flex; gap: 1rem; flex-direction: column;">
            <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px;">
              <h4 style="margin-bottom: 0.5rem; color: #10b981;">Hapi</h4>
              <p class="text-sm" style="margin-bottom: 0.5rem;">Compra fracciones de acciones sin comisiones.</p>
              <button class="btn" style="background: #10b981; color: white;">Crear Cuenta</button>
            </div>
            <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px;">
              <h4 style="margin-bottom: 0.5rem; color: #ef4444;">XTB</h4>
              <p class="text-sm" style="margin-bottom: 0.5rem;">Trading de materias primas y energía.</p>
              <button class="btn" style="background: #ef4444; color: white;">Explorar XTB</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderB2BHub() {
  return `
    <div class="animate-fade-in">
      <h2 style="margin-bottom: 0.5rem;">Panel para Empresas (DaaS) 🏢</h2>
      <p class="text-sm" style="margin-bottom: 2rem;">Inteligencia de mercado y posicionamiento de marca.</p>

      <div class="dashboard-grid">
        <div class="card" style="border-color: rgba(59,130,246,0.5);">
          <h3>Analítica de Mercado</h3>
          <p class="text-sm" style="margin-bottom: 1rem;">Descubre en qué precio están vendiendo tus competidores.</p>
          <div style="height: 150px; background: rgba(0,0,0,0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
             <span class="text-sm">[Gráfico de Barras Bloqueado - Suscríbete]</span>
          </div>
          <button class="btn btn-primary" style="width:100%;">Adquirir Acceso Total</button>
        </div>

        <div class="card">
          <h3>Gestión de Promociones</h3>
          <p class="text-sm" style="margin-bottom: 1rem;">Crea cupones u ofertas exclusivas para atraer clientes en la app.</p>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <input type="text" placeholder="Código Promocional" style="padding: 0.5rem; border-radius: 4px; border: none;" />
            <input type="number" placeholder="% Descuento" style="padding: 0.5rem; border-radius: 4px; border: none;" />
            <button class="btn" style="background: var(--success); color: white;">Lanzar Promoción</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderSupportHub() {
  return `
    <div class="animate-fade-in">
      <h2 style="margin-bottom: 0.5rem;">Soporte y Comunidad 🤝</h2>
      <p class="text-sm" style="margin-bottom: 2rem;">Centro de ayuda al cliente.</p>

      <div class="dashboard-grid">
        <div class="card">
          <h3>Atención Continua</h3>
          <p class="text-sm" style="margin-bottom: 1rem;">¿Tienes problemas subiendo un ticket o el uso de una función Premium?</p>
          <button class="btn" style="background: rgba(255,255,255,0.1); width: 100%; margin-bottom: 0.5rem;">Abrir Chat en Vivo</button>
          <button class="btn" style="background: rgba(255,255,255,0.1); width: 100%;">Enviar un Correo</button>
        </div>

        <div class="card">
          <h3>Encuesta de Mejora</h3>
          <p class="text-sm" style="margin-bottom: 1rem;">Ayúdanos a priorizar qué sección debemos agregar o mejorar.</p>
          <button class="btn btn-primary" style="width: 100%;">Responder Encuesta (1 min)</button>
        </div>
      </div>
    </div>
  `;
}

function attachDynamicListeners() {
  document.querySelectorAll('.product-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const btn = e.target.closest('.product-item');
      if(btn) {
        const id = parseInt(btn.dataset.id);
        const cat = btn.dataset.cat;
        const product = productsData[cat].find(p => p.id === id);
        if(product) {
          appContent.innerHTML = renderProductDetail(product);
          document.getElementById('back-btn').addEventListener('click', () => {
             // Basic back logic
             document.querySelector('.nav-btn.active').click(); 
          });
        }
      }
    });
  });
}

initApp();
