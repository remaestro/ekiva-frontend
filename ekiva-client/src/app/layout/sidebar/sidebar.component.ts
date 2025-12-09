import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="h-screen w-64 bg-blue-900 text-white flex flex-col fixed left-0 top-0">
      <!-- Logo -->
      <div class="h-16 flex items-center justify-center border-b border-blue-800">
        <span class="text-2xl font-bold">EKIVA</span>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto py-4">
        <ul class="space-y-1">
          <li>
            <a routerLink="/dashboard" routerLinkActive="bg-blue-800 border-l-4 border-white" class="flex items-center px-6 py-3 hover:bg-blue-800 transition-colors">
              <span class="material-icons mr-3">dashboard</span>
              Dashboard
            </a>
          </li>
          
          <li class="px-6 py-2 text-xs font-semibold text-blue-300 uppercase tracking-wider mt-4">
            Gestion
          </li>
          
          <li>
            <a routerLink="/clients" routerLinkActive="bg-blue-800 border-l-4 border-white" class="flex items-center px-6 py-3 hover:bg-blue-800 transition-colors">
              <span class="material-icons mr-3">people</span>
              Clients
            </a>
          </li>
          
          <li>
            <a routerLink="/distributors" routerLinkActive="bg-blue-800 border-l-4 border-white" class="flex items-center px-6 py-3 hover:bg-blue-800 transition-colors">
              <span class="material-icons mr-3">store</span>
              Distributeurs
            </a>
          </li>
          
          <li class="px-6 py-2 text-xs font-semibold text-blue-300 uppercase tracking-wider mt-4">
            Assurance
          </li>
          
          <li>
            <a routerLink="/motor" routerLinkActive="bg-blue-800 border-l-4 border-white" class="flex items-center px-6 py-3 hover:bg-blue-800 transition-colors">
              <span class="material-icons mr-3">directions_car</span>
              Auto
            </a>
          </li>
          <li>
            <a routerLink="/liability" routerLinkActive="bg-blue-800 border-l-4 border-white" class="flex items-center px-6 py-3 hover:bg-blue-800 transition-colors">
              <span class="material-icons mr-3">business_center</span>
              RC & Risques Divers
            </a>
          </li>

          <li class="px-6 py-2 text-xs font-semibold text-blue-300 uppercase tracking-wider mt-4">
            Administration
          </li>
          
          <li>
            <a routerLink="/admin" routerLinkActive="bg-blue-800 border-l-4 border-white" class="flex items-center px-6 py-3 hover:bg-blue-800 transition-colors">
              <span class="material-icons mr-3">settings</span>
              Paramètres
            </a>
          </li>
        </ul>
      </nav>

      <!-- User Profile (Bottom) -->
      <div class="p-4 border-t border-blue-800">
        <div class="flex items-center">
          <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
            {{ userInitials() }}
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium">{{ currentUser()?.fullName || currentUser()?.email || 'User' }}</p>
            <button (click)="logout()" class="text-xs text-blue-300 hover:text-white">Se déconnecter</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SidebarComponent {
  authService = inject(AuthService);
  currentUser = this.authService.currentUser;

  logout() {
    this.authService.logout();
  }

  userInitials(): string {
    const user = this.currentUser();
    if (!user) return 'U';
    
    // Use first letter of firstName and lastName if available
    if (user.firstName && user.lastName) {
      return (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
    }
    
    // Fallback to first 2 letters of email
    if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    
    return 'U';
  }
}
