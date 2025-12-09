import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="h-16 bg-white shadow-sm flex items-center justify-between px-6 fixed top-0 right-0 left-64 z-10">
      <!-- Left side (Breadcrumbs or Title) -->
      <div class="flex items-center">
        <h2 class="text-xl font-semibold text-gray-800">Tableau de bord</h2>
      </div>

      <!-- Right side (Notifications, etc.) -->
      <div class="flex items-center space-x-4">
        <button class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
          <span class="material-icons">notifications</span>
        </button>
        <button class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
          <span class="material-icons">help_outline</span>
        </button>
      </div>
    </header>
  `
})
export class HeaderComponent {
  // Header logic here
}
