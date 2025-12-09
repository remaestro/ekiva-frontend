import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AsaciService } from '../../../core/services/asaci/asaci.service';
import { ASACICertificate, CertificateStatus } from '../../../core/models/asaci/asaci-certificate.model';

@Component({
  selector: 'app-certificate-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './certificate-list.html',
  styleUrl: './certificate-list.scss',
})
export class CertificateList implements OnInit {
  certificates: ASACICertificate[] = [];
  filteredCertificates: ASACICertificate[] = [];
  isLoading = false;
  error: string | null = null;

  // Filtres
  searchTerm = '';
  selectedStatus: CertificateStatus | '' = '';
  dateFrom = '';
  dateTo = '';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;
  paginatedCertificates: ASACICertificate[] = [];

  // Statistiques
  stats = {
    total: 0,
    active: 0,
    suspended: 0,
    cancelled: 0,
    expired: 0
  };

  // Enum pour le template
  CertificateStatus = CertificateStatus;

  constructor(
    private asaciService: AsaciService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCertificates();
  }

  loadCertificates(): void {
    this.isLoading = true;
    this.error = null;

    this.asaciService.getAllCertificates().subscribe({
      next: (certificates: ASACICertificate[]) => {
        this.certificates = certificates;
        this.calculateStats();
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading certificates:', error);
        this.error = 'Erreur lors du chargement des attestations';
        this.isLoading = false;
      }
    });
  }

  calculateStats(): void {
    this.stats.total = this.certificates.length;
    this.stats.active = this.certificates.filter(c => c.status === CertificateStatus.Active).length;
    this.stats.suspended = this.certificates.filter(c => c.status === CertificateStatus.Suspended).length;
    this.stats.cancelled = this.certificates.filter(c => c.status === CertificateStatus.Cancelled).length;
    this.stats.expired = this.certificates.filter(c => c.status === CertificateStatus.Expired).length;
  }

  applyFilters(): void {
    let filtered = [...this.certificates];

    // Filtre par terme de recherche
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(cert =>
        cert.certificateNumber.toLowerCase().includes(term) ||
        cert.policyHolderName.toLowerCase().includes(term) ||
        cert.vehicleRegistration.toLowerCase().includes(term)
      );
    }

    // Filtre par statut
    if (this.selectedStatus) {
      filtered = filtered.filter(cert => cert.status === this.selectedStatus);
    }

    // Filtre par date de début
    if (this.dateFrom) {
      const fromDate = new Date(this.dateFrom);
      filtered = filtered.filter(cert => new Date(cert.issuedDate) >= fromDate);
    }

    // Filtre par date de fin
    if (this.dateTo) {
      const toDate = new Date(this.dateTo);
      filtered = filtered.filter(cert => new Date(cert.issuedDate) <= toDate);
    }

    this.filteredCertificates = filtered;
    this.totalPages = Math.ceil(this.filteredCertificates.length / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedCertificates = this.filteredCertificates.slice(startIndex, endIndex);
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onStatusChange(): void {
    this.applyFilters();
  }

  onDateChange(): void {
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.dateFrom = '';
    this.dateTo = '';
    this.applyFilters();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  viewCertificate(certificate: ASACICertificate): void {
    this.router.navigate(['/asaci/view', certificate.id]);
  }

  editCertificate(certificate: ASACICertificate): void {
    this.router.navigate(['/asaci/edit', certificate.id]);
  }

  suspendCertificate(certificate: ASACICertificate): void {
    if (!confirm(`Êtes-vous sûr de vouloir suspendre l'attestation ${certificate.certificateNumber} ?`)) {
      return;
    }

    const reason = prompt('Raison de la suspension:');
    if (!reason) return;

    this.asaciService.suspendCertificate(certificate.certificateNumber, reason).subscribe({
      next: () => {
        this.loadCertificates();
      },
      error: (error: any) => {
        console.error('Error suspending certificate:', error);
        alert('Erreur lors de la suspension');
      }
    });
  }

  reactivateCertificate(certificate: ASACICertificate): void {
    if (!confirm(`Êtes-vous sûr de vouloir réactiver l'attestation ${certificate.certificateNumber} ?`)) {
      return;
    }

    this.asaciService.reactivateCertificate(certificate.certificateNumber).subscribe({
      next: () => {
        this.loadCertificates();
      },
      error: (error: any) => {
        console.error('Error reactivating certificate:', error);
        alert('Erreur lors de la réactivation');
      }
    });
  }

  cancelCertificate(certificate: ASACICertificate): void {
    if (!confirm(`Êtes-vous sûr de vouloir annuler l'attestation ${certificate.certificateNumber} ? Cette action est irréversible.`)) {
      return;
    }

    const reason = prompt('Raison de l\'annulation:');
    if (!reason) return;

    this.asaciService.cancelCertificate(certificate.certificateNumber, reason).subscribe({
      next: () => {
        this.loadCertificates();
      },
      error: (error: any) => {
        console.error('Error cancelling certificate:', error);
        alert('Erreur lors de l\'annulation');
      }
    });
  }

  downloadCertificate(certificate: ASACICertificate): void {
    this.asaciService.downloadCertificate(certificate.id).subscribe({
      next: (blob: any) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${certificate.certificateNumber}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error: any) => {
        console.error('Error downloading certificate:', error);
        alert('Erreur lors du téléchargement');
      }
    });
  }

  exportToExcel(): void {
    // TODO: Implémenter l'export Excel
    console.log('Export to Excel not implemented yet');
    alert('Fonctionnalité d\'export Excel à venir');
  }

  getStatusClass(status: string): string {
    switch (status) {
      case CertificateStatus.Active:
        return 'status-active';
      case CertificateStatus.Suspended:
        return 'status-suspended';
      case CertificateStatus.Cancelled:
        return 'status-cancelled';
      case CertificateStatus.Expired:
        return 'status-expired';
      default:
        return '';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case CertificateStatus.Active:
        return 'Active';
      case CertificateStatus.Suspended:
        return 'Suspendue';
      case CertificateStatus.Cancelled:
        return 'Annulée';
      case CertificateStatus.Expired:
        return 'Expirée';
      default:
        return '';
    }
  }

  isExpired(expiryDate: Date): boolean {
    return new Date(expiryDate) < new Date();
  }

  getDaysUntilExpiry(expiryDate: Date): number {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
}
