import { createAction, props } from '@ngrx/store';
import { Movie } from 'src/app/models/movie';

export const getWatchlist = createAction('[Watchlist] Get Watchlist');

export const getWatchlistSuccess = createAction(
  '[Watchlist] Get Watchlist Success',
  props<{ movies: Movie[] }>()
);

export const getWatchlistFailure = createAction(
  '[Watchlist] Get Watchlist Failure',
  props<{ errorMessage: string }>()
);

export const toggleWatchlist = createAction(
  '[Watchlist] Toggle Watchlist',
  props<{ movieId: number; isAdd: boolean }>()
);

export const toggleWatchlistSuccess = createAction(
  '[Watchlist] Toggle Watchlist Success',
  props<{ movies: Movie[] }>()
);

export const toggleWatchlistFailure = createAction(
  '[Watchlist] Toggle Watchlist Failure',
  props<{ errorMessage: string }>()
);

export const clearWatchlist = createAction('[Watchlist] Clear Watchlist');

export const clearWatchlistSuccess = createAction(
  '[Watchlist] Clear Watchlist Success'
);

export const clearWatchlistFailure = createAction(
  '[Watchlist] Clear Watchlist Failure',
  props<{ errorMessage: string }>()
);
