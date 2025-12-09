import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CommissionCalculationRequest,
  CommissionCalculationResponse,
  CommissionRate,
  CreateCommissionRateRequest,
  UpdateCommissionRateRequest,
  CommissionStats
} from '../models/commission.model';

@Injectable({
  providedIn: 'root'
})
export class CommissionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/commissions`;

  /**
   * Calculer la commission pour un devis/police
   */
  calculate(request: CommissionCalculationRequest): Observable<CommissionCalculationResponse> {
    return this.http.post<CommissionCalculationResponse>(`${this.apiUrl}/calculate`, request);
  }

  /**
   * Obtenir le taux de commission pour un distributeur et un produit
   */
  getRate(distributorType: string, productType: string): Observable<{ rate: number; ratePercentage: number }> {
    return this.http.get<{ rate: number; ratePercentage: number }>(
      `${this.apiUrl}/rate?distributorType=${distributorType}&productType=${productType}`
    );
  }

  /**
   * Obtenir tous les taux de commission configurés
   */
  getAllRates(): Observable<CommissionRate[]> {
    return this.http.get<CommissionRate[]>(`${this.apiUrl}/rates`);
  }

  /**
   * Obtenir un taux de commission par ID
   */
  getRateById(id: string): Observable<CommissionRate> {
    return this.http.get<CommissionRate>(`${this.apiUrl}/rates/${id}`);
  }

  /**
   * Créer un nouveau taux de commission
   */
  createRate(request: CreateCommissionRateRequest): Observable<CommissionRate> {
    return this.http.post<CommissionRate>(`${this.apiUrl}/rates`, request);
  }

  /**
   * Mettre à jour un taux de commission
   */
  updateRate(id: string, request: UpdateCommissionRateRequest): Observable<CommissionRate> {
    return this.http.put<CommissionRate>(`${this.apiUrl}/rates/${id}`, request);
  }

  /**
   * Supprimer un taux de commission
   */
  deleteRate(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/rates/${id}`);
  }

  /**
   * Obtenir les statistiques des commissions
   */
  getStats(): Observable<CommissionStats> {
    return this.http.get<CommissionStats>(`${this.apiUrl}/stats`);
  }
}
