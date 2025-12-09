import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  DashboardStats,
  PolicyStats,
  ClientStats,
  RevenueStats,
  DistributorStats,
  ClaimStats,
  ActivityLog,
  SystemConfiguration,
  ReportRequest,
  ReportResponse,
  UserActivityResponse
} from '../models/admin.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  /**
   * Obtenir toutes les statistiques du dashboard
   */
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard/stats`);
  }

  /**
   * Obtenir les statistiques des polices
   */
  getPolicyStats(startDate?: Date, endDate?: Date): Observable<PolicyStats> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate.toISOString());
    if (endDate) params = params.set('endDate', endDate.toISOString());
    return this.http.get<PolicyStats>(`${this.apiUrl}/stats/policies`, { params });
  }

  /**
   * Obtenir les statistiques des clients
   */
  getClientStats(startDate?: Date, endDate?: Date): Observable<ClientStats> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate.toISOString());
    if (endDate) params = params.set('endDate', endDate.toISOString());
    return this.http.get<ClientStats>(`${this.apiUrl}/stats/clients`, { params });
  }

  /**
   * Obtenir les statistiques de revenus
   */
  getRevenueStats(startDate?: Date, endDate?: Date): Observable<RevenueStats> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate.toISOString());
    if (endDate) params = params.set('endDate', endDate.toISOString());
    return this.http.get<RevenueStats>(`${this.apiUrl}/stats/revenue`, { params });
  }

  /**
   * Obtenir les statistiques des distributeurs
   */
  getDistributorStats(): Observable<DistributorStats> {
    return this.http.get<DistributorStats>(`${this.apiUrl}/stats/distributors`);
  }

  /**
   * Obtenir les statistiques des sinistres
   */
  getClaimStats(startDate?: Date, endDate?: Date): Observable<ClaimStats> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate.toISOString());
    if (endDate) params = params.set('endDate', endDate.toISOString());
    return this.http.get<ClaimStats>(`${this.apiUrl}/stats/claims`, { params });
  }

  /**
   * Générer un rapport
   */
  generateReport(request: ReportRequest): Observable<ReportResponse> {
    return this.http.post<ReportResponse>(`${this.apiUrl}/reports/generate`, request);
  }

  /**
   * Obtenir les logs d'activité
   */
  getActivityLogs(page: number = 1, pageSize: number = 50): Observable<ActivityLog[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<ActivityLog[]>(`${this.apiUrl}/activity-logs`, { params });
  }

  /**
   * Obtenir l'activité des utilisateurs
   */
  getUserActivities(): Observable<UserActivityResponse[]> {
    return this.http.get<UserActivityResponse[]>(`${this.apiUrl}/user-activities`);
  }

  /**
   * Obtenir la configuration système
   */
  getSystemConfiguration(): Observable<SystemConfiguration> {
    return this.http.get<SystemConfiguration>(`${this.apiUrl}/configuration`);
  }

  /**
   * Mettre à jour la configuration système
   */
  updateSystemConfiguration(config: SystemConfiguration): Observable<SystemConfiguration> {
    return this.http.put<SystemConfiguration>(`${this.apiUrl}/configuration`, config);
  }
}
