import { Routes } from '@angular/router';
import { DistributorListComponent } from './distributor-list/distributor-list.component';
import { DistributorFormComponent } from './distributor-form/distributor-form.component';

export const DISTRIBUTORS_ROUTES: Routes = [
  {
    path: '',
    component: DistributorListComponent
  },
  {
    path: 'new',
    component: DistributorFormComponent
  },
  {
    path: ':id',
    component: DistributorFormComponent
  }
];
