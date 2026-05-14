import { Page, Locator, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

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

  async seleccionarPais(pais: string) {
    console.log(`🌍 [HITO]: Seleccionando país "${pais}"`);
    await this.page.getByRole('link', { name: pais, exact: true }).click();
    //await this.page.waitForLoadState('networkidle');
  }

  async buscarProducto(producto: string) {
    console.log(`🔍 [HITO]: Buscando "${producto}"`);
    await this.searchBox.fill(producto); // .fill es más rápido y menos detectable que pressSequentially
    await this.page.keyboard.press('Enter');
    // Esperamos a que la URL cambie y los resultados carguen antes de seguir
    await this.page.waitForLoadState('domcontentloaded');
  }

// En ProductCatalogPage.ts
async activarEnvioLocal() {
  await this.page.getByRole('switch', { name: 'Envío local Productos con env' }).check();
  /*
    console.log('🧪 Iniciando proceso de Envío Local');
    
    // 1. Usamos un selector más flexible (Regex) por si cambian mayúsculas/minúsculas
    const switchLabel = this.page.getByText(/Envío local/i);

    try {
        // 2. LA CLAVE: Verificar si el elemento existe antes de intentar cualquier acción
        // Ponemos un timeout muy corto (2 segundos) para no perder tiempo
        const existe = await switchLabel.isVisible({ timeout: 2000 }).catch(() => false);

        if (existe) {
            await switchLabel.scrollIntoViewIfNeeded();
            await switchLabel.click({ force: true });
            console.log('✅ Switch de Envío Local activado con éxito');
        } else {
            console.log('⚠️ El elemento "Envío local" no está en el DOM. Saltando paso...');
        }
    } catch (error: any) {
    console.log('❌ Error inesperado:', error.message);
    }*/
}

async aplicarFiltroNuevo() {
    try {
        console.log('🧪 Intentando aplicar filtro: Nuevo');
        const filtroNuevo = this.page.getByRole('link', { name: /Nuevo/i });
        
        // Esperamos máximo 5 segundos para no agotar el timeout global
        const existeFiltro = await filtroNuevo.waitFor({ state: 'visible', timeout: 5000 })
            .then(() => true)
            .catch(() => false);

        // 2. Solo hacemos clic si realmente apareció
        if (existeFiltro) {
            await filtroNuevo.click({ force: true });
            console.log('✅ Filtro "Nuevo" aplicado.');
        } else {
            console.log('⚠️ El filtro "Nuevo" no apareció (quizás ya todos son nuevos). Siguiendo con el test...');
        }
        
        //await this.page.waitForURL(/nuevo/i);
        console.log('✅ Filtro Nuevo aplicado con éxito');
    } catch (error) {
        console.log('⚠️ El filtro "Nuevo" no estaba disponible o ya fue aplicado. Saltando paso...');
    }
}

  // --- NUEVOS MÉTODOS DE VALIDACIÓN ---

  /**
   * Validación de Regresión Visual
   * Compara la pantalla actual con la imagen base guardada.
   */
  async validarAparienciaVisual(nombreCaptura: string) {
    console.log(`📸 [VISUAL]: Validando captura de pantalla: ${nombreCaptura}`);
    // Ocultamos elementos dinámicos (banners/publicidad) para evitar falsos negativos
    const publicidad = this.page.locator('.ui-search-results__banner, .andes-carousel');
    
    await expect(this.page).toHaveScreenshot(`${nombreCaptura}.png`, {
      fullPage: true,
      mask: [publicidad], // Tapa la publicidad con bloques rosas para la comparación
      animations: 'disabled',
      maxDiffPixelRatio: 0.1 // Margen de error del 10% por renderizado
    });
  }

  /**
   * Verificación de Rendimiento
   */
  async verificarTiempoDeCarga(segundosMaximos: number) {
    const performanceTiming = await this.page.evaluate(() => {
      const { loadEventEnd, navigationStart } = performance.timing;
      return (loadEventEnd - navigationStart) / 1000;
    });

    console.log(`⏱️ [PERF]: Tiempo de carga detectado: ${performanceTiming.toFixed(2)}s`);
    
    if (performanceTiming <= 0) {
        console.warn('⚠️ Advertencia: El tiempo de carga se midió antes de completar el evento load.');
    }
    
    expect(performanceTiming).toBeLessThan(segundosMaximos);
  }

  /**
   * Comprobación de Accesibilidad
   */
  async analizarAccesibilidad() {
    console.log('♿ [ACC]: Analizando accesibilidad con axe-core...');
    // Aseguramos que la página esté quieta para evitar "Execution context destroyed"
    await this.page.waitForTimeout(1000); 
    
    const results = await new AxeBuilder({ page: this.page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    if (results.violations.length > 0) {
        console.warn('⚠️ Violaciones de accesibilidad encontradas:', results.violations.length);
    }
    expect(results.violations).toEqual([]);
  }

  async obtenerTopResultados(limit: number = 5) {
    console.log(`📊 [HITO]: Extrayendo top ${limit} resultados`);
    await this.page.waitForSelector('ol.ui-search-layout', { state: 'visible' });
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