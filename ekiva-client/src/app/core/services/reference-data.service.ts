import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Currency, ProfessionalCategory, VehicleCategory, VehicleMake } from '../models/reference-data.model';

@Injectable({
  providedIn: 'root'
})
export class ReferenceDataService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/referencedata`;

  // Cache observables to avoid repeated API calls for static data
  private vehicleMakes$?: Observable<VehicleMake[]>;
  private vehicleCategories$?: Observable<VehicleCategory[]>;
  private currencies$?: Observable<Currency[]>;
  private profCategories$?: Observable<ProfessionalCategory[]>;

  getVehicleMakes(): Observable<VehicleMake[]> {
    if (!this.vehicleMakes$) {
      this.vehicleMakes$ = this.http.get<VehicleMake[]>(`${this.apiUrl}/vehicle-makes`).pipe(
        shareReplay(1)
      );
    }
    return this.vehicleMakes$;
  }

  getVehicleCategories(): Observable<VehicleCategory[]> {
    if (!this.vehicleCategories$) {
      this.vehicleCategories$ = this.http.get<VehicleCategory[]>(`${this.apiUrl}/vehicle-categories`).pipe(
        shareReplay(1)
      );
    }
    return this.vehicleCategories$;
  }

  getCurrencies(): Observable<Currency[]> {
    if (!this.currencies$) {
      this.currencies$ = this.http.get<Currency[]>(`${this.apiUrl}/currencies`).pipe(
        shareReplay(1)
      );
    }
    return this.currencies$;
  }

  getProfessionalCategories(): Observable<ProfessionalCategory[]> {
    if (!this.profCategories$) {
      this.profCategories$ = this.http.get<ProfessionalCategory[]>(`${this.apiUrl}/professional-categories`).pipe(
        shareReplay(1)
      );
    }
    return this.profCategories$;
  }
}
