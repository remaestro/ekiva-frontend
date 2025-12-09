import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AsaciService } from '../../core/services/asaci/asaci.service';
import { ASACICertificate, CertificateStatus } from '../../core/models/asaci/asaci-certificate.model';

@Component({
  selector: 'app-asaci-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './asaci-list.component.html',
  styleUrls: ['./asaci-list.component.scss']
})
export class AsaciListComponent implements OnInit {
  certificates: ASACICertificate[] = [];
  filteredCertificates: ASACICertificate[] = [];
  loading = false;
  error: string | null = null;
  searchTerm = '';
  selectedStatus: string = 'all';
  CertificateStatus = CertificateStatus;

  constructor(private asaciService: AsaciService) {}

  ngOnInit(): void {
    this.loadCertificates();
  }

  loadCertificates(): void {
    this.loading = true;
    this.asaciService.getAllCertificates().subscribe({
      next: (data: ASACICertificate[]) => {
        this.certificates = data;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err.error?.message || 'Erreur lors du chargement des attestations';
        this.loading = false;
      }
    });
  }

  filterCertificates(): void {
    this.filteredCertificates = this.certificates.filter(cert => {
      const matchesSearch = !this.searchTerm || 
        cert.certificateNumber.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        cert.vehicleRegistration.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        cert.policyHolderName.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = this.selectedStatus === 'all' || cert.status === this.selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
  }

  onSearchChange(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.filterCertificates();
  }

  onStatusChange(event: Event): void {
    this.selectedStatus = (event.target as HTMLSelectElement).value;
    this.filterCertificates();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case CertificateStatus.Active:
        return 'bg-green-100 text-green-800';
      case CertificateStatus.Suspended:
        return 'bg-yellow-100 text-yellow-800';
      case CertificateStatus.Cancelled:
        return 'bg-red-100 text-red-800';
      case CertificateStatus.Expired:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getExpiryClass(daysUntilExpiry: number): string {
    if (daysUntilExpiry < 0) return 'text-red-600 font-semibold';
    if (daysUntilExpiry <= 30) return 'text-orange-600 font-semibold';
    return 'text-gray-600';
  }

  suspendCertificate(certificateNumber: string): void {
    const reason = prompt('Raison de la suspension:');
    if (!reason) return;

    this.asaciService.suspendCertificate(certificateNumber, reason).subscribe({
      next: () => {
        this.loadCertificates();
      },
      error: (err: any) => {
        alert('Erreur lors de la suspension');
      }
    });
  }

  cancelCertificate(certificateNumber: string): void {
    const reason = prompt('Raison de l\'annulation:');
    if (!reason) return;

    const confirm = window.confirm('Êtes-vous sûr de vouloir annuler cette attestation ?');
    if (!confirm) return;

    this.asaciService.cancelCertificate(certificateNumber, reason).subscribe({
      next: () => {
        this.loadCertificates();
      },
      error: (err: any) => {
        alert('Erreur lors de l\'annulation');
      }
    });
  }

  reactivateCertificate(certificateNumber: string): void {
    this.asaciService.reactivateCertificate(certificateNumber).subscribe({
      next: () => {
        this.loadCertificates();
      },
      error: (err: any) => {
        alert('Erreur lors de la réactivation');
      }
    });
  }
}
