import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { HomeComponent } from '../components/home/home.component';
import { PageNotFoundComponent } from '../components/page-not-found/page-not-found.component';
import { AdminAuthGuard } from '../guards/admin-auth.guard';
import { AuthGuard } from '../guards/auth.guard';
import { RegisterEffects } from '../state/effects/register.effects';
import {
  REGISTER_FEATURE_KEY,
  registerReducer,
} from '../state/reducers/register.reducer';
import { SimilarMoviesEffects } from '../state/effects/similar-movies.effects';
import {
  SIMILAR_MOVIE_FEATURE_KEY,
  similarMoviesReducer,
} from '../state/reducers/similar-movies.reducers';

export const APP_ROUTES: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
    title: 'Home',
  },
  //TODO: Can we combine these routes to one?
  { path: 'filter', component: HomeComponent, title: 'Home | Filter Movies' },
  { path: 'search', component: HomeComponent, title: 'Home | Search Movies' },
  {
    path: 'login',
    loadComponent: () =>
      import('../components/login/login.component').then(
        (c) => c.LoginComponent
      ),
    title: 'Login',
  },
  {
    path: 'register',
    providers: [
      provideEffects([RegisterEffects]),
      provideState(REGISTER_FEATURE_KEY, registerReducer),
    ],
    loadComponent: () =>
      import(
        '../components/user-registration/user-registration.component'
      ).then((c) => c.UserRegistrationComponent),
    title: 'Register',
  },
  {
    path: 'movies/details/:movieId',
    providers: [
      provideEffects([SimilarMoviesEffects]),
      provideState(SIMILAR_MOVIE_FEATURE_KEY, similarMoviesReducer),
    ],

    loadComponent: () =>
      import('../components/movie-details/movie-details.component').then(
        (c) => c.MovieDetailsComponent
      ),
    title: 'Movie Details',
  },
  {
    path: 'watchlist',
    loadComponent: () =>
      import('../components/watchlist/watchlist.component').then(
        (c) => c.WatchlistComponent
      ),
    canActivate: [AuthGuard],
    title: 'Watchlist',
  },
  {
    path: 'admin/movies',
    loadChildren: () => import('./admin.routes').then((m) => m.ADMIN_ROUTES),
    canLoad: [AdminAuthGuard],
    canActivate: [AdminAuthGuard],
    title: 'Admin | Movies',
  },
  { path: '**', component: PageNotFoundComponent, title: 'Not Found' },
];
