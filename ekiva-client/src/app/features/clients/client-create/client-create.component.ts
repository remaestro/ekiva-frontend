import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ClientService } from '../../../core/services/client.service';
import { CreateClientRequest, ClientType } from '../../../core/models/client.model';

@Component({
  selector: 'app-client-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="bg-white shadow rounded-lg p-6">
      <div class="mb-6 border-b border-gray-200 pb-4">
        <h2 class="text-lg font-medium text-gray-900">Nouveau Client</h2>
        <p class="text-sm text-gray-500">Remplissez les informations ci-dessous pour créer un nouveau client.</p>
      </div>

      <form [formGroup]="clientForm" (ngSubmit)="onSubmit()" class="space-y-6">
        
        <!-- Client Type Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Type de Client</label>
          <div class="flex space-x-4">
            <label class="inline-flex items-center">
              <input type="radio" formControlName="type" value="Individual" class="form-radio text-blue-600">
              <span class="ml-2">Particulier</span>
            </label>
            <label class="inline-flex items-center">
              <input type="radio" formControlName="type" value="Company" class="form-radio text-blue-600">
              <span class="ml-2">Entreprise</span>
            </label>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Common Fields -->
          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" formControlName="email" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border">
          </div>

          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700">Téléphone</label>
            <input type="text" formControlName="phoneNumber" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border">
          </div>

          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700">Adresse</label>
            <input type="text" formControlName="address" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border">
          </div>

          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700">Ville</label>
            <input type="text" formControlName="city" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border">
          </div>
        </div>

        <!-- Individual Specific Fields -->
        <div *ngIf="isIndividual" class="border-t border-gray-200 pt-6 mt-6">
          <h3 class="text-md font-medium text-gray-900 mb-4">Informations Personnelles</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700">Prénom</label>
              <input type="text" formControlName="firstName" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border">
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700">Nom</label>
              <input type="text" formControlName="lastName" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border">
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700">Date de Naissance</label>
              <input type="date" formControlName="dateOfBirth" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border">
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700">Profession</label>
              <input type="text" formControlName="profession" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border">
            </div>
          </div>
        </div>

        <!-- Company Specific Fields -->
        <div *ngIf="!isIndividual" class="border-t border-gray-200 pt-6 mt-6">
          <h3 class="text-md font-medium text-gray-900 mb-4">Informations Entreprise</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700">Raison Sociale</label>
              <input type="text" formControlName="companyName" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border">
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700">NIF (Numéro d'Identification Fiscale)</label>
              <input type="text" formControlName="taxId" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border">
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700">Registre de Commerce</label>
              <input type="text" formControlName="tradeRegister" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border">
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700">Personne de Contact</label>
              <input type="text" formControlName="contactPersonName" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border">
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
          <button type="button" routerLink="/clients" class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Annuler
          </button>
          <button type="submit" [disabled]="clientForm.invalid || isSubmitting" class="bg-blue-900 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
            {{ isSubmitting ? 'Enregistrement...' : 'Enregistrer' }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class ClientCreateComponent {
  private fb = inject(FormBuilder);
  private clientService = inject(ClientService);
  private router = inject(Router);

  clientForm = this.fb.group({
    type: ['Individual', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    
    // Individual
    firstName: [''],
    lastName: [''],
    dateOfBirth: [''],
    profession: [''],
    
    // Company
    companyName: [''],
    taxId: [''],
    tradeRegister: [''],
    contactPersonName: ['']
  });

  isSubmitting = false;

  get isIndividual(): boolean {
    return this.clientForm.get('type')?.value === 'Individual';
  }

  onSubmit() {
    if (this.clientForm.invalid) return;

    this.isSubmitting = true;
    const formValue = this.clientForm.value;

    // Cast to CreateClientRequest - in a real app, we might want to clean up empty fields based on type
    const request: CreateClientRequest = {
      type: formValue.type as ClientType,
      email: formValue.email!,
      phoneNumber: formValue.phoneNumber!,
      address: formValue.address!,
      city: formValue.city!,
      
      firstName: formValue.firstName || undefined,
      lastName: formValue.lastName || undefined,
      dateOfBirth: formValue.dateOfBirth ? new Date(formValue.dateOfBirth) : undefined,
      profession: formValue.profession || undefined,
      
      companyName: formValue.companyName || undefined,
      taxId: formValue.taxId || undefined,
      tradeRegister: formValue.tradeRegister || undefined,
      contactPersonName: formValue.contactPersonName || undefined
    };

    this.clientService.create(request).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/clients']);
      },
      error: (err) => {
        console.error('Error creating client', err);
        this.isSubmitting = false;
        // Handle error (show toast, etc.)
      }
    });
  }
}
