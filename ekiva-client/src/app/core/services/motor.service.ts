import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  CreateMotorQuoteRequest, 
  MotorQuoteResponse, 
  PremiumCalculationRequest, 
  PremiumCalculationResult,
  MotorProduct,
  MotorCoverage
} from '../models/motor.model';

@Injectable({
  providedIn: 'root'
})
export class MotorService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/motor`;

  // Motor Quote endpoints
  createQuote(request: CreateMotorQuoteRequest): Observable<MotorQuoteResponse> {
    return this.http.post<MotorQuoteResponse>(`${this.apiUrl}/quotes`, request);
  }

  getQuote(id: string): Observable<MotorQuoteResponse> {
    return this.http.get<MotorQuoteResponse>(`${this.apiUrl}/quotes/${id}`);
  }

  getQuotesByClient(clientId: string): Observable<MotorQuoteResponse[]> {
    return this.http.get<MotorQuoteResponse[]>(`${this.apiUrl}/quotes/client/${clientId}`);
  }

  acceptQuote(id: string): Observable<MotorQuoteResponse> {
    return this.http.post<MotorQuoteResponse>(`${this.apiUrl}/quotes/${id}/accept`, {});
  }

  rejectQuote(id: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.apiUrl}/quotes/${id}/reject`, {});
  }

  calculatePremium(request: PremiumCalculationRequest): Observable<PremiumCalculationResult> {
    return this.http.post<PremiumCalculationResult>(`${this.apiUrl}/calculate-premium`, request);
  }

  // Motor Products & Coverages (if you add these endpoints later)
  getMotorProducts(): Observable<MotorProduct[]> {
    return this.http.get<MotorProduct[]>(`${this.apiUrl}/products`);
  }

  getMotorCoverages(): Observable<MotorCoverage[]> {
    return this.http.get<MotorCoverage[]>(`${this.apiUrl}/coverages`);
  }

  getProductCoverages(productId: string): Observable<MotorCoverage[]> {
    return this.http.get<MotorCoverage[]>(`${this.apiUrl}/products/${productId}/coverages`);
  }
}
