namespace Klarplan.Api.Tests;

public class OfferEndpointTests
{
    [Fact(Skip = "TODO(Andreas) [Schritt 11/12]: drei Demo-Angebote, jedes mit isDemo true")]
    public void Angebote_sind_als_Demo_gekennzeichnet()
    {
    }

    [Fact(Skip = "TODO(Andreas) [Schritt 11/12]: 10.000 €, 60 Monate, 5 % ergeben 188,71 € Monatsrate")]
    public void Pruefen_berechnet_die_Annuitaet()
    {
    }

    [Fact(Skip = "TODO(Andreas) [Schritt 12/12]: Betrag unter 1.000 € wird mit 400 abgelehnt")]
    public void Betrag_unter_1000_wird_abgelehnt()
    {
    }

    [Fact(Skip = "TODO(Andreas) [Schritt 12/12]: Laufzeit außerhalb von 12 bis 120 Monaten wird abgelehnt")]
    public void Laufzeit_ausserhalb_des_Rahmens_wird_abgelehnt()
    {
    }

    [Fact(Skip = "TODO(Andreas) [Schritt 12/12]: Sollzins über 15 % wird abgelehnt, 0 % bleibt gültig")]
    public void Zinssatz_wird_geprueft_und_null_prozent_ist_erlaubt()
    {
    }
}
