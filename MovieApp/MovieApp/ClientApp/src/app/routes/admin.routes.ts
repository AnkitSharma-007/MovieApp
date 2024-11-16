import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'new',
        loadComponent: () =>
          import('../admin/components/movie-form/movie-form.component').then(
            (c) => c.MovieFormComponent
          ),
      },
      {
        path: 'edit/:movieId',
        loadComponent: () =>
          import('../admin/components/movie-form/movie-form.component').then(
            (c) => c.MovieFormComponent
          ),
      },
      {
        path: '',
        loadComponent: () =>
          import(
            '../admin/components/manage-movies/manage-movies.component'
          ).then((c) => c.ManageMoviesComponent),
      },
    ],
  },
];
