import { Routes } from '@angular/router';
import { PairsTable } from './components/pairs-table/pairs-table';
import { PairDetails } from './components/pair-details/pair-details';

export const routes: Routes = [
  { path: '', component: PairsTable },
  { path: 'pair/:symbol', component: PairDetails },
];
