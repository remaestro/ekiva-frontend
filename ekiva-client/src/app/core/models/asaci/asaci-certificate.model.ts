/**
 * Statut d'une attestation ASACI
 */
export enum CertificateStatus {
  Active = 'Active',
  Suspended = 'Suspended',
  Cancelled = 'Cancelled',
  Expired = 'Expired'
}

/**
 * Attestation d'assurance ASACI
 */
export interface ASACICertificate {
  id: string;
  certificateNumber: string;
  policyId: string;
  vehicleRegistration: string;
  vehicleMake: string;
  vehicleModel: string;
  chassisNumber: string;
  policyHolderName: string;
  policyHolderAddress: string;
  policyHolderPhone: string;
  effectiveDate: Date;
  expiryDate: Date;
  status: string;
  issuedDate: Date;
  insuranceCompanyName: string;
  coverageType: string;
  isValid: boolean;
  daysUntilExpiry: number;
}

/**
 * Requête de création d'une attestation
 */
export interface CreateCertificateRequest {
  policyId: string;
  vehicleRegistration: string;
  vehicleMake: string;
  vehicleModel: string;
  chassisNumber: string;
  policyHolderName: string;
  policyHolderAddress: string;
  policyHolderPhone: string;
  effectiveDate: Date;
  expiryDate: Date;
  coverageType: string;
}

/**
 * Requête de vérification d'une attestation
 */
export interface VerifyCertificateRequest {
  certificateNumber: string;
  vehicleRegistration?: string;
}

/**
 * Résultat de vérification
 */
export interface VerificationResult {
  isValid: boolean;
  certificateNumber: string;
  status: string;
  statusMessage?: string;
  certificate?: ASACICertificate;
}

/**
 * Requête de changement de statut
 */
export interface UpdateCertificateStatusRequest {
  reason: string;
}

/**
 * Statistiques des attestations
 */
export interface CertificateStats {
  totalCertificates: number;
  activeCertificates: number;
  suspendedCertificates: number;
  cancelledCertificates: number;
  expiredCertificates: number;
  expiringIn30Days: number;
  byMonth: CertificateByMonth[];
}

export interface CertificateByMonth {
  month: string;
  count: number;
}
