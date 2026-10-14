namespace Klarplan.Api;

public static class LoanMath
{
    public static OfferCheckResponse Summarize(double principalEuro, int termMonths, double nominalAnnualPercent)
    {
        var rows = Schedule(principalEuro, termMonths, nominalAnnualPercent);
        var totalAmount = rows.Sum(row => row.PaymentEuro);
        var totalInterest = rows.Sum(row => row.InterestEuro);

        return new OfferCheckResponse(
            Cents(MonthlyPayment(principalEuro, termMonths, nominalAnnualPercent)),
            Cents(totalInterest),
            Cents(totalAmount),
            Cents(EffectiveAnnualPercent(nominalAnnualPercent)),
            true);
    }

    public static OfferDto WithFigures(OfferDto offer)
    {
        var summary = Summarize((double)offer.PrincipalEuro, offer.TermMonths, (double)offer.NominalAnnualPercent);
        return offer with
        {
            MonthlyPaymentEuro = summary.MonthlyPaymentEuro,
            EffectiveAnnualPercent = summary.EffectiveAnnualPercent,
        };
    }

    private static double MonthlyPayment(double principalEuro, int termMonths, double nominalAnnualPercent)
    {
        if (principalEuro == 0)
        {
            return 0;
        }

        if (nominalAnnualPercent == 0)
        {
            return RoundTo(principalEuro / termMonths);
        }

        var q = 1 + nominalAnnualPercent / (12 * 100);
        if (termMonths == 1)
        {
            return RoundTo(principalEuro * q);
        }

        var qn = Math.Pow(q, termMonths);
        return RoundTo(principalEuro * (qn * (q - 1)) / (qn - 1));
    }

    private static double EffectiveAnnualPercent(double nominalAnnualPercent)
    {
        if (nominalAnnualPercent == 0)
        {
            return 0;
        }

        var q = 1 + nominalAnnualPercent / (12 * 100);
        return RoundTo((Math.Pow(q, 12) - 1) * 100);
    }

    private static IEnumerable<(double PaymentEuro, double InterestEuro)> Schedule(
        double principalEuro,
        int termMonths,
        double nominalAnnualPercent)
    {
        if (termMonths < 1)
        {
            yield break;
        }

        var monthlyRate = nominalAnnualPercent / (12 * 100);
        var monthlyPayment = MonthlyPayment(principalEuro, termMonths, nominalAnnualPercent);
        var debt = principalEuro;

        for (var month = 1; month <= termMonths; month++)
        {
            var isLast = month == termMonths;
            var interestEuro = RoundTo(debt * monthlyRate);
            var principalPart = isLast ? debt : RoundTo(monthlyPayment - interestEuro);
            var paymentEuro = isLast ? RoundTo(interestEuro + principalPart) : monthlyPayment;
            debt = isLast ? 0 : RoundTo(debt - principalPart);
            yield return (paymentEuro, interestEuro);
        }
    }

    private static double RoundTo(double value, int places = 2)
    {
        var factor = Math.Pow(10, places);
        return Math.Round(value * factor, MidpointRounding.AwayFromZero) / factor;
    }

    private static decimal Cents(double value)
    {
        var cents = Math.Round(value * 100d, MidpointRounding.AwayFromZero);
        return (decimal)cents / 100m;
    }
}
