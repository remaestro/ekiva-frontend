import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  TaxCalculationRequest,
  TaxCalculationResponse,
  ProductTaxRate,
  CreateProductTaxRateRequest,
  UpdateProductTaxRateRequest,
  TaxStats
} from '../models/tax.model';

@Injectable({
  providedIn: 'root'
})
export class TaxService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/taxes`;

  /**
   * Calculer les taxes et frais pour un produit
   */
  calculate(request: TaxCalculationRequest): Observable<TaxCalculationResponse> {
    return this.http.post<TaxCalculationResponse>(`${this.apiUrl}/calculate`, request);
  }

  /**
   * Obtenir les taux de taxes pour un produit
   */
  getRatesForProduct(productType: string): Observable<ProductTaxRate[]> {
    return this.http.get<ProductTaxRate[]>(`${this.apiUrl}/rates/${productType}`);
  }

  /**
   * Obtenir tous les taux de taxes configurés
   */
  getAllRates(): Observable<ProductTaxRate[]> {
    return this.http.get<ProductTaxRate[]>(`${this.apiUrl}/rates`);
  }

  /**
   * Obtenir un taux de taxe par ID
   */
  getRateById(id: string): Observable<ProductTaxRate> {
    return this.http.get<ProductTaxRate>(`${this.apiUrl}/rates/detail/${id}`);
  }

  /**
   * Créer un nouveau taux de taxe
   */
  createRate(request: CreateProductTaxRateRequest): Observable<ProductTaxRate> {
    return this.http.post<ProductTaxRate>(`${this.apiUrl}/rates`, request);
  }

  /**
   * Mettre à jour un taux de taxe
   */
  updateRate(id: string, request: UpdateProductTaxRateRequest): Observable<ProductTaxRate> {
    return this.http.put<ProductTaxRate>(`${this.apiUrl}/rates/${id}`, request);
  }

  /**
   * Supprimer un taux de taxe
   */
  deleteRate(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/rates/${id}`);
  }

  /**
   * Obtenir les statistiques des taxes
   */
  getStats(): Observable<TaxStats> {
    return this.http.get<TaxStats>(`${this.apiUrl}/stats`);
  }
}
