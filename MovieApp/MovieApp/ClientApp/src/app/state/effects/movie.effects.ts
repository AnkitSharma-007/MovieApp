import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, exhaustMap, map, tap } from 'rxjs/operators';
import { MovieService } from 'src/app/services/movie.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import * as movieActions from '../actions/movie.actions';

@Injectable()
export class MovieEffects {
  private readonly actions$ = inject(Actions);
  private readonly movieService = inject(MovieService);
  private readonly snackBarService = inject(SnackbarService);
  private readonly router = inject(Router);

  fetchMovies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        movieActions.getMovies,
        movieActions.deleteMovieSuccess,
        movieActions.addMovieSuccess,
        movieActions.updateMovieSuccess
      ),
      exhaustMap(() =>
        this.movieService.getAllMovies().pipe(
          map((movies) => movieActions.getMoviesSuccess({ movies })),
          catchError((error) =>
            of(movieActions.getMoviesFailure({ errorMessage: error }))
          )
        )
      )
    )
  );

  addMovie$ = createEffect(() =>
    this.actions$.pipe(
      ofType(movieActions.addMovie),
      concatMap((action) =>
        this.movieService.addMovie(action.movie).pipe(
          map((movie) => movieActions.addMovieSuccess({ movie })),
          tap(() => this.navigateToAdminPanel()),
          catchError((error) =>
            of(movieActions.addMovieFailure({ errorMessage: error }))
          )
        )
      )
    )
  );

  updateMovie$ = createEffect(() =>
    this.actions$.pipe(
      ofType(movieActions.updateMovie),
      exhaustMap((action) =>
        this.movieService.updateMovieDetails(action.movie).pipe(
          map((movie) => movieActions.updateMovieSuccess({ movie })),
          tap(() => this.navigateToAdminPanel()),
          catchError((error) => {
            console.log(error);
            return of(movieActions.updateMovieFailure({ errorMessage: error }));
          })
        )
      )
    )
  );

  deleteMovie$ = createEffect(() =>
    this.actions$.pipe(
      ofType(movieActions.deleteMovie),
      concatMap((action) =>
        this.movieService.deleteMovie(action.movieId).pipe(
          map(() =>
            movieActions.deleteMovieSuccess({ movieId: action.movieId })
          ),
          catchError((error) =>
            of(movieActions.deleteMovieFailure({ errorMessage: error }))
          )
        )
      )
    )
  );

  handleAddMovieSuccessMessage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(movieActions.addMovieSuccess),
        tap(() => this.snackBarService.showSnackBar('Movie added successfully'))
      ),
    { dispatch: false }
  );

  handleUpdateMovieSuccessMessage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(movieActions.updateMovieSuccess),
        tap(() =>
          this.snackBarService.showSnackBar('Movie updated successfully')
        )
      ),
    { dispatch: false }
  );

  handleAddUpdateMovieFailureMessage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(movieActions.addMovieFailure, movieActions.updateMovieFailure),
        tap(({ errorMessage }) => {
          this.snackBarService.showSnackBar(`Error occurred: Please try again`);
          // console.error(
          //   'Error occurred while adding/updating movie data : ',
          //   errorMessage
          // );
        })
      ),
    { dispatch: false }
  );

  handleDeleteMovieSuccessMessage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(movieActions.deleteMovieSuccess),
        tap(() =>
          this.snackBarService.showSnackBar('Movie deleted successfully')
        )
      ),
    { dispatch: false }
  );

  handleDeleteMovieFailureMessage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(movieActions.deleteMovieFailure),
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
        ofType(movieActions.cancelMovieFormNavigation),
        tap(() => this.navigateToAdminPanel())
      ),
    { dispatch: false }
  );

  private navigateToAdminPanel() {
    this.router.navigate(['/admin/movies']);
  }
}
