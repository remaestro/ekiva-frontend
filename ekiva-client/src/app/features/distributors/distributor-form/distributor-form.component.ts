import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DistributorService } from '../../../core/services/distributor.service';
import { DistributorType } from '../../../core/models/distributor.model';

@Component({
  selector: 'app-distributor-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="bg-white shadow rounded-lg">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-medium text-gray-900">
          {{ isEditMode() ? 'Modifier' : 'Nouveau' }} Distributeur
        </h2>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="px-6 py-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Nom -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700">Nom *</label>
            <input
              type="text"
              formControlName="name"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              [class.border-red-500]="form.get('name')?.invalid && form.get('name')?.touched"
            />
            @if (form.get('name')?.invalid && form.get('name')?.touched) {
              <p class="mt-1 text-sm text-red-600">Le nom est requis</p>
            }
          </div>

          <!-- Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Type *</label>
            <select
              formControlName="type"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="InternalAgent">Agent Interne</option>
              <option value="GeneralAgent">Agent Général</option>
              <option value="Broker">Courtier</option>
              <option value="Bancassurance">Bancassurance</option>
            </select>
          </div>

          <!-- Statut -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Statut</label>
            <div class="mt-2">
              <label class="inline-flex items-center">
                <input
                  type="checkbox"
                  formControlName="isActive"
                  class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span class="ml-2 text-sm text-gray-700">Actif</span>
              </label>
            </div>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Email *</label>
            <input
              type="email"
              formControlName="email"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              [class.border-red-500]="form.get('email')?.invalid && form.get('email')?.touched"
            />
            @if (form.get('email')?.invalid && form.get('email')?.touched) {
              <p class="mt-1 text-sm text-red-600">Email valide requis</p>
            }
          </div>

          <!-- Téléphone -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Téléphone *</label>
            <input
              type="tel"
              formControlName="phoneNumber"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              [class.border-red-500]="form.get('phoneNumber')?.invalid && form.get('phoneNumber')?.touched"
            />
            @if (form.get('phoneNumber')?.invalid && form.get('phoneNumber')?.touched) {
              <p class="mt-1 text-sm text-red-600">Téléphone requis</p>
            }
          </div>

          <!-- Adresse -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700">Adresse *</label>
            <textarea
              formControlName="address"
              rows="3"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              [class.border-red-500]="form.get('address')?.invalid && form.get('address')?.touched"
            ></textarea>
            @if (form.get('address')?.invalid && form.get('address')?.touched) {
              <p class="mt-1 text-sm text-red-600">Adresse requise</p>
            }
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-6 flex justify-end gap-3">
          <button
            type="button"
            (click)="onCancel()"
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            [disabled]="form.invalid || loading()"
            class="px-4 py-2 bg-blue-900 text-white rounded-md text-sm font-medium hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading() ? 'Enregistrement...' : 'Enregistrer' }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class DistributorFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private distributorService = inject(DistributorService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  form!: FormGroup;
  loading = signal(false);
  isEditMode = signal(false);
  distributorId?: string;

  ngOnInit() {
    this.initForm();
    this.checkEditMode();
  }

  initForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      type: [DistributorType.InternalAgent, Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required],
      isActive: [true]
    });
  }

  checkEditMode() {
    this.distributorId = this.route.snapshot.paramMap.get('id') || undefined;
    if (this.distributorId) {
      this.isEditMode.set(true);
      this.loadDistributor();
    }
  }

  loadDistributor() {
    if (!this.distributorId) return;

    this.loading.set(true);
    this.distributorService.getById(this.distributorId).subscribe({
      next: (distributor) => {
        this.form.patchValue({
          name: distributor.name,
          type: distributor.type,
          email: distributor.email,
          phoneNumber: distributor.phoneNumber,
          address: distributor.address,
          isActive: distributor.isActive
        });
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading distributor:', error);
        alert('Erreur lors du chargement du distributeur');
        this.loading.set(false);
        this.router.navigate(['/distributors']);
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const formValue = this.form.value;

    const request$ = this.isEditMode()
      ? this.distributorService.update(this.distributorId!, formValue)
      : this.distributorService.create(formValue);

    request$.subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/distributors']);
      },
      error: (error) => {
        console.error('Error saving distributor:', error);
        alert('Erreur lors de l\'enregistrement du distributeur');
        this.loading.set(false);
      }
    });
  }

  onCancel() {
    this.router.navigate(['/distributors']);
  }
}
