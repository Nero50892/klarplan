export interface LoanOffer {
  id: string;
  bankName: string;
  productName: string;
  nominalAnnualPercent: number;
  effectiveAnnualPercent: number;
  termMonths: number;
  principalEuro: number;
  monthlyPaymentEuro: number;
  isDemo: boolean;
  disclaimer: string;
}

export type OfferLoadStatus = 'leer' | 'laedt' | 'fehler' | 'bereit';
