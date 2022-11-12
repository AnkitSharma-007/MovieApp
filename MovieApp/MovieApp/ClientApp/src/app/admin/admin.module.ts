import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieFormComponent } from './components/movie-form/movie-form.component';
import { ManageMoviesComponent } from './components/manage-movies/manage-movies.component';
import { DeleteMovieComponent } from './components/delete-movie/delete-movie.component';
import { AdminRoutingModule } from './admin-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminNgMaterialModule } from './admin-ng-material.module';

@NgModule({
  declarations: [
    MovieFormComponent,
    ManageMoviesComponent,
    DeleteMovieComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    AdminNgMaterialModule,
  ],
})
export class AdminModule {}
