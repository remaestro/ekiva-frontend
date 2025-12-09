import { ProductType } from './commission.model';

// Tax Calculation Models
export interface TaxCalculationRequest {
  netPremium: number;
  productType: ProductType;
}

export interface TaxCalculationResponse {
  netPremium: number;
  productType: ProductType;
  productTypeLabel: string;
  taxes: TaxItem[];
  totalTaxAmount: number;
  grossPremium: number;
}

export interface TaxItem {
  taxName: string;
  rate: number;
  ratePercentage: number;
  amount: number;
  isFee: boolean;
}

// Product Tax Rate Models
export interface ProductTaxRate {
  id: string;
  productType: string;
  taxName: string;
  rate: number;
  ratePercentage: number;
  isFee: boolean;
  createdAt: Date;
}

export interface CreateProductTaxRateRequest {
  productType: string;
  taxName: string;
  rate: number;
  isFee: boolean;
}

export interface UpdateProductTaxRateRequest extends CreateProductTaxRateRequest {}

export interface TaxStats {
  totalRates: number;
  byProductType: Array<{ productType: string; count: number }>;
  taxesCount: number;
  feesCount: number;
  averageRate: number;
  averageRatePercentage: number;
}
