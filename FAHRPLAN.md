# Fahrplan für Andreas

Die Oberfläche, das Routing, die Komponentenbibliothek und die Verkabelung stehen. Offen sind die Berechnung, der Zustand der Fachseiten und die Fachlogik der API. Jeder Schritt hat einen Kommentar `TODO(Andreas)` an der genannten Stelle. Die Tests dazu sind `it.todo`, `test.fixme` oder bei xUnit `Fact(Skip)`.

## Schritte

- [x] **Schritt 1/12. Monatsrate**
  - Datei: `libs/loan-calculation/src/lib/annuity.ts`
  - Ziel: Annuität `R = K * (q^n * (q - 1)) / (q^n - 1)` mit `q = 1 + p/12/100`.
  - Akzeptanz: 10.000 €, 60 Monate, 5 % ergeben 188,71 €. Bei 0 % ist die Rate Betrag geteilt durch Monate, also 166,67 €.
  - Test: `libs/loan-calculation/src/lib/annuity.spec.ts`

- [x] **Schritt 2/12. Tilgungsplan**
  - Datei: `libs/loan-calculation/src/lib/amortization.ts`
  - Ziel: pro Monat Rate, Zinsanteil, Tilgungsanteil und Restschuld. Zinsanteil ist Restschuld mal `p/12/100`.
  - Akzeptanz: dieselben Eckdaten, Monat 1 etwa 41,67 € Zins und 147,05 € Tilgung, Restschuld etwa 9.852,95 €. Die letzte Restschuld ist 0. Bei 0 % ist jeder Zinsanteil 0.
  - Test: `libs/loan-calculation/src/lib/amortization.spec.ts`

- [ ] **Schritt 3/12. Gesamtzinsen und Gesamtbetrag**
  - Datei: `libs/loan-calculation/src/lib/totals.ts`
  - Ziel: Gesamtbetrag als Summe der ungerundeten Raten, Gesamtzinsen als Gesamtbetrag minus Kreditbetrag.
  - Akzeptanz: 11.322,74 € Gesamtbetrag und 1.322,74 € Zinsen. Bei 0 % sind die Zinsen 0.
  - Test: `libs/loan-calculation/src/lib/totals.spec.ts`

- [ ] **Schritt 4/12. Effektiver Jahreszins**
  - Datei: `libs/loan-calculation/src/lib/effective-rate.ts`
  - Ziel: ohne weitere Kosten `(1 + p/12/100)^12 - 1`, als Prozentzahl.
  - Akzeptanz: 5 % nominal ergeben etwa 5,116 %, in der Anzeige 5,12 %. 0 % bleibt 0.
  - Test: `libs/loan-calculation/src/lib/effective-rate.spec.ts`

- [ ] **Schritt 5/12. Zustand des Rechners**
  - Datei: `apps/web/src/app/loan/loan-draft.ts`
  - Ziel: aus `formModel` die Eingabe lesen und `result` sowie `schedule` setzen. Rechner und Tilgungsplan teilen sich diesen Zustand.
  - Akzeptanz: nach dem Berechnen stehen Rate, Zinsen, Gesamtbetrag, Effektivzins und der Plan in den Signals, `calculated` wird wahr.
  - Test: `apps/web-e2e/src/klarplan.spec.ts`, Fall zur Berechnung (`test.fixme`)

- [ ] **Schritt 6/12. Ableitungen**
  - Datei: `apps/web/src/app/loan/loan-draft.ts`
  - Ziel: `monthlyPaymentEuro`, `totalInterestEuro`, `totalAmountEuro` und `effectiveAnnualPercent` per `computed()` aus dem Ergebnis oder den Funktionen ableiten. Heute liefern sie 0.
  - Akzeptanz: ändert sich das Ergebnis, ändern sich die Kennzahlen ohne ein zweites Setzen.
  - Test: derselbe Playwright-Fall

- [ ] **Schritt 7/12. Berechnen und Zurücksetzen**
  - Datei: `apps/web/src/app/rechner/rechner.ts`
  - Ziel: `berechnen` prüft das Formular und schreibt das Ergebnis. `zuruecksetzen` stellt 10.000 €, 60 Monate und 5 % her und leert das Ergebnis.
  - Akzeptanz: die Beispielwerte zeigen 188,71 €. Ungültige Eingaben rechnen nicht. Zurücksetzen zeigt wieder die Platzhalter.
  - Test: derselbe Playwright-Fall, plus optional ein Komponenten-Test am Handler

- [ ] **Schritt 8/12. Formularschema**
  - Datei: `apps/web/src/app/rechner/rechner.ts`
  - Ziel: Signal Forms mit `min` und `max`. Betrag 1.000 bis 100.000, Laufzeit 12 bis 120, Sollzins 0 bis 15. Die drei `*Error`-Computeds lesen die erste Fehlermeldung.
  - Akzeptanz: zu kleine Werte zeigen den deutschen Fehler am Feld. 0 % Zins bleibt gültig.
  - Test: `apps/web-e2e/src/klarplan.spec.ts`, Fall zur ungültigen Eingabe (`test.fixme`)

