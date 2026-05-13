// utils/browserFactory.ts
import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

export async function launchStealthContext(userDataDir: string, options: any = {}) {
  return await chromium.launchPersistentContext(userDataDir, {
    headless: options.headless !== undefined ? options.headless : true,
    viewport: null,
    deviceScaleFactor: undefined,
    args: ['--disable-blink-features=AutomationControlled', 
            '--start-maximized',
            '--no-sandbox', // Recomendado para entornos de contenedores/CI
      '--disable-setuid-sandbox'
    ],
  });
}