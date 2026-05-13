Mercado Libre QA Automation Framework
Framework basado en Playwright con arquitectura POM para la validación funcional, visual y de accesibilidad de Mercado Libre México.

🛠️ Instalación y Ejecución
Instalar: npm install && npx playwright install --with-deps

Ejecutar (Headless): npx playwright test

Ejecutar (Headed): npx playwright test --headed

Actualizar Snapshots: npx playwright test --update-snapshots

📊 Reportes y Capacidades
Visual Regression: Comparación de componentes con toHaveScreenshot y enmascaramiento de publicidad.

Accesibilidad: Escaneo WCAG 2A/2AA mediante @axe-core/playwright.

Performance: Medición de Load Time vía Performance API.

Reporte HTML: npx playwright show-report para inspeccionar trazas y capturas tras fallos.

⚙️ CI/CD (GitHub Actions)
El workflow en .github/workflows/test.yml automatiza la ejecución y carga los reportes como artefactos.

[!IMPORTANTE]
Aviso Anti-Bot: La ejecución en GitHub Actions puede ser bloqueada por los sistemas de seguridad de Mercado Libre (CAPTCHA/WAF) debido a la reputación de las IPs de los data centers de GitHub. Se recomienda la ejecución local para resultados deterministas.

