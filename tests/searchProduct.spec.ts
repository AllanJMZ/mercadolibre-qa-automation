// tests/example.spec.ts
import { test } from '@playwright/test';
import { ProductCatalogPage } from '../pages/ProductCatalogPage';
import { launchStealthContext } from '../utils/browserFactory';

test('Escenario: Búsqueda dinámica de PlayStation 5', async () => {
  const userDataDir = '.user_data';
  const context = await launchStealthContext(userDataDir);

  

  const page = context.pages()[0] || await context.newPage();
  
  const mlPage = new ProductCatalogPage(page);

  // Ejecución de hitos
  await page.goto('https://www.mercadolibre.com/');
  await mlPage.seleccionarPais('México');
  //Busqueda dinamica de producto NINTENDO, XBOX, PLAYSTATION....
  await mlPage.buscarProducto('playstation 5');
  await mlPage.productosLocales();
  await mlPage.aplicarFiltros();
  await mlPage.obtenerTopResultados(5);

  //Pausar el escenario para la deteccion de la ultima pantalla
  await page.pause();
  await context.close();
});