import puppeteer from 'puppeteer';

async function check() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36');
  
  await page.goto('https://www.superselectos.com/Busqueda/frijol', { waitUntil: 'networkidle0', timeout: 30000 });
  
  // Esperar un segundo extra para Blazor WASM
  await new Promise(r => setTimeout(r, 2000));

  const html = await page.evaluate(() => {
    // Buscar directamente todos los elementos que contengan el signo $ en texto puro y sean nodo hoja
    const prices = Array.from(document.querySelectorAll('*')).filter(el => {
      // Tiene que tener "$" y alugnos números solos
      const text = el.textContent.trim();
      return text.includes('$') && /\d/.test(text) && el.children.length === 0;
    });

    if (prices.length > 0) {
      // Regresar la estructura de clases del padre de los primeros 2 elementos de precio que encontremos
      return prices.slice(0,2).map(p => {
         return {
            text: p.textContent.trim(),
            className: p.className,
            parentClass: p.parentElement.className
         }
      });
    }
    return "No prices found in leaves.";
  });
  
  console.log("DUMP RESULT:");
  console.log(JSON.stringify(html, null, 2));
  await browser.close();
  process.exit();
}
check();
