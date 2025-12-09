/**
 * Dashboard statistics overview
 */
export interface DashboardStats {
  policies: PolicyStats;
  clients: ClientStats;
  revenue: RevenueStats;
  distributors: DistributorStats;
  claims: ClaimStats;
  certificates: CertificateStats;
}

/**
 * Policy statistics
 */
export interface PolicyStats {
  totalPolicies: number;
  activePolicies: number;
  pendingPolicies: number;
  expiredPolicies: number;
  cancelledPolicies: number;
  growthRate: number;
  byProduct: PolicyByProduct[];
  byMonth: PolicyByMonth[];
}

export interface PolicyByProduct {
  productType: string;
  count: number;
  totalPremium: number;
}

export interface PolicyByMonth {
  month: string;
  count: number;
  totalPremium: number;
}

/**
 * Client statistics
 */
export interface ClientStats {
  totalClients: number;
  individualClients: number;
  corporateClients: number;
  newClientsThisMonth: number;
  growthRate: number;
  byMonth: ClientByMonth[];
}

export interface ClientByMonth {
  month: string;
  count: number;
}

/**
 * Revenue statistics
 */
export interface RevenueStats {
  totalRevenue: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  growthRate: number;
  totalCommissions: number;
  totalTaxes: number;
  netRevenue: number;
  byMonth: RevenueByMonth[];
  byProduct: RevenueByProduct[];
}

export interface RevenueByMonth {
  month: string;
  grossPremium: number;
  netPremium: number;
  commissions: number;
  taxes: number;
}

export interface RevenueByProduct {
  productType: string;
  amount: number;
  percentage: number;
}

/**
 * Distributor statistics
 */
export interface DistributorStats {
  totalDistributors: number;
  activeDistributors: number;
  internalAgents: number;
  brokers: number;
  generalAgents: number;
  topDistributors: TopDistributor[];
}

export interface TopDistributor {
  distributorId: string;
  name: string;
  type: string;
  policiesCount: number;
  totalPremium: number;
  totalCommission: number;
}

/**
 * Claim statistics
 */
export interface ClaimStats {
  totalClaims: number;
  pendingClaims: number;
  approvedClaims: number;
  rejectedClaims: number;
  totalClaimAmount: number;
  paidClaimAmount: number;
  averageClaimAmount: number;
  byMonth: ClaimByMonth[];
}

export interface ClaimByMonth {
  month: string;
  count: number;
  amount: number;
}

/**
 * Certificate statistics
 */
export interface CertificateStats {
  totalCertificates: number;
  activeCertificates: number;
  suspendedCertificates: number;
  cancelledCertificates: number;
  expiredCertificates: number;
  expiringIn30Days: number;
}

/**
 * Activity log
 */
export interface ActivityLog {
  id: string;
  timestamp: Date;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  description: string;
  ipAddress: string;
}

/**
 * System configuration
 */
export interface SystemConfiguration {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyWebsite: string;
  companyLogo: string;
  currency: string;
  timeZone: string;
  dateFormat: string;
  policyNumberPrefix: number;
  certificateNumberPrefix: number;
}

/**
 * Report request
 */
export interface ReportRequest {
  reportType: string;
  startDate: Date;
  endDate: Date;
  productType?: string;
  distributorId?: string;
  groupBy?: string;
  format?: string;
}

/**
 * Report response
 */
export interface ReportResponse {
  reportType: string;
  generatedAt: Date;
  startDate: Date;
  endDate: Date;
  data: any;
  summary: ReportSummary;
}

export interface ReportSummary {
  totalRecords: number;
  totalAmount: number;
  aggregates: { [key: string]: number };
}

/**
 * User activity
 */
export interface UserActivityResponse {
  userId: string;
  userName: string;
  email: string;
  lastLogin: Date;
  totalPoliciesCreated: number;
  totalQuotesCreated: number;
  totalClientsCreated: number;
  totalRevenue: number;
}
