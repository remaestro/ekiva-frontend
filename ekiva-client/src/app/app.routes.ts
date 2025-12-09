import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { roleGuard } from './core/auth/role.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ProfileComponent } from './features/auth/profile/profile.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: 'auth/login',
    component: LoginComponent
  },
  {
    path: 'auth/register',
    component: RegisterComponent
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { 
        path: 'profile', 
        component: ProfileComponent 
      },
      { 
        path: 'clients', 
        loadChildren: () => import('./features/clients/clients.routes').then(m => m.CLIENTS_ROUTES) 
      },
      { 
        path: 'distributors', 
        loadChildren: () => import('./features/distributors/distributors.routes').then(m => m.DISTRIBUTORS_ROUTES) 
      },
      { 
        path: 'motor', 
        loadChildren: () => import('./features/motor/motor.routes').then(m => m.MOTOR_ROUTES) 
      },
      // Admin routes will be added in Phase 10
      // { 
      //   path: 'admin', 
      //   loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
      //   canActivate: [roleGuard],
      //   data: { roles: ['Admin', 'Manager'] }
      // },
    ]
  },
  { 
    path: 'unauthorized', 
    loadComponent: () => import('./shared/components/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },
  { path: '**', redirectTo: '' }
];
