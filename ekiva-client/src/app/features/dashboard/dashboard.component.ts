import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <!-- Stat Card 1 -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100 text-blue-600">
            <span class="material-icons">description</span>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-500 font-medium">Devis en cours</p>
            <p class="text-2xl font-bold text-gray-800">12</p>
          </div>
        </div>
      </div>

      <!-- Stat Card 2 -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100 text-green-600">
            <span class="material-icons">check_circle</span>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-500 font-medium">Polices actives</p>
            <p class="text-2xl font-bold text-gray-800">145</p>
          </div>
        </div>
      </div>

      <!-- Stat Card 3 -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-100 text-purple-600">
            <span class="material-icons">people</span>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-500 font-medium">Nouveaux Clients</p>
            <p class="text-2xl font-bold text-gray-800">5</p>
          </div>
        </div>
      </div>

      <!-- Stat Card 4 -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
            <span class="material-icons">attach_money</span>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-500 font-medium">Chiffre d'affaires (M)</p>
            <p class="text-2xl font-bold text-gray-800">2.4M</p>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Dernières activités</h3>
      </div>
      <div class="p-6">
        <p class="text-gray-500 text-center py-8">Aucune activité récente.</p>
      </div>
    </div>
  `
})
export class DashboardComponent {}
