namespace Klarplan.Api;

public static class DemoOffers
{
    public const string Disclaimer =
        "Erfundenes Demo-Angebot. Keine echte Bank, keine echten Konditionen und kein Vertragsangebot.";

    public static readonly IReadOnlyList<OfferDto> All =
    [
        new(
            "demo-nord",
            "Demo-Bank Nord",
            "Übungsratenkredit",
            3.00m,
            0m,
            60,
            10000m,
            0m,
            true,
            Disclaimer),
        new(
            "demo-mitte",
            "Beispielkasse Mitte",
            "Musterkredit",
            5.00m,
            0m,
            60,
            10000m,
            0m,
            true,
            Disclaimer),
        new(
            "demo-sued",
            "Musterfinanz Süd",
            "Rechenbeispiel",
            7.00m,
            0m,
            60,
            10000m,
            0m,
            true,
            Disclaimer),
    ];
}
