// Models for Motor Quote API

export interface CreateMotorQuoteRequest {
  // Client & Distributor
  clientId: string;
  distributorId?: string;
  
  // Product
  motorProductId: string;
  
  // Period
  policyStartDate: string; // ISO Date
  policyEndDate: string;   // ISO Date
  durationMonths: number;
  
  // Vehicle
  vehicleCategoryId: string;
  vehicleMakeId: string;
  vehicleModelId: string;
  registrationNumber: string;
  chassisNumber: string;
  yearOfManufacture: number;
  horsepower: number; // Puissance fiscale (CV)
  fuelType: string; // "Essence" | "Diesel"
  vehicleValue: number;
  
  // Selected Coverages
  selectedCoverageIds: string[];
  
  // Discounts
  professionalDiscountPercent: number;
  commercialDiscountPercent: number;
  
  // Currency
  currencyId: string;
  
  // Notes
  notes?: string;
}

export interface MotorQuoteResponse {
  id: string;
  quoteNumber: string;
  quoteDate: string;
  expiryDate: string;
  status: string; // "Draft" | "Generated" | "Accepted" | "Rejected" | "Expired"
  
  clientName: string;
  distributorName?: string;
  productName: string;
  
  registrationNumber: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleValue: number;
  
  netPremium: number;
  taxAmount: number;
  policyCostAmount: number;
  totalPremium: number;
  
  currencyCode: string;
  
  createdAt: string;
}

export interface PremiumCalculationRequest {
  vehicleValue: number;
  horsepower: number;
  fuelType: string;
  durationMonths: number;
  selectedCoverageIds: string[];
  professionalDiscountPercent: number;
  commercialDiscountPercent: number;
  currencyId: string;
  distributorId?: string;
}

export interface PremiumCalculationResult {
  basePremium: number;
  sectionsPremium: number;
  subtotal: number;
  totalDiscount: number;
  netPremiumBeforeShortTerm: number;
  shortTermCoefficient: number;
  netPremium: number;
  taxAmount: number;
  policyCostAmount: number;
  totalPremium: number;
  commissionRate: number;
  commissionAmount: number;
  coverageDetails: CoverageCalculation[];
}

export interface CoverageCalculation {
  coverageId: string;
  coverageName: string;
  premiumAmount: number;
}

// Motor Product & Coverage Models
export interface MotorProduct {
  id: string;
  productCode: string;
  productName: string;
  description: string;
  isActive: boolean;
}

export interface MotorCoverage {
  id: string;
  coverageCode: string;
  coverageName: string;
  description: string;
  sectionLetter: string; // "A", "B", "C", etc.
  fixedPremium: number;
  isMandatory: boolean;
  isActive: boolean;
}

// Legacy models (keep for backward compatibility)
export interface CreateQuotationRequest {
  clientId: string;
  startDate: string;
  endDate: string;
  currencyId: string;
  risks: RiskRequest[];
}

export interface RiskRequest {
  registrationNumber: string;
  vehicleCategoryId: string;
  manufactureYear: number;
  fiscalPower: number;
  vehicleValue: number;
  usage: string;
  selectedCoverCodes: string[];
}

export interface QuotationResponse {
  policyId: string;
  quotationNumber: string;
  totalPremium: number;
  status: string;
  risks: RiskResponse[];
}

export interface RiskResponse {
  registrationNumber: string;
  netPremium: number;
  covers: CoverResponse[];
}

export interface CoverResponse {
  coverCode: string;
  coverName: string;
  premiumAmount: number;
  sumInsured: number;
}
