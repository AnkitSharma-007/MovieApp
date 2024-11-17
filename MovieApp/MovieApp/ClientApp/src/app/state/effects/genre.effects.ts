import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { MovieService } from 'src/app/services/movie.service';
import {
  getGenres,
  getGenreFailure,
  getGenreSuccess,
} from '../actions/movie.actions';

@Injectable()
export class GenreEffects {
  private readonly actions$ = inject(Actions);
  private readonly movieService = inject(MovieService);

  fetchGenres$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getGenres),
      exhaustMap(() =>
        this.movieService.getGenres().pipe(
          map((genres) => getGenreSuccess({ genres })),
          catchError((error) => of(getGenreFailure({ errorMessage: error })))
        )
      )
    )
  );
}
