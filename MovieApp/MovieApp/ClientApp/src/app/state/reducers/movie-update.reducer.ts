import { createReducer, on } from '@ngrx/store';
import { Movie } from 'src/app/models/movie';
import { CallState, LoadingState } from 'src/app/shared/call-state';
import {
  addMovie,
  addMovieFailure,
  addMovieSuccess,
  deleteMovie,
  deleteMovieFailure,
  deleteMovieSuccess,
  updateMovie,
  updateMovieFailure,
  updateMovieSuccess,
} from '../actions/movie.actions';

export const MOVIE_UPDATE_FEATURE_KEY = 'movieUpdate';

export interface MovieState {
  movies: Movie[];
  movieCallState: CallState;
}

const initialMovieState: MovieState = {
  movies: [],
  movieCallState: LoadingState.INIT,
};

export const movieUpdateReducer = createReducer(
  initialMovieState,
  on(addMovie, (state) => ({
    ...state,
    movieCallState: LoadingState.LOADING,
  })),
  on(addMovieSuccess, (state) => ({
    ...state,
    movieCallState: LoadingState.LOADED,
  })),
  on(addMovieFailure, (state, { errorMessage }) => ({
    ...state,
    movieCallState: { errorMessage },
  })),
  on(updateMovie, (state) => ({
    ...state,
    movieCallState: LoadingState.LOADING,
  })),
  on(updateMovieSuccess, (state) => ({
    ...state,
    movieCallState: LoadingState.LOADED,
  })),
  on(updateMovieFailure, (state, { errorMessage }) => ({
    ...state,
    movieCallState: { errorMessage },
  })),
  on(deleteMovie, (state) => ({
    ...state,
    movieCallState: LoadingState.LOADING,
  })),
  on(deleteMovieSuccess, (state) => ({
    ...state,
    movieCallState: LoadingState.LOADED,
  })),
  on(deleteMovieFailure, (state, { errorMessage }) => ({
    ...state,
    movieCallState: { errorMessage },
  }))
);
