# @klarplan/loan-calculation

Reine Funktionen für Monatsrate, Tilgungsplan, Gesamtzinsen und effektiven Jahreszins.

Die Annuität ist `R = K * (q^n * (q - 1)) / (q^n - 1)` mit `q = 1 + p/12/100`. Bei 0 % ist die Rate der Betrag geteilt durch die Monate. Der Tilgungsplan rundet jede Zeile auf Cent, die letzte Zeile setzt die Restschuld auf 0. Gesamtbetrag und Gesamtzinsen sind die Summe dieser gerundeten Zeilen. Der effektive Jahreszins ist `(1 + p/12/100)^12 - 1`, ohne weitere Kosten.

10.000 €, 60 Monate und 5 % ergeben 188,71 € Monatsrate, 1.322,74 € Zinsen, 11.322,74 € Gesamtbetrag und 5,12 % effektiv.
