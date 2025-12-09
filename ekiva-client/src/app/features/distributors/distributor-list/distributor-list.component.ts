import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DistributorService } from '../../../core/services/distributor.service';
import { Distributor, DistributorType, DistributorSearchRequest } from '../../../core/models/distributor.model';

@Component({
  selector: 'app-distributor-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="bg-white shadow rounded-lg">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 class="text-lg font-medium text-gray-900">Liste des Distributeurs</h2>
        <a routerLink="/distributors/new" class="bg-blue-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-800">
          <span class="material-icons text-sm mr-1 align-middle">add</span>
          Nouveau Distributeur
        </a>
      </div>

      <!-- Search & Filters -->
      <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <input
              type="text"
              [(ngModel)]="searchTerm"
              (input)="onSearch()"
              placeholder="Rechercher (code, nom, email...)"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <select
              [(ngModel)]="filterType"
              (change)="onSearch()"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tous les types</option>
              <option value="InternalAgent">Agent Interne</option>
              <option value="GeneralAgent">Agent Général</option>
              <option value="Broker">Courtier</option>
              <option value="Bancassurance">Bancassurance</option>
            </select>
          </div>
          <div>
            <select
              [(ngModel)]="filterStatus"
              (change)="onSearch()"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tous les statuts</option>
              <option value="true">Actif</option>
              <option value="false">Inactif</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Stats Bar -->
      <div class="px-6 py-3 bg-blue-50 border-b border-gray-200 flex gap-6 text-sm">
        <div>
          <span class="text-gray-600">Total :</span>
          <span class="font-semibold text-gray-900 ml-1">{{ total() }}</span>
        </div>
        <div>
          <span class="text-gray-600">Actifs :</span>
          <span class="font-semibold text-green-600 ml-1">{{ activeCount() }}</span>
        </div>
        <div>
          <span class="text-gray-600">Page :</span>
          <span class="font-semibold text-gray-900 ml-1">{{ currentPage() }} / {{ totalPages() }}</span>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th class="relative px-6 py-3">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            @if (loading()) {
              <tr>
                <td colspan="6" class="px-6 py-10 text-center">
                  <div class="flex justify-center items-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
                  </div>
                </td>
              </tr>
            } @else if (distributors().length === 0) {
              <tr>
                <td colspan="6" class="px-6 py-10 text-center text-gray-500">
                  Aucun distributeur trouvé. Commencez par en créer un.
                </td>
              </tr>
            } @else {
              @for (distributor of distributors(); track distributor.id) {
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ distributor.code }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ distributor.name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                      {{ getTypeLabel(distributor.type) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500">
                    <div>{{ distributor.email }}</div>
                    <div class="text-xs text-gray-400">{{ distributor.phoneNumber }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <button
                      (click)="toggleStatus(distributor)"
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer"
                      [ngClass]="distributor.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    >
                      {{ distributor.isActive ? 'Actif' : 'Inactif' }}
                    </button>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a [routerLink]="['/distributors', distributor.id]" class="text-blue-600 hover:text-blue-900 mr-4">Éditer</a>
                    <button (click)="deleteDistributor(distributor)" class="text-red-600 hover:text-red-900">Supprimer</button>
                  </td>
                </tr>
              }
            }
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      @if (totalPages() > 1) {
        <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              (click)="previousPage()"
              [disabled]="currentPage() === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            <button
              (click)="nextPage()"
              [disabled]="currentPage() === totalPages()"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Affichage de <span class="font-medium">{{ (currentPage() - 1) * pageSize + 1 }}</span> à 
                <span class="font-medium">{{ Math.min(currentPage() * pageSize, total()) }}</span> sur 
                <span class="font-medium">{{ total() }}</span> résultats
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  (click)="previousPage()"
                  [disabled]="currentPage() === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="material-icons text-sm">chevron_left</span>
                </button>
                <button
                  (click)="nextPage()"
                  [disabled]="currentPage() === totalPages()"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="material-icons text-sm">chevron_right</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class DistributorListComponent implements OnInit {
  private distributorService = inject(DistributorService);
  
  distributors = signal<Distributor[]>([]);
  loading = signal(false);
  total = signal(0);
  currentPage = signal(1);
  totalPages = signal(1);
  pageSize = 10;
  
  searchTerm = '';
  filterType = '';
  filterStatus = '';
  
  Math = Math;

  ngOnInit() {
    this.loadDistributors();
  }

  loadDistributors() {
    this.loading.set(true);
    
    const request: DistributorSearchRequest = {
      searchTerm: this.searchTerm || undefined,
      type: this.filterType as DistributorType || undefined,
      isActive: this.filterStatus ? this.filterStatus === 'true' : undefined,
      pageNumber: this.currentPage(),
      pageSize: this.pageSize
    };

    this.distributorService.search(request).subscribe({
      next: (response) => {
        this.distributors.set(response.data);
        this.total.set(response.total);
        this.totalPages.set(response.totalPages);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading distributors:', error);
        this.loading.set(false);
      }
    });
  }

  onSearch() {
    this.currentPage.set(1);
    this.loadDistributors();
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
      this.loadDistributors();
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
      this.loadDistributors();
    }
  }

  toggleStatus(distributor: Distributor) {
    this.distributorService.toggleStatus(distributor.id).subscribe({
      next: () => {
        this.loadDistributors();
      },
      error: (error) => {
        console.error('Error toggling distributor status:', error);
        alert('Erreur lors du changement de statut');
      }
    });
  }

  deleteDistributor(distributor: Distributor) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le distributeur ${distributor.name} ?`)) {
      this.distributorService.delete(distributor.id).subscribe({
        next: () => {
          this.loadDistributors();
        },
        error: (error) => {
          console.error('Error deleting distributor:', error);
          alert('Erreur lors de la suppression du distributeur');
        }
      });
    }
  }

  getTypeLabel(type: DistributorType): string {
    const labels = {
      [DistributorType.InternalAgent]: 'Agent Interne',
      [DistributorType.GeneralAgent]: 'Agent Général',
      [DistributorType.Broker]: 'Courtier',
      [DistributorType.Bancassurance]: 'Bancassurance'
    };
    return labels[type] || type;
  }

  activeCount(): number {
    return this.distributors().filter(d => d.isActive).length;
  }
}
