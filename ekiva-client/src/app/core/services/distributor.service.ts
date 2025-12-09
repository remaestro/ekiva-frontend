import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Distributor,
  CreateDistributorRequest,
  UpdateDistributorRequest,
  DistributorSearchRequest,
  DistributorSearchResponse,
  DistributorStats
} from '../models/distributor.model';

@Injectable({
  providedIn: 'root'
})
export class DistributorService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/distributors`;

  getAll(): Observable<Distributor[]> {
    return this.http.get<Distributor[]>(this.apiUrl);
  }

  search(request: DistributorSearchRequest): Observable<DistributorSearchResponse> {
    return this.http.post<DistributorSearchResponse>(`${this.apiUrl}/search`, request);
  }

  getById(id: string): Observable<Distributor> {
    return this.http.get<Distributor>(`${this.apiUrl}/${id}`);
  }

  create(request: CreateDistributorRequest): Observable<Distributor> {
    return this.http.post<Distributor>(this.apiUrl, request);
  }

  update(id: string, request: UpdateDistributorRequest): Observable<Distributor> {
    return this.http.put<Distributor>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  toggleStatus(id: string): Observable<Distributor> {
    return this.http.patch<Distributor>(`${this.apiUrl}/${id}/toggle-status`, {});
  }

  getStats(): Observable<DistributorStats> {
    return this.http.get<DistributorStats>(`${this.apiUrl}/stats`);
  }

  getActiveDistributors(): Observable<Distributor[]> {
    return this.http.get<Distributor[]>(`${this.apiUrl}/active`);
  }
}
