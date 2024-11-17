import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { MovieService } from 'src/app/services/movie.service';
import {
  addMovieSuccess,
  deleteMovieSuccess,
  getMovies,
  getMoviesFailure,
  getMoviesSuccess,
  updateMovieSuccess,
} from '../actions/movie.actions';

@Injectable()
export class MovieEffects {
  private readonly actions$ = inject(Actions);
  private readonly movieService = inject(MovieService);

  fetchMovies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        getMovies,
        deleteMovieSuccess,
        addMovieSuccess,
        updateMovieSuccess
      ),
      exhaustMap(() =>
        this.movieService.getAllMovies().pipe(
          map((movies) => getMoviesSuccess({ movies })),
          catchError((error) => of(getMoviesFailure({ errorMessage: error })))
        )
      )
    )
  );
}
