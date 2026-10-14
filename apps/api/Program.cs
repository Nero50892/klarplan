using Klarplan.Api;

var builder = WebApplication.CreateBuilder(args);

var corsOrigins = builder.Configuration["Cors:Origins"]
    ?.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
    ?? [];

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyHeader().AllowAnyMethod();
        if (corsOrigins.Length == 0)
        {
            policy.AllowAnyOrigin();
            return;
        }

        policy.WithOrigins(corsOrigins);
    });
});

var app = builder.Build();

app.UseCors();

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

app.MapGet("/api/angebote", () =>
    Results.Ok(DemoOffers.All.Select(LoanMath.WithFigures)));

app.MapPost("/api/angebote/pruefen", (OfferCheckRequest request) =>
{
    var errors = new Dictionary<string, string[]>();
    if (request.PrincipalEuro is < 1_000m or > 100_000m)
    {
        errors["principalEuro"] = ["Der Betrag muss zwischen 1.000 und 100.000 Euro liegen."];
    }

    if (request.TermMonths is < 12 or > 120)
    {
        errors["termMonths"] = ["Die Laufzeit muss zwischen 12 und 120 Monaten liegen."];
    }

    if (request.NominalAnnualPercent is < 0m or > 15m)
    {
        errors["nominalAnnualPercent"] = ["Der Sollzins muss zwischen 0 und 15 Prozent liegen."];
    }

    if (errors.Count > 0)
    {
        return Results.ValidationProblem(errors);
    }

    return Results.Ok(LoanMath.Summarize(
        (double)request.PrincipalEuro,
        request.TermMonths,
        (double)request.NominalAnnualPercent));
});

app.Run();

public partial class Program
{
}
