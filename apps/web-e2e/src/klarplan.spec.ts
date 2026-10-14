import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const pages = [
  { path: '/', heading: 'Was kostet der Kredit im Monat?', nav: 'Rechner' },
  { path: '/tilgungsplan', heading: 'Tilgungsplan', nav: 'Tilgungsplan' },
  { path: '/vergleich', heading: 'Angebote vergleichen', nav: 'Vergleich' },
  { path: '/hinweis', heading: 'Was dieser Rechner ist', nav: 'Hinweis' },
];

test('Rechner zeigt Eingaben und den leeren Ergebniszustand', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Was kostet der Kredit im Monat?' }),
  ).toBeVisible();
  await expect(page.getByLabel('Kreditbetrag')).toBeVisible();
  await expect(page.getByLabel('Laufzeit')).toBeVisible();
  await expect(page.getByLabel('Sollzins pro Jahr')).toBeVisible();
  await expect(page.getByText('Noch nicht berechnet')).toBeVisible();
  await expect(page.getByText('0,00 €').first()).toBeVisible();
});

test('Navigation erreicht alle Seiten', async ({ page }) => {
  await page.goto('/');
  for (const entry of pages.slice(1)) {
    await page
      .getByRole('navigation', { name: 'Hauptnavigation' })
      .getByRole('link', { name: entry.nav })
      .click();
    await expect(page.getByRole('heading', { level: 1, name: entry.heading })).toBeVisible();
  }
});

test('Tilgungsplan ist leer', async ({ page }) => {
  await page.goto('/tilgungsplan');
  await expect(page.getByText('Noch keine Raten.')).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Restschuld' })).toBeVisible();
});

test('Vergleich ist leer', async ({ page }) => {
  await page.route('**/api/angebote', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: '[]',
    }),
  );
  await page.goto('/vergleich');
  await expect(page.getByRole('heading', { name: 'Noch keine Demo-Angebote' })).toBeVisible();
  await expect(page.getByText('Platz für Angebot 3')).toBeVisible();
});

test('auf dem Handy bleibt die Eingabe im Blick', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chrome', 'nur die mobile Ansicht');
  await page.goto('/');
  await expect(page.getByLabel('Kreditbetrag')).toBeVisible();
  const overflows = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  );
  expect(overflows).toBe(false);
});

test('Seiten bestehen die AXE-Prüfung', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'AXE läuft auf dem Desktop');
  for (const entry of pages) {
    await page.goto(entry.path);
    await expect(page.getByRole('heading', { level: 1, name: entry.heading })).toBeVisible();
    await page.waitForLoadState('networkidle');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations, `${entry.path}: ${JSON.stringify(results.violations)}`).toEqual(
      [],
    );
  }
});

test('Berechnung zeigt 188,71 Euro für 10.000 Euro, 60 Monate und 5 Prozent', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Kreditbetrag').fill('10000');
  await page.getByLabel('Laufzeit').fill('60');
  await page.getByLabel('Sollzins pro Jahr').fill('5');
  await page.getByRole('button', { name: 'Rate berechnen' }).click();
  await expect(page.getByText('188,71 €').first()).toBeVisible();
  await expect(page.getByText('1.322,74 €').first()).toBeVisible();
  await expect(page.getByText('11.322,74 €').first()).toBeVisible();
  await expect(page.getByText('5,12 %')).toBeVisible();
});

test('eine ungültige Eingabe zeigt den Fehler am Feld und rechnet nicht', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Kreditbetrag').fill('0');
  await expect(page.getByRole('alert')).toHaveText('Mindestens 1.000 Euro.');
  await expect(page.getByText('Noch nicht berechnet')).toBeVisible();
});

const demoOffers = [
  {
    id: 'demo-nord',
    bankName: 'Demo-Bank Nord',
    productName: 'Übungsratenkredit',
    nominalAnnualPercent: 3,
    effectiveAnnualPercent: 3.04,
    termMonths: 60,
    principalEuro: 10000,
    monthlyPaymentEuro: 179.69,
    isDemo: true,
    disclaimer:
      'Erfundenes Demo-Angebot. Keine echte Bank, keine echten Konditionen und kein Vertragsangebot.',
  },
  {
    id: 'demo-mitte',
    bankName: 'Beispielkasse Mitte',
    productName: 'Musterkredit',
    nominalAnnualPercent: 5,
    effectiveAnnualPercent: 5.12,
    termMonths: 60,
    principalEuro: 10000,
    monthlyPaymentEuro: 188.71,
    isDemo: true,
    disclaimer:
      'Erfundenes Demo-Angebot. Keine echte Bank, keine echten Konditionen und kein Vertragsangebot.',
  },
  {
    id: 'demo-sued',
    bankName: 'Musterfinanz Süd',
    productName: 'Rechenbeispiel',
    nominalAnnualPercent: 7,
    effectiveAnnualPercent: 7.23,
    termMonths: 60,
    principalEuro: 10000,
    monthlyPaymentEuro: 198.01,
    isDemo: true,
    disclaimer:
      'Erfundenes Demo-Angebot. Keine echte Bank, keine echten Konditionen und kein Vertragsangebot.',
  },
];

test('der Vergleich zeigt drei als Demo gekennzeichnete Angebote', async ({ page }) => {
  await page.route('**/api/angebote', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(demoOffers),
    }),
  );
  await page.goto('/vergleich');
  await expect(page.getByRole('heading', { name: 'Demo-Bank Nord' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Beispielkasse Mitte' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Musterfinanz Süd' })).toBeVisible();
  await expect(page.getByText('Erfundenes Demo-Angebot').first()).toBeVisible();
  await expect(page.getByText('Noch keine Demo-Angebote')).toHaveCount(0);
});

test('ein Fehler beim Laden der Angebote zeigt den Fehlerzustand', async ({ page }) => {
  await page.route('**/api/angebote', (route) => route.abort('failed'));
  await page.goto('/vergleich');
  await expect(page.getByText('Angebote nicht geladen')).toBeVisible();
  await expect(page.getByText('Die Demo-API hat nicht geantwortet.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Erneut laden' })).toBeVisible();
});
