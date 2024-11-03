import { Routes } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { PageNotFoundComponent } from '../components/page-not-found/page-not-found.component';
import { AdminAuthGuard } from '../guards/admin-auth.guard';
import { AuthGuard } from '../guards/auth.guard';

export const APP_ROUTES: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  //TODO: Can we combine these routes to one?
  { path: 'filter', component: HomeComponent },
  { path: 'search', component: HomeComponent },
  {
    path: 'login',
    loadComponent: () =>
      import('../components/login/login.component').then(
        (c) => c.LoginComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import(
        '../components/user-registration/user-registration.component'
      ).then((c) => c.UserRegistrationComponent),
  },
  {
    path: 'movies/details/:movieId',
    loadComponent: () =>
      import('../components/movie-details/movie-details.component').then(
        (c) => c.MovieDetailsComponent
      ),
  },
  {
    path: 'watchlist',
    loadComponent: () =>
      import('../components/watchlist/watchlist.component').then(
        (c) => c.WatchlistComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/movies',
    loadChildren: () => import('./admin.routes').then((m) => m.ADMIN_ROUTES),
    canLoad: [AdminAuthGuard],
    canActivate: [AdminAuthGuard],
  },
  { path: '**', component: PageNotFoundComponent },
];
