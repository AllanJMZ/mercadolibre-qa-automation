// tests/api/search.spec.ts
import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../utils/apiHelper';

test.describe('Mercado Libre API - Búsqueda MLM', () => {

    test('Validar que los resultados contienen información de precios y títulos', async () => {
        const query = 'PlayStation 5';
        const response = await ApiHelper.searchProducts(query);
        
        expect(response.status()).toBe(200);
        
        const data = await response.json();
        
        // Validamos que el primer resultado tenga la estructura necesaria para el inventario
        const primerProducto = data.results[0];
        expect(primerProducto).toHaveProperty('id');
        expect(primerProducto).toHaveProperty('title');
        expect(primerProducto).toHaveProperty('price');
        
        console.log(`Test exitoso para: ${primerProducto.title} - Precio: ${primerProducto.price}`);
    });

});