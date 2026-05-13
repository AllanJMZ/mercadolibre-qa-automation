// utils/browserFactory.ts
import { chromium } from 'playwright-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

chromium.use(stealth());

export async function launchStealthContext(userDataDir: string) {
  return await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    viewport: null,
    deviceScaleFactor: undefined,
    args: ['--disable-blink-features=AutomationControlled', '--start-maximized'],
  });
}