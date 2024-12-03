import { createReducer, on } from '@ngrx/store';
import { Movie } from 'src/app/models/movie';
import { CallState, LoadingState } from 'src/app/shared/call-state';
import {
  getsimilarMovies,
  getsimilarMoviesFailure,
  getsimilarMoviesSuccess,
} from '../actions/similar-movies.action';

export const SIMILAR_MOVIE_FEATURE_KEY = 'similarMovies';

export interface SimilarMovieState {
  movies: Movie[];
  CallState: CallState;
}

const initialSimilarMovieState: SimilarMovieState = {
  movies: [],
  CallState: LoadingState.INIT,
};

export const similarMoviesReducer = createReducer(
  initialSimilarMovieState,
  on(getsimilarMovies, (state) => ({
    ...state,
    CallState: LoadingState.LOADING,
  })),
  on(getsimilarMoviesSuccess, (state, { movies }) => ({
    ...state,
    movies,
    CallState: LoadingState.LOADED,
  })),
  on(getsimilarMoviesFailure, (state, { errorMessage }) => ({
    ...state,
    CallState: { errorMessage },
  }))
);
