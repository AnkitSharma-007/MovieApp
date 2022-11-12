import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgMaterialModule } from './ng-material/ng-material.module';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { MovieCardComponent } from './components/movie-card/movie-card.component';
import { MovieFilterComponent } from './components/movie-filter/movie-filter.component';
import { MovieRatingComponent } from './components/movie-rating/movie-rating.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { UserRegistrationComponent } from './components/user-registration/user-registration.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { MovieDetailsComponent } from './components/movie-details/movie-details.component';
import { ConvertMinToHourPipe } from './pipes/convert-min-to-hour.pipe';
import { MovieSortComponent } from './components/movie-sort/movie-sort.component';
import { SimilarMoviesComponent } from './components/similar-movies/similar-movies.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    MovieCardComponent,
    MovieFilterComponent,
    MovieRatingComponent,
    HomeComponent,
    LoginComponent,
    UserRegistrationComponent,
    MovieDetailsComponent,
    PageNotFoundComponent,
    ConvertMinToHourPipe,
    MovieSortComponent,
    SimilarMoviesComponent,
  ],
  imports: [
    BrowserModule,
    NgMaterialModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
