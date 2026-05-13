// utils/apiHelper.ts
import { request } from '@playwright/test';

export class ApiHelper {
    static async searchProducts(query: string) {
        const context = await request.newContext({
            // Forzamos un User-Agent de navegador real para evitar el 403 por detección de bot
            extraHTTPHeaders: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Accept': 'application/json',
            }
        });
        
        const accessToken = 'APP_USR-5911754785804114-051300-846a07646aac43c0149446e03091e27c-174615579'; 

        const response = await context.get(`https://api.mercadolibre.com/sites/MLM/search`, {
            params: {
                q: query
            },
            headers: {
                // El espacio después de 'Bearer' es vital
                'Authorization': `Bearer ${accessToken.trim()}`
            }
        });

        return response;
    }
}