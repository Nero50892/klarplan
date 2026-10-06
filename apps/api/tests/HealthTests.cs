using System.Net.Http.Json;

namespace Klarplan.Api.Tests;

public class HealthTests : IClassFixture<ApiFactory>
{
    private readonly HttpClient client;

    public HealthTests(ApiFactory factory)
    {
        client = factory.CreateClient();
    }

    [Fact]
    public async Task Health_antwortet_mit_ok()
    {
        var response = await client.GetAsync("/health");

        response.EnsureSuccessStatusCode();
        var body = await response.Content.ReadFromJsonAsync<HealthBody>();
        Assert.NotNull(body);
        Assert.Equal("ok", body.Status);
    }

    private sealed record HealthBody(string Status);
}
