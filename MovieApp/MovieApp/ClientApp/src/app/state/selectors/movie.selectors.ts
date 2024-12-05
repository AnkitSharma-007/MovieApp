import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  MOVIE_FEATURE_KEY,
  movieAdapter,
  MovieState,
} from '../reducers/movie.reducer';
import { selectRouterParam } from './router.selectors';

const selectMoviesFeatureState =
  createFeatureSelector<MovieState>(MOVIE_FEATURE_KEY);

const { selectAll, selectEntities } = movieAdapter.getSelectors();

export const selectMovies = createSelector(selectMoviesFeatureState, selectAll);
const selectMovieEntities = createSelector(
  selectMoviesFeatureState,
  selectEntities
);

export const selectCurrentMovieId = selectRouterParam('movieId');

export const selectCurrentMovieDetails = createSelector(
  selectMovieEntities,
  selectCurrentMovieId,
  (movies, id) => {
    if (id == null || !movies) return undefined;
    return movies[id];
  }
);

export const selectMoviesCallState = createSelector(
  selectMoviesFeatureState,
  (state) => state.movieCallState
);

export const selectSearchItemValue = createSelector(
  selectMoviesFeatureState,
  (state) => state.searchItem ?? ''
);
