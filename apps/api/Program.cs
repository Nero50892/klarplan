using Klarplan.Api;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
});

var app = builder.Build();

app.UseCors();

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

app.MapGet("/api/angebote", () =>
{
    // TODO(Andreas) [Schritt 11/12]: Demo-Angebote ausliefern und prüfen
    // Ziel: DemoOffers.All zurückgeben. Jedes Angebot bleibt als Demo gekennzeichnet, ohne echte Bankmarken.
    // Die Monatsrate kommt aus derselben Annuität wie in libs/loan-calculation, nicht aus einer fest eingetragenen Zahl.
    // Akzeptanz: drei Angebote, jedes mit isDemo true und einem Hinweistext; keine Konditionen, die wie ein echtes Angebot wirken
    // Tests: apps/api/tests/OfferEndpointTests.cs (aktuell Fact mit Skip)
    return Results.Ok(Array.Empty<OfferDto>());
});

app.MapPost("/api/angebote/pruefen", (OfferCheckRequest request) =>
{
    // TODO(Andreas) [Schritt 11/12]: Angebot prüfen und die Kennzahlen berechnen
    // TODO(Andreas) [Schritt 12/12]: Anfrage validieren
    // Ziel: Betrag 1.000–100.000 €, Laufzeit 12–120 Monate, Sollzins 0–15 %. Sonst 400 mit den fehlerhaften Feldern.
    // Akzeptanz: 10.000 €, 60 Monate, 5 % → 188,71 € Monatsrate; 500 € → Validierungsfehler am Betrag; Zins 0 ist erlaubt
    // Tests: apps/api/tests/OfferEndpointTests.cs (aktuell Fact mit Skip)
    _ = request;
    return Results.Ok(new OfferCheckResponse(0, 0, 0, 0, true));
});

app.Run();

public partial class Program
{
}
