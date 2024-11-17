import { createReducer, on } from '@ngrx/store';
import { Movie } from 'src/app/models/movie';
import { CallState, LoadingState } from 'src/app/shared/call-state';
import {
  getMovies,
  getMoviesFailure,
  getMoviesSuccess,
} from '../actions/movie.actions';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

export const MOVIE_FEATURE_KEY = 'movie';

export interface MovieState {
  movies: EntityState<Movie>;
  movieCallState: CallState;
}

// The EntityAdapter is a utility that helps manage the state of an entity collection.
// The selectId function is used to select the unique identifier for an entity.
// We should always provide a selectId function when creating an EntityAdapter.
export const movieAdapter: EntityAdapter<Movie> = createEntityAdapter<Movie>({
  selectId: (movie) => movie.movieId,
});

const initialMovieState: MovieState = {
  movies: movieAdapter.getInitialState(),
  movieCallState: LoadingState.INIT,
};

export const movieReducer = createReducer(
  initialMovieState,
  on(getMovies, (state) => ({
    ...state,
    movieCallState: LoadingState.LOADING,
  })),
  on(getMoviesSuccess, (state, { movies }) => ({
    ...state,
    movies: movieAdapter.setAll(movies, state.movies),
    movieCallState: LoadingState.LOADED,
  })),
  on(getMoviesFailure, (state, { errorMessage }) => ({
    ...state,
    movieCallState: { errorMessage },
  }))
);
