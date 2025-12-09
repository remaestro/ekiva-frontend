import { DistributorType } from './distributor.model';

export enum ProductType {
  Motor = 'Motor',
  Fire = 'Fire',
  Liability = 'Liability',
  Transport = 'Transport',
  Health = 'Health',
  Life = 'Life'
}

// Commission Calculation Models
export interface CommissionCalculationRequest {
  netPremium: number;
  lifePremium?: number;
  distributorType: DistributorType;
  productType: ProductType;
  distributorId?: string;
}

export interface CommissionCalculationResponse {
  netPremium: number;
  lifePremium: number;
  commissionableAmount: number;
  commissionRate: number;
  commissionRatePercentage: number;
  commissionAmount: number;
  distributorType: DistributorType;
  distributorTypeLabel: string;
  productType: ProductType;
  hasMandateTax: boolean;
  mandateTaxRate: number;
  mandateTaxAmount: number;
  netCommission: number;
}

// Commission Rate Models
export interface CommissionRate {
  id: string;
  distributorType: string;
  productType: string;
  rate: number;
  ratePercentage: number;
  description: string;
  createdAt: Date;
}

export interface CreateCommissionRateRequest {
  distributorType: string;
  productType: string;
  rate: number;
  description: string;
}

export interface UpdateCommissionRateRequest extends CreateCommissionRateRequest {}

export interface CommissionStats {
  totalRates: number;
  byDistributorType: Array<{ distributorType: string; count: number }>;
  byProductType: Array<{ productType: string; count: number }>;
  averageRate: number;
  averageRatePercentage: number;
}
