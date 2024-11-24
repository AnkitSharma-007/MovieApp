import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, exhaustMap, map, tap } from 'rxjs/operators';
import { MovieService } from 'src/app/services/movie.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import {
  addMovie,
  addMovieFailure,
  addMovieSuccess,
  cancelMovieFormNavigation,
  deleteMovie,
  deleteMovieFailure,
  deleteMovieSuccess,
  updateMovie,
  updateMovieFailure,
  updateMovieSuccess,
} from '../actions/movie.actions';

@Injectable()
export class MovieUpdateEffects {
  private readonly actions$ = inject(Actions);
  private readonly movieService = inject(MovieService);
  private readonly router = inject(Router);
  private readonly snackBarService = inject(SnackbarService);

  addMovie$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addMovie),
      concatMap((action) =>
        this.movieService.addMovie(action.movie).pipe(
          map(() => addMovieSuccess()),
          tap(() => this.navigateToAdminPanel()),
          catchError((error) => of(addMovieFailure({ errorMessage: error })))
        )
      )
    )
  );

  updateMovie$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateMovie),
      exhaustMap((action) =>
        this.movieService.updateMovieDetails(action.movie).pipe(
          map(() => updateMovieSuccess()),
          tap(() => this.navigateToAdminPanel()),
          catchError((error) => of(updateMovieFailure({ errorMessage: error })))
        )
      )
    )
  );

  deleteMovie$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteMovie),
      concatMap((action) =>
        this.movieService.deleteMovie(action.movieId).pipe(
          map(() => deleteMovieSuccess()),
          catchError((error) => of(deleteMovieFailure({ errorMessage: error })))
        )
      )
    )
  );

  handleAddMovieSuccessMessage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addMovieSuccess),
        tap(() => this.snackBarService.showSnackBar('Movie added successfully'))
      ),
    { dispatch: false }
  );

  handleUpdateMovieSuccessMessage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateMovieSuccess),
        tap(() =>
          this.snackBarService.showSnackBar('Movie updated successfully')
        )
      ),
    { dispatch: false }
  );

  handleAddUpdateMovieFailureMessage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addMovieFailure, updateMovieFailure),
        tap(({ errorMessage }) => {
          this.snackBarService.showSnackBar(`Error occurred: Please try again`);
          console.error(
            'Error occurred while adding/updating movie data : ',
            errorMessage
          );
        })
      ),
    { dispatch: false, useEffectsErrorHandler: false }
  );

  handleDeleteMovieSuccessMessage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(deleteMovieSuccess),
        tap(() =>
          this.snackBarService.showSnackBar('Movie deleted successfully')
        )
      ),
    { dispatch: false }
  );

  handleDeleteMovieFailureMessage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(deleteMovieFailure),
        tap(({ errorMessage }) => {
          this.snackBarService.showSnackBar(`Error occurred: Please try again`);
          console.error(
            'Error occurred while deleting movie data : ',
            errorMessage
          );
        })
      ),
    { dispatch: false }
  );

  handleCancel$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(cancelMovieFormNavigation),
        tap(() => this.navigateToAdminPanel())
      ),
    { dispatch: false }
  );

  private navigateToAdminPanel() {
    this.router.navigate(['/admin/movies']);
  }
}
