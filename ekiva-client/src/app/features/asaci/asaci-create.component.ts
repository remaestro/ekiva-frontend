import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AsaciService } from '../../core/services/asaci/asaci.service';
import { CreateCertificateRequest } from '../../core/models/asaci/asaci-certificate.model';

@Component({
  selector: 'app-asaci-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './asaci-create.component.html',
  styleUrls: ['./asaci-create.component.scss']
})
export class AsaciCreateComponent implements OnInit {
  certificateForm!: FormGroup;
  loading = false;
  error: string | null = null;
  successMessage: string | null = null;
  maxYear = new Date().getFullYear() + 1;

  constructor(
    private fb: FormBuilder,
    private asaciService: AsaciService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.certificateForm = this.fb.group({
      policyNumber: ['', [Validators.required, Validators.minLength(3)]],
      policyHolderName: ['', [Validators.required, Validators.minLength(2)]],
      policyHolderAddress: ['', Validators.required],
      vehicleRegistration: ['', [Validators.required, Validators.pattern(/^[A-Z0-9-]+$/)]],
      vehicleMake: ['', Validators.required],
      vehicleModel: ['', Validators.required],
      vehicleYear: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear() + 1)]],
      chassisNumber: ['', Validators.required],
      effectiveDate: ['', Validators.required],
      expiryDate: ['', Validators.required],
      coverageType: ['ThirdParty', Validators.required],
      insuranceCompanyName: ['', Validators.required],
      insuranceCompanyCode: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.certificateForm.invalid) {
      this.markFormGroupTouched(this.certificateForm);
      this.error = 'Veuillez remplir tous les champs obligatoires correctement.';
      return;
    }

    this.loading = true;
    this.error = null;
    this.successMessage = null;

    const formValue = this.certificateForm.value;
    const createDto: CreateCertificateRequest = {
      ...formValue,
      effectiveDate: new Date(formValue.effectiveDate),
      expiryDate: new Date(formValue.expiryDate)
    };

    this.asaciService.createCertificate(createDto).subscribe({
      next: (certificate: any) => {
        this.loading = false;
        this.successMessage = `Attestation ${certificate.certificateNumber} créée avec succès !`;
        setTimeout(() => {
          this.router.navigate(['/asaci']);
        }, 2000);
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err.error?.message || 'Une erreur est survenue lors de la création de l\'attestation.';
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/asaci']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.certificateForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.certificateForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'Ce champ est requis';
      if (field.errors['minlength']) return `Minimum ${field.errors['minlength'].requiredLength} caractères`;
      if (field.errors['pattern']) return 'Format invalide';
      if (field.errors['min']) return `Valeur minimale: ${field.errors['min'].min}`;
      if (field.errors['max']) return `Valeur maximale: ${field.errors['max'].max}`;
    }
    return '';
  }
}
