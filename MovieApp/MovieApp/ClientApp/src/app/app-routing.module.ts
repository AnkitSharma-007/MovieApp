import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { MovieDetailsComponent } from './components/movie-details/movie-details.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { UserRegistrationComponent } from './components/user-registration/user-registration.component';
import { AdminAuthGuard } from './guards/admin-auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  //TODO: Can we combine these routes to one?
  { path: 'filter', component: HomeComponent },
  { path: 'search', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: UserRegistrationComponent },
  { path: 'movies/details/:movieId', component: MovieDetailsComponent },
  {
    path: 'admin/movies',
    loadChildren: () =>
      import('./admin/admin.module').then((module) => module.AdminModule),
    canLoad: [AdminAuthGuard],
    canActivate: [AdminAuthGuard],
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
