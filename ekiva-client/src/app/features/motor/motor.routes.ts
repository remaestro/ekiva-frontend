import { Routes } from '@angular/router';
import { MotorComponent } from './motor.component';

export const MOTOR_ROUTES: Routes = [
  {
    path: '',
    component: MotorComponent,
    children: [
      { path: '', redirectTo: 'quotation', pathMatch: 'full' },
      { 
        path: 'quotation', 
        loadComponent: () => import('./components/quotation-wizard/quotation-wizard.component').then(m => m.QuotationWizardComponent) 
      }
    ]
  }
];
