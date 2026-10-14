using System.Net;
using System.Net.Http.Json;

namespace Klarplan.Api.Tests;

public class OfferEndpointTests : IClassFixture<ApiFactory>
{
    private readonly HttpClient client;

    public OfferEndpointTests(ApiFactory factory)
    {
        client = factory.CreateClient();
    }

    [Fact]
    public async Task Angebote_sind_als_Demo_gekennzeichnet()
    {
        var response = await client.GetAsync("/api/angebote");

        response.EnsureSuccessStatusCode();
        var offers = await response.Content.ReadFromJsonAsync<List<OfferDto>>();
        Assert.NotNull(offers);
        Assert.Equal(3, offers.Count);
        Assert.All(offers, offer =>
        {
            Assert.True(offer.IsDemo);
            Assert.Contains("Demo", offer.Disclaimer, StringComparison.OrdinalIgnoreCase);
            Assert.DoesNotContain("Sparkasse", offer.BankName, StringComparison.OrdinalIgnoreCase);
            Assert.DoesNotContain("Volksbank", offer.BankName, StringComparison.OrdinalIgnoreCase);
        });

        var fivePercent = Assert.Single(offers, offer => offer.NominalAnnualPercent == 5.00m);
        Assert.Equal(188.71m, fivePercent.MonthlyPaymentEuro);
        Assert.Equal(5.12m, fivePercent.EffectiveAnnualPercent);
    }

    [Fact]
    public async Task Pruefen_berechnet_die_Annuitaet()
    {
        var response = await client.PostAsJsonAsync(
            "/api/angebote/pruefen",
            new OfferCheckRequest(10000m, 60, 5m));

        response.EnsureSuccessStatusCode();
        var body = await response.Content.ReadFromJsonAsync<OfferCheckResponse>();
        Assert.NotNull(body);
        Assert.Equal(188.71m, body.MonthlyPaymentEuro);
        Assert.Equal(1322.74m, body.TotalInterestEuro);
        Assert.Equal(11322.74m, body.TotalAmountEuro);
        Assert.Equal(5.12m, body.EffectiveAnnualPercent);
        Assert.True(body.IsDemo);
    }

    [Fact]
    public async Task Betrag_unter_1000_wird_abgelehnt()
    {
        var response = await client.PostAsJsonAsync(
            "/api/angebote/pruefen",
            new OfferCheckRequest(500m, 60, 5m));

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var json = await response.Content.ReadAsStringAsync();
        Assert.Contains("principalEuro", json, StringComparison.Ordinal);
    }

    [Fact]
    public async Task Laufzeit_ausserhalb_des_Rahmens_wird_abgelehnt()
    {
        var tooShort = await client.PostAsJsonAsync(
            "/api/angebote/pruefen",
            new OfferCheckRequest(10000m, 11, 5m));
        var tooLong = await client.PostAsJsonAsync(
            "/api/angebote/pruefen",
            new OfferCheckRequest(10000m, 121, 5m));

        Assert.Equal(HttpStatusCode.BadRequest, tooShort.StatusCode);
        Assert.Equal(HttpStatusCode.BadRequest, tooLong.StatusCode);
        Assert.Contains("termMonths", await tooShort.Content.ReadAsStringAsync(), StringComparison.Ordinal);
        Assert.Contains("termMonths", await tooLong.Content.ReadAsStringAsync(), StringComparison.Ordinal);
    }

    [Fact]
    public async Task Zinssatz_wird_geprueft_und_null_prozent_ist_erlaubt()
    {
        var tooHigh = await client.PostAsJsonAsync(
            "/api/angebote/pruefen",
            new OfferCheckRequest(10000m, 60, 15.01m));
        Assert.Equal(HttpStatusCode.BadRequest, tooHigh.StatusCode);
        Assert.Contains("nominalAnnualPercent", await tooHigh.Content.ReadAsStringAsync(), StringComparison.Ordinal);

        var zero = await client.PostAsJsonAsync(
            "/api/angebote/pruefen",
            new OfferCheckRequest(10000m, 60, 0m));
        zero.EnsureSuccessStatusCode();
        var body = await zero.Content.ReadFromJsonAsync<OfferCheckResponse>();
        Assert.NotNull(body);
        Assert.Equal(166.67m, body.MonthlyPaymentEuro);
        Assert.Equal(0m, body.TotalInterestEuro);
        Assert.Equal(0m, body.EffectiveAnnualPercent);
    }
}
