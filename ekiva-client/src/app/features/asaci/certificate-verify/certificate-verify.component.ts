import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AsaciService } from '../../../core/services/asaci/asaci.service';
import { VerifyCertificateRequest, VerificationResult } from '../../../core/models/asaci/asaci-certificate.model';

@Component({
  selector: 'app-certificate-verify',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './certificate-verify.component.html',
  styleUrls: ['./certificate-verify.component.scss']
})
export class CertificateVerifyComponent {
  certificateNumber = '';
  vehicleRegistration = '';
  verificationResult: VerificationResult | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(private asaciService: AsaciService) {}

  verifyCertificate(): void {
    if (!this.certificateNumber.trim()) {
      this.errorMessage = 'Veuillez entrer un numéro d\'attestation';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.verificationResult = null;

    const request: VerifyCertificateRequest = {
      certificateNumber: this.certificateNumber.trim(),
      vehicleRegistration: this.vehicleRegistration.trim() || undefined
    };

    this.asaciService.verifyCertificate(request).subscribe({
      next: (result) => {
        this.verificationResult = result;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la vérification. Veuillez réessayer.';
        this.isLoading = false;
        console.error('Verification error:', error);
      }
    });
  }

  reset(): void {
    this.certificateNumber = '';
    this.vehicleRegistration = '';
    this.verificationResult = null;
    this.errorMessage = '';
  }

  getStatusColor(): string {
    if (!this.verificationResult) return '';
    
    if (this.verificationResult.isValid) return 'success';
    if (this.verificationResult.status === 'NotFound') return 'error';
    if (this.verificationResult.status === 'Expired') return 'warning';
    return 'error';
  }

  getStatusIcon(): string {
    if (!this.verificationResult) return '';
    
    if (this.verificationResult.isValid) return '✓';
    if (this.verificationResult.status === 'NotFound') return '✗';
    if (this.verificationResult.status === 'Expired') return '⚠';
    return '✗';
  }
}
