import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../../core/services/client.service';
import { Client, ClientType, ClientSearchRequest } from '../../../core/models/client.model';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="bg-white shadow rounded-lg">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 class="text-lg font-medium text-gray-900">Liste des Clients</h2>
        <a routerLink="/clients/new" class="bg-blue-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-800">
          <span class="material-icons text-sm mr-1 align-middle">add</span>
          Nouveau Client
        </a>
      </div>

      <!-- Search & Filters -->
      <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="md:col-span-2">
            <input
              type="text"
              [(ngModel)]="searchTerm"
              (input)="onSearch()"
              placeholder="Rechercher (nom, email, téléphone, référence...)"
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
              <option value="Individual">Particulier</option>
              <option value="Company">Entreprise</option>
            </select>
          </div>
          <div>
            <input
              type="text"
              [(ngModel)]="filterCity"
              (input)="onSearch()"
              placeholder="Ville"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
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
          <span class="text-gray-600">Page :</span>
          <span class="font-semibold text-gray-900 ml-1">{{ currentPage() }} / {{ totalPages() }}</span>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Référence</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom / Raison Sociale</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ville</th>
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
            } @else if (clients().length === 0) {
              <tr>
                <td colspan="6" class="px-6 py-10 text-center text-gray-500">
                  Aucun client trouvé. Commencez par en créer un.
                </td>
              </tr>
            } @else {
              @for (client of clients(); track client.id) {
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ client.referenceNumber }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ client.fullName }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                          [ngClass]="client.type === 'Individual' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'">
                      {{ client.type === 'Individual' ? 'Particulier' : 'Entreprise' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500">
                    <div>{{ client.email }}</div>
                    <div class="text-xs text-gray-400">{{ client.phoneNumber }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ client.city }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a [routerLink]="['/clients', client.id]" class="text-blue-600 hover:text-blue-900 mr-4">Voir</a>
                    <button (click)="deleteClient(client)" class="text-red-600 hover:text-red-900">Supprimer</button>
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
export class ClientListComponent implements OnInit {
  private clientService = inject(ClientService);
  
  clients = signal<Client[]>([]);
  loading = signal(false);
  total = signal(0);
  currentPage = signal(1);
  totalPages = signal(1);
  pageSize = 10;
  
  searchTerm = '';
  filterType = '';
  filterCity = '';
  
  Math = Math;

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.loading.set(true);
    
    const request: ClientSearchRequest = {
      searchTerm: this.searchTerm || undefined,
      type: this.filterType as ClientType || undefined,
      city: this.filterCity || undefined,
      pageNumber: this.currentPage(),
      pageSize: this.pageSize
    };

    this.clientService.search(request).subscribe({
      next: (response) => {
        this.clients.set(response.data);
        this.total.set(response.total);
        this.totalPages.set(response.totalPages);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading clients:', error);
        this.loading.set(false);
      }
    });
  }

  onSearch() {
    this.currentPage.set(1);
    this.loadClients();
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
      this.loadClients();
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
      this.loadClients();
    }
  }

  deleteClient(client: Client) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le client ${client.fullName} ?`)) {
      this.clientService.delete(client.id).subscribe({
        next: () => {
          this.loadClients();
        },
        error: (error) => {
          console.error('Error deleting client:', error);
          alert('Erreur lors de la suppression du client');
        }
      });
    }
  }
}
