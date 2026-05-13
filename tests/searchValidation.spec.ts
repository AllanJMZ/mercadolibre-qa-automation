import { test, expect } from '@playwright/test';
import { ProductCatalogPage } from '../pages/ProductCatalogPage';
import { launchStealthContext } from '../utils/browserFactory';

const userDataDir = 'C:/Users/LazYW/Documents/user_data';

test('Escenario: Validaciones de Calidad (Visual, Accesibilidad y Perf)', async () => {
    const userDataDir = 'C:/Users/LazYW/Documents/user_data';
    const context = await launchStealthContext(userDataDir);
    const page = context.pages()[0] || await context.newPage();  

    const mlPage = new ProductCatalogPage(page);

    await page.goto('https://www.mercadolibre.com/');
    
    // 1. Rendimiento inicial
    await mlPage.verificarTiempoDeCarga(4); 

    await page.goto('https://www.mercadolibre.com/');
    await mlPage.seleccionarPais('México');
    await mlPage.buscarProducto('playstation 5');
    await mlPage.productosLocales();
    await mlPage.aplicarFiltros();
    await mlPage.obtenerTopResultados(5);

  // 3. Regresión Visual
  await mlPage.validarAparienciaVisual('resultados-busqueda-ps5');
});