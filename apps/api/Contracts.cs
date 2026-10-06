namespace Klarplan.Api;

public sealed record OfferDto(
    string Id,
    string BankName,
    string ProductName,
    decimal NominalAnnualPercent,
    decimal EffectiveAnnualPercent,
    int TermMonths,
    decimal PrincipalEuro,
    decimal MonthlyPaymentEuro,
    bool IsDemo,
    string Disclaimer);

public sealed record OfferCheckRequest(
    decimal PrincipalEuro,
    int TermMonths,
    decimal NominalAnnualPercent);

public sealed record OfferCheckResponse(
    decimal MonthlyPaymentEuro,
    decimal TotalInterestEuro,
    decimal TotalAmountEuro,
    decimal EffectiveAnnualPercent,
    bool IsDemo);
