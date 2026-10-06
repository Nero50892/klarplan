import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const pages = [
  { path: '/', heading: 'Was kostet der Kredit im Monat?', nav: 'Rechner' },
  { path: '/tilgungsplan', heading: 'Tilgungsplan', nav: 'Tilgungsplan' },
  { path: '/vergleich', heading: 'Angebote vergleichen', nav: 'Vergleich' },
  { path: '/hinweis', heading: 'Was dieser Rechner ist', nav: 'Hinweis' },
];

test('Rechner zeigt Eingaben und Platzhalter', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Was kostet der Kredit im Monat?' }),
  ).toBeVisible();
  await expect(page.getByLabel('Kreditbetrag')).toBeVisible();
  await expect(page.getByLabel('Laufzeit')).toBeVisible();
  await expect(page.getByLabel('Sollzins pro Jahr')).toBeVisible();
  await expect(page.getByText('Platzhalter')).toBeVisible();
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

test.fixme('Berechnung zeigt 188,71 Euro für 10.000 Euro, 60 Monate und 5 Prozent', async () => {
  // Hängt an Schritt 1 und Schritt 7.
});

test.fixme('eine ungültige Eingabe zeigt den Fehler am Feld und rechnet nicht', async () => {
  // Hängt an Schritt 8.
});

test.fixme('der Vergleich zeigt drei als Demo gekennzeichnete Angebote', async () => {
  // Hängt an Schritt 10 und Schritt 11.
});

test.fixme('ein Fehler beim Laden der Angebote zeigt den Fehlerzustand', async () => {
  // Hängt an Schritt 10.
});
