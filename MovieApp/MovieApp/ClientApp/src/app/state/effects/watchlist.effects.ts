import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  catchError,
  concatMap,
  exhaustMap,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { WatchlistService } from 'src/app/services/watchlist.service';
import { loginSuccess } from '../actions/auth.actions';
import {
  clearWatchlist,
  clearWatchlistFailure,
  clearWatchlistSuccess,
  getWatchlist,
  getWatchlistFailure,
  getWatchlistSuccess,
  toggleWatchlist,
  toggleWatchlistFailure,
  toggleWatchlistSuccess,
} from '../actions/watchlist.actions';
import { selectAuthenticatedUser } from '../selectors/auth.selectors';

@Injectable()
export class WatchlistEffects {
  private readonly actions$ = inject(Actions);
  private readonly watchlistService = inject(WatchlistService);
  private readonly snackBarService = inject(SnackbarService);
  private readonly store = inject(Store);

  getWatchlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getWatchlist, loginSuccess),
      exhaustMap(() =>
        this.store.select(selectAuthenticatedUser).pipe(
          switchMap((user) => {
            if (user) {
              return this.watchlistService.getWatchlistItems(user.userId).pipe(
                map((movies) => getWatchlistSuccess({ movies })),
                catchError((error) =>
                  of(getWatchlistFailure({ errorMessage: error }))
                )
              );
            }
            return of(getWatchlistFailure({ errorMessage: 'User not found' }));
          })
        )
      )
    )
  );

  // TODO: Find a way to fetch user id from the store
  // Current problem: When we login/logout in same session without refreshing the page,
  // the action from previous user session is triggered. This updates the watchlist of another user.

  toggleWatchlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(toggleWatchlist),
      exhaustMap((action) =>
        this.watchlistService
          .toggleWatchlistItem(action.userId, action.movieId)
          .pipe(
            map((movies) => toggleWatchlistSuccess({ movies })),
            tap(() => {
              if (action.isAdd) {
                this.snackBarService.showSnackBar('Added to Watchlist!!!');
              } else {
                this.snackBarService.showSnackBar('Removed from Watchlist!!!');
              }
            }),
            catchError((error) =>
              of(toggleWatchlistFailure({ errorMessage: error }))
            )
          )
      )
    )
  );

  clearWatchlist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(clearWatchlist),
      exhaustMap((action) =>
        this.watchlistService.clearWatchlist(action.userId).pipe(
          map(() => {
            return clearWatchlistSuccess();
          }),
          tap(() => this.snackBarService.showSnackBar('Watchlist cleared!!!')),
          catchError((error) => {
            console.error(
              'Error ocurred while removing items from the Watchlist : ',
              error
            );
            return of(clearWatchlistFailure({ errorMessage: error }));
          })
        )
      )
    )
  );
}
