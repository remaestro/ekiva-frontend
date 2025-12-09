import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { User } from '../../../core/models/auth.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-4xl mx-auto p-6">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Mon Profil</h2>

        <div *ngIf="user" class="mb-6 p-4 bg-blue-50 rounded-lg">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-16 w-16 rounded-full bg-blue-900 flex items-center justify-center text-white text-2xl font-bold">
              {{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-800">{{ user.fullName }}</h3>
              <p class="text-gray-600">{{ user.email }}</p>
              <div class="mt-1">
                <span *ngFor="let role of user.roles" class="inline-block bg-blue-900 text-white text-xs px-2 py-1 rounded mr-2">
                  {{ role }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- First Name -->
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700">Prénom</label>
              <input
                type="text"
                id="firstName"
                formControlName="firstName"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <div *ngIf="profileForm.get('firstName')?.touched && profileForm.get('firstName')?.invalid" class="text-red-500 text-xs mt-1">
                Prénom requis
              </div>
            </div>

            <!-- Last Name -->
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                id="lastName"
                formControlName="lastName"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <div *ngIf="profileForm.get('lastName')?.touched && profileForm.get('lastName')?.invalid" class="text-red-500 text-xs mt-1">
                Nom requis
              </div>
            </div>
          </div>

          <!-- Email (Read-only) -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              [value]="user?.email"
              disabled
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
            />
            <p class="text-xs text-gray-500 mt-1">L'email ne peut pas être modifié</p>
          </div>

          <!-- Success Message -->
          <div *ngIf="successMessage" class="bg-green-50 text-green-700 p-4 rounded-md">
            {{ successMessage }}
          </div>

          <!-- Error Message -->
          <div *ngIf="errorMessage" class="bg-red-50 text-red-700 p-4 rounded-md">
            {{ errorMessage }}
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end space-x-4">
            <button
              type="button"
              (click)="onCancel()"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              [disabled]="profileForm.invalid || isLoading"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span *ngIf="isLoading">Enregistrement...</span>
              <span *ngIf="!isLoading">Enregistrer</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  user: User | null = null;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  profileForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]]
  });

  ngOnInit() {
    this.user = this.authService.currentUser();
    if (this.user) {
      this.profileForm.patchValue({
        firstName: this.user.firstName,
        lastName: this.user.lastName
      });
    } else {
      // Load user profile from server
      this.authService.getUserProfile().subscribe({
        next: (user) => {
          this.user = user;
          this.profileForm.patchValue({
            firstName: user.firstName,
            lastName: user.lastName
          });
        },
        error: (err) => {
          console.error('Error loading profile', err);
          this.errorMessage = 'Erreur lors du chargement du profil';
        }
      });
    }
  }

  onSubmit() {
    if (this.profileForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { firstName, lastName } = this.profileForm.value;

    this.authService.updateProfile({
      firstName: firstName!,
      lastName: lastName!
    }).subscribe({
      next: (user) => {
        this.user = user;
        this.successMessage = 'Profil mis à jour avec succès!';
        this.isLoading = false;
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (err) => {
        console.error('Error updating profile', err);
        this.errorMessage = 'Erreur lors de la mise à jour du profil';
        this.isLoading = false;
      }
    });
  }

  onCancel() {
    if (this.user) {
      this.profileForm.patchValue({
        firstName: this.user.firstName,
        lastName: this.user.lastName
      });
    }
    this.errorMessage = '';
    this.successMessage = '';
  }
}