- [ ] **Schritt 9/12. Auswahl im Vergleich**
  - Datei: `apps/web/src/app/vergleich/vergleich.ts`
  - Ziel: zwei oder drei Angebote über `selectedIds` auswählen. `ausgewaehlte` filtert die geladene Liste. Ein viertes Angebot geht nicht.
  - Akzeptanz: bei weniger als zwei Angeboten bleibt der Hinweis stehen. `aria-pressed` folgt der Auswahl.
  - Test: `apps/web-e2e/src/klarplan.spec.ts`, Fall zum Vergleich (`test.fixme`)

- [ ] **Schritt 10/12. Angebote laden**
  - Datei: `apps/web/src/app/angebote/offer.service.ts`
  - Ziel: `GET {apiUrl}/api/angebote`. Zustand `laedt`, danach `bereit` oder `fehler`.
  - Akzeptanz: Netzwerkfehler zeigt den Hinweis und „Erneut laden“. Eine leere Antwort bleibt der leere Zustand.
  - Test: `apps/web/src/app/angebote/offer.service.spec.ts` und die beiden Playwright-Fälle mit `test.fixme`

- [ ] **Schritt 11/12. API, Angebote und Prüfung**
  - Datei: `apps/api/Program.cs`, Daten in `apps/api/DemoOffers.cs`
  - Ziel: `GET /api/angebote` liefert die drei Demo-Angebote, jedes mit `isDemo`. `POST /api/angebote/pruefen` rechnet mit derselben Annuität. Keine echten Banknamen und keine Konditionen, die echt wirken.
  - Akzeptanz: drei Demo-Einträge. 10.000 €, 60 Monate, 5 % ergeben 188,71 € Monatsrate.
  - Test: `apps/api/tests/OfferEndpointTests.cs`

- [ ] **Schritt 12/12. Anfrage prüfen**
  - Datei: `apps/api/Program.cs`
  - Ziel: Betrag, Laufzeit und Sollzins prüfen. Ungültige Werte mit 400 und den Feldnamen ablehnen.
  - Akzeptanz: 500 € wird abgelehnt. Laufzeit außerhalb von 12 bis 120 Monaten wird abgelehnt. Zins über 15 % wird abgelehnt. 0 % ist erlaubt.
  - Test: `apps/api/tests/OfferEndpointTests.cs`

## Bonus, optional

- [ ] **UI-Baustein selbst weiterbauen und ein Coverage-Gate setzen**
  - Datei: zum Beispiel `libs/ui/src/lib/data-table/` oder `libs/ui/src/lib/text-field/`
  - Ziel: eine Komponente aus der Bibliothek selbst überarbeiten oder erweitern, etwa eine sortierbare Tabelle oder ein Suffix, das von Screenreadern nicht doppelt vorgelesen wird. Dazu einen echten Unit-Test schreiben, kein `it.todo`.
  - Akzeptanz: der neue Test läuft grün. In der CI gibt es eine Schwelle für die Testabdeckung der Bibliothek, zum Beispiel über `nx test ui --coverage`. Liegt die Abdeckung darunter, wird der Lauf rot. Die Schwelle nicht senken, nur damit der Lauf grün wird.
  - Test: die neue Spec neben der Komponente, plus der angepasste Job in `.github/workflows/ci.yml`
  - Heute: Vitest kann Berichte schreiben, eine Schwelle ist bewusst nicht gesetzt. Die Pipeline bleibt deshalb grün, bis du das Gate einbaust.

## Was du im Interview erklären können solltest

**Nx.** `apps/web` ist die Angular-App, `libs/ui` die Komponentenbibliothek, `libs/loan-calculation` die reine Berechnung, `apps/api` die .NET-API. Pfade wie `@klarplan/ui` stehen in `tsconfig.base.json`. `nx run-many` führt Lint, Test und Build über die Projekte, die das Ziel haben. Die API hängt als `nx:run-commands` an `dotnet`.

**Zoneless.** Die App kommt ohne `zone.js` aus. Angular 22 erkennt Änderungen über Signals, Ereignisse und den HTTP-Resource der Health-Abfrage. Signal Forms halten die Eingabe, `computed()` ist für die Kennzahlen vorgesehen.

**Pipeline.** `.github/workflows/ci.yml` macht drei Jobs: Frontend mit Lint, Vitest und Playwright inklusive AXE, API mit xUnit, und `docker compose build`. Übersprungene Tests (`it.todo`, `test.fixme`, `Skip`) färben den Lauf nicht rot.

**Docker.** `docker compose up --build` startet die API auf Port 5088 und die gebaute Oberfläche auf Port 8091. Nginx liefert die App aus und leitet `/api` und `/health` an die API weiter.

**Deployment.** Die Oberfläche geht über `.github/workflows/deploy-web.yml` auf GitHub Pages. Die API ist in `fly.toml` für Fly.io beschrieben, Region Frankfurt, die Maschine darf auf null skalieren. Beides braucht einen Account von dir, siehe README.
