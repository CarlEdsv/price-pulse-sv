import dotenv from 'dotenv';
import puppeteer from 'puppeteer';
import { createClient } from '@supabase/supabase-js';

// Cargar variables de entorno (cuando se ejecuta desde node CLI)
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

// Cliente de BD
const supabase = (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http'))
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Matriz de Productos Target (Configurados para Súper Selectos)
 * Encontramos exitosamente la regla CSS secreta del sitio: la clase '.precio'
 */
const TARGETS = [
  {
    product_id: 1,
    name: "Frijol Rojo Seda Nature's Heart (1 lb)", // Ejemplo
    store: "Súper Selectos",
    url: "https://www.superselectos.com/Busqueda/frijol",
    selectorCSS: ".precio"
  },
  {
    product_id: 2,
    name: "Huevos El Granjero (30 uds)", // Ejemplo de búsqueda
    store: "Súper Selectos",
    url: "https://www.superselectos.com/Busqueda/huevos",
    selectorCSS: ".precio"
  },
  {
    product_id: 3,
    name: "leche", // Ejemplo de búsqueda
    store: "Súper Selectos",
    url: "https://www.superselectos.com/Busqueda/leche",
    selectorCSS: ".precio"
  }
];

async function runScraper() {
  console.log("==================================================");
  console.log("🕵️‍♂️ Iniciando PricePulse Scraper (Súper Selectos)...");
  console.log("==================================================");

  if (!supabase) {
    console.warn("⚠️ BASE DE DATOS NO CONECTADA: Configura tu .env para poder guardar los precios guardados a la nube.");
  }

  // Inicializar Navegador
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Agregar un User-Agent humano para burlar firewalls
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36');

  for (const item of TARGETS) {
    console.log(`\n📡 Conectando con: ${item.store} buscando "${item.name}"...`);

    try {
      // 1. Navegación Total
      await page.goto(item.url, { waitUntil: 'networkidle0', timeout: 30000 });

      // Selectos usa Blazor, agregamos una tolerancia perezosa
      await new Promise(r => setTimeout(r, 2000));

      console.log(`-> Escaneando el árbol HTML buscando el selector CSS [ ${item.selectorCSS} ]...`);

      // 2. Extraer el primer precio que concuerde (usualmente el resultado #1 de la búsqueda)
      const priceText = await page.evaluate((selector) => {
        const el = document.querySelector(selector);
        return el ? el.innerText : null;
      }, item.selectorCSS);

      if (!priceText) {
        console.warn(`⚠️ No se pudo encontrar el precio de este producto en pantalla. Quizás se agotó o el selector cambió.`);
        continue;
      }

      console.log(`✔️ Elemento extraído en bruto: "${priceText}"`);

      // 3. Limpieza de datos robusta (Quitar $, letras y espacios para hacerlo un Float matemático)
      const cleanPrice = parseFloat(priceText.replace(/[^0-9.]/g, ''));
      console.log(`-> 💰 Precio Limpio Convertido: $${cleanPrice} USD`);

      // 4. Inserción a Nube (Si supabase está listo)
      if (supabase) {
        console.log("-> 📥 Archivo enviándose a la nube de Supabase (Price History)...");
        const { error } = await supabase
          .from('price_history')
          .insert([
            { product_id: item.product_id, store: item.store, price: cleanPrice }
          ]);

        if (error) throw error;
        console.log("-> ✅ Insertado en Base de Datos con éxito.");
      } else {
        console.log("-> ☁️ [Simulación de guardado exitosa - Faltan Credenciales .env]");
      }

    } catch (error) {
      console.error(`❌ Error general escaneando ${item.name}:`, error.message);
    }
  }

  await browser.close();
  console.log("\n✅ Rutina del Robot finalizada.");
  process.exit(0);
}

runScraper();
