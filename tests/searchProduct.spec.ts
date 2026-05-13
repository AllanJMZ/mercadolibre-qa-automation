// tests/example.spec.ts
import { test } from '@playwright/test';
import { ProductCatalogPage } from '../pages/ProductCatalogPage';
import { launchStealthContext } from '../utils/browserFactory';

test('Escenario: Búsqueda dinámica de PlayStation 5', async () => {
  const userDataDir = 'C:/Users/LazYW/Documents/user_data';
  const context = await launchStealthContext(userDataDir);
  const page = context.pages()[0] || await context.newPage();
  
  const mlPage = new ProductCatalogPage(page);

  // Ejecución de hitos
  await page.goto('https://www.mercadolibre.com.mx/');
  await mlPage.buscarProducto('playstation 5');
  await mlPage.productosLocales();
  await mlPage.aplicarFiltros();
  await mlPage.obtenerTopResultados(5);

  await page.pause();
  await context.close();
});