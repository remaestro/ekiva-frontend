import { Routes } from '@angular/router';
import { ClientListComponent } from './client-list/client-list.component';
import { ClientCreateComponent } from './client-create/client-create.component';

export const CLIENTS_ROUTES: Routes = [
  {
    path: '',
    component: ClientListComponent
  },
  {
    path: 'new',
    component: ClientCreateComponent
  },
  {
    path: ':id',
    component: ClientCreateComponent // Placeholder for details/edit view, reusing create for now or create a separate details component later
  }
];
