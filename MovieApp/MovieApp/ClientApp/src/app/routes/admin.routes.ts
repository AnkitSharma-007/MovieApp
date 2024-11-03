import { Routes } from '@angular/router';
import { ManageMoviesComponent } from '../admin/components/manage-movies/manage-movies.component';
import { MovieFormComponent } from '../admin/components/movie-form/movie-form.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    children: [
      { path: 'new', component: MovieFormComponent },
      { path: ':movieId', component: MovieFormComponent },
      { path: '', component: ManageMoviesComponent },
    ],
  },
];
