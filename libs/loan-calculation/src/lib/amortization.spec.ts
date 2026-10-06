describe('Tilgungsplan', () => {
  it.todo('hat genau so viele Zeilen wie Monate in der Laufzeit');

  it.todo(
    'beginnt bei 10.000 €, 60 Monaten und 5 % mit etwa 41,67 € Zins und 147,05 € Tilgung',
  );

  it.todo('endet mit einer Restschuld von 0, auch nach Rundung auf Cent');

  it.todo('setzt bei 0 % Zins den Zinsanteil jeder Zeile auf 0');

  it.todo('lehnt eine Laufzeit unter 1 Monat ab oder liefert einen leeren Plan');
});
