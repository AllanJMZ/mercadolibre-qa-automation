// pages/MercadoLibrePage.ts
import { Page, Locator, expect } from '@playwright/test';

export class ProductCatalogPage {
  readonly page: Page;
  readonly searchBox: Locator;
  readonly sortDropdown: Locator;
  readonly resultsList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchBox = page.getByRole('combobox', { name: 'Ingresa lo que quieras' });
    this.sortDropdown = page.getByRole('combobox', { name: 'Más relevantes' });
    this.resultsList = page.locator('ol.ui-search-layout li.ui-search-layout__item');
  }


  async buscarProducto(producto: string) {
    console.log(`🔍 [HITO]: Buscando "${producto}"`);
    await this.searchBox.pressSequentially(producto, { delay: 100 });
    await this.page.keyboard.press('Enter');
  }

    async productosLocales() {
    console.log('🔍 [HITO]: Buscando productos locales');
    await this.page.getByRole('switch', { name: 'Envío local Productos con env' }).check();
  }


  async aplicarFiltros() {
    console.log('🎯 [HITO]: Aplicando filtros de Nuevo y Mayor Precio');
    await this.page.getByRole('link', { name: 'Nuevo', exact: true }).click();
    await this.page.waitForURL(/nuevo/);
    await this.sortDropdown.click();
    await this.page.getByRole('option', { name: 'Mayor precio' }).click();
  }

  async obtenerTopResultados(limit: number = 5) {
    console.log(`📊 [HITO]: Extrayendo top ${limit} resultados`);
    await this.page.waitForSelector('ol.ui-search-layout');
    const count = Math.min(await this.resultsList.count(), limit);
    
    for (let i = 0; i < count; i++) {
      const item = this.resultsList.nth(i);
      const name = await item.locator('h2, h3').first().innerText();
      const price = await item.locator('.andes-money-amount__fraction').first().innerText();
      console.log(`   📦 [ITEM ${i+1}]: ${name.trim()} | $${price}`);
    }
  }

  
}

export default ProductCatalogPage;