import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, exhaustMap, map, of, switchMap } from 'rxjs';
import { MovieService } from 'src/app/services/movie.service';
import {
  getsimilarMovies,
  getsimilarMoviesFailure,
  getsimilarMoviesSuccess,
} from '../actions/similar-movies.action';
import { selectCurrentMovieId } from '../selectors/movie.selectors';

@Injectable()
export class SimilarMoviesEffects {
  private readonly actions$ = inject(Actions);
  private readonly movieService = inject(MovieService);
  private readonly store = inject(Store);

  fetchGenres$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getsimilarMovies),
      exhaustMap(() =>
        this.store.select(selectCurrentMovieId).pipe(
          switchMap((movieId) => {
            if (movieId) {
              return this.movieService.getsimilarMovies(Number(movieId)).pipe(
                map((movies) => getsimilarMoviesSuccess({ movies })),
                catchError((error) =>
                  of(getsimilarMoviesFailure({ errorMessage: error }))
                )
              );
            } else {
              return of(
                getsimilarMoviesFailure({ errorMessage: 'No movie id' })
              );
            }
          })
        )
      )
    )
  );

  //   fetchGenres$ = createEffect(() =>
  //     this.actions$.pipe(
  //       ofType(getsimilarMovies),
  //       exhaustMap(({ movieId }) =>
  //         this.movieService.getsimilarMovies(movieId).pipe(
  //           map((movies) => getsimilarMoviesSuccess({ movies })),
  //           catchError((error) =>
  //             of(getsimilarMoviesFailure({ errorMessage: error }))
  //           )
  //         )
  //       )
  //     )
  //   );
}
