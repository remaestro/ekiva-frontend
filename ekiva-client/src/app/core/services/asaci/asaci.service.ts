import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  ASACICertificate,
  CreateCertificateRequest,
  VerifyCertificateRequest,
  VerificationResult,
  UpdateCertificateStatusRequest,
  CertificateStats,
  CertificateStatus
} from '../../models/asaci/asaci-certificate.model';

@Injectable({
  providedIn: 'root'
})
export class AsaciService {
  private apiUrl = `${environment.apiUrl}/asaci`;

  constructor(private http: HttpClient) {}

  /**
   * Créer une nouvelle attestation ASACI
   */
  createCertificate(request: CreateCertificateRequest): Observable<ASACICertificate> {
    return this.http.post<ASACICertificate>(`${this.apiUrl}/certificates`, request);
  }

  /**
   * Vérifier la validité d'une attestation
   */
  verifyCertificate(request: VerifyCertificateRequest): Observable<VerificationResult> {
    return this.http.post<VerificationResult>(`${this.apiUrl}/certificates/verify`, request);
  }

  /**
   * Obtenir une attestation par son numéro
   */
  getCertificateByNumber(certificateNumber: string): Observable<ASACICertificate> {
    return this.http.get<ASACICertificate>(`${this.apiUrl}/certificates/${certificateNumber}`);
  }

  /**
   * Obtenir toutes les attestations
   */
  getAllCertificates(): Observable<ASACICertificate[]> {
    return this.http.get<ASACICertificate[]>(`${this.apiUrl}/certificates`);
  }

  /**
   * Obtenir toutes les attestations d'une police
   */
  getCertificatesByPolicy(policyId: string): Observable<ASACICertificate[]> {
    return this.http.get<ASACICertificate[]>(`${this.apiUrl}/certificates/policy/${policyId}`);
  }

  /**
   * Mettre à jour le statut d'une attestation
   */
  updateCertificateStatus(certificateId: string, status: CertificateStatus): Observable<ASACICertificate> {
    // Extract certificate number from the certificate (assuming we have access to it)
    // In real implementation, you might need to fetch the certificate first to get its number
    return this.http.put<ASACICertificate>(
      `${this.apiUrl}/certificates/${certificateId}/status`,
      { status }
    );
  }

  /**
   * Suspendre une attestation
   */
  suspendCertificate(certificateNumber: string, reason: string): Observable<ASACICertificate> {
    const request: UpdateCertificateStatusRequest = { reason };
    return this.http.put<ASACICertificate>(
      `${this.apiUrl}/certificates/${certificateNumber}/suspend`,
      request
    );
  }

  /**
   * Annuler une attestation
   */
  cancelCertificate(certificateNumber: string, reason: string): Observable<ASACICertificate> {
    const request: UpdateCertificateStatusRequest = { reason };
    return this.http.put<ASACICertificate>(
      `${this.apiUrl}/certificates/${certificateNumber}/cancel`,
      request
    );
  }

  /**
   * Réactiver une attestation suspendue
   */
  reactivateCertificate(certificateNumber: string): Observable<ASACICertificate> {
    return this.http.put<ASACICertificate>(
      `${this.apiUrl}/certificates/${certificateNumber}/reactivate`,
      {}
    );
  }

  /**
   * Télécharger une attestation en PDF
   */
  downloadCertificate(certificateId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/certificates/${certificateId}/download`, {
      responseType: 'blob'
    });
  }

  /**
   * Obtenir les statistiques des attestations
   */
  getStatistics(): Observable<CertificateStats> {
    return this.http.get<CertificateStats>(`${this.apiUrl}/statistics`);
  }

  /**
   * Obtenir les attestations qui expirent bientôt
   */
  getExpiringCertificates(days: number = 30): Observable<ASACICertificate[]> {
    const params = new HttpParams().set('days', days.toString());
    return this.http.get<ASACICertificate[]>(`${this.apiUrl}/certificates/expiring`, { params });
  }
}
