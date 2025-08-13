export interface RateType {
  id: string;
  label: string;
}

export interface InterestRate {
  A: string;
  B: string;
  C: string;
  D: string;
}

export interface SingleFixedRate {
  fixedPeriod: string;
  minTenor: string;
  rates: InterestRate;
}

export interface FixedBerjenjangRate {
  fixedPeriod: string;
  minTenor: string;
  rates: InterestRate;
}

export interface Fees {
  provisi: string;
  administrasi: string;
}

export interface InterestRatesData {
  rateTypes: RateType[];
  singleFixed: SingleFixedRate[];
  fixedBerjenjang: FixedBerjenjangRate[];
  fees: Fees;
}

export interface DocumentRequirement {
  name: string;
  pegawai: boolean;
  profesional: boolean;
  pengusaha: boolean;
}

export type TabType = "single-fixed" | "fixed-berjenjang";
export type RateTypeId = "A" | "B" | "C" | "D";