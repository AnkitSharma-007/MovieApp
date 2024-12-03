import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  SIMILAR_MOVIE_FEATURE_KEY,
  SimilarMovieState,
} from '../reducers/similar-movies.reducers';

const selectSimilarMovieFeatureState = createFeatureSelector<SimilarMovieState>(
  SIMILAR_MOVIE_FEATURE_KEY
);

export const selectSimilarMovies = createSelector(
  selectSimilarMovieFeatureState,
  (state: SimilarMovieState) => state.movies
);
