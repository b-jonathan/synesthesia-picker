import { Routes } from '@angular/router';
import { Picker } from './pages/picker/picker';
import { Upload } from './pages/upload/upload';

export const routes: Routes = [
  {
    path: 'upload',
    component: Upload,
  },
  {
    path: '**',
    component: Picker,
  },
];
