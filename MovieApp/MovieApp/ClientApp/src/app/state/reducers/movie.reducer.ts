import { createReducer, on } from '@ngrx/store';
import { Movie } from 'src/app/models/movie';
import { CallState, LoadingState } from 'src/app/shared/call-state';
import * as movieActions from '../actions/movie.actions';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

export const MOVIE_FEATURE_KEY = 'movie';

export interface MovieState extends EntityState<Movie> {
  searchItem: string;
  movieCallState: CallState;
}

// The EntityAdapter is a utility that helps manage the state of an entity collection.
// The selectId function is used to select the unique identifier for an entity.
// We should always provide a selectId function when creating an EntityAdapter.
export const movieAdapter: EntityAdapter<Movie> = createEntityAdapter<Movie>({
  selectId: (movie) => movie.movieId,
});

const initialMovieState: MovieState = movieAdapter.getInitialState({
  searchItem: '',
  movieCallState: LoadingState.INIT,
});

export const movieReducer = createReducer(
  initialMovieState,
  on(movieActions.getMovies, (state) => ({
    ...state,
    movieCallState: LoadingState.LOADING,
  })),
  on(movieActions.getMoviesSuccess, (state, { movies }) =>
    movieAdapter.setAll(movies, {
      ...state,
      movieCallState: LoadingState.LOADED,
    })
  ),
  on(movieActions.getMoviesFailure, (state, { errorMessage }) => ({
    ...state,
    movieCallState: { errorMessage },
  })),
  on(movieActions.setSearchItemValue, (state, { searchItem }) => ({
    ...state,
    searchItem,
  })),
  on(movieActions.addMovie, (state) => ({
    ...state,
    movieCallState: LoadingState.LOADING,
  })),
  on(movieActions.addMovieSuccess, (state, { movie }) =>
    movieAdapter.addOne(movie, {
      ...state,
      movieCallState: LoadingState.LOADED,
    })
  ),
  on(movieActions.addMovieFailure, (state, { errorMessage }) => ({
    ...state,
    movieCallState: { errorMessage },
  })),
  on(movieActions.updateMovie, (state) => ({
    ...state,
    movieCallState: LoadingState.LOADING,
  })),
  on(movieActions.updateMovieSuccess, (state, { movie }) =>
    movieAdapter.updateOne(
      { id: movie.movieId, changes: movie },
      {
        ...state,
        movieCallState: LoadingState.LOADED,
      }
    )
  ),
  on(movieActions.updateMovieFailure, (state, { errorMessage }) => ({
    ...state,
    movieCallState: { errorMessage },
  })),
  on(movieActions.deleteMovie, (state) => ({
    ...state,
    movieCallState: LoadingState.LOADING,
  })),
  on(movieActions.deleteMovieSuccess, (state, { movieId }) =>
    movieAdapter.removeOne(movieId, {
      ...state,
      movieCallState: LoadingState.LOADED,
    })
  ),
  on(movieActions.deleteMovieFailure, (state, { errorMessage }) => ({
    ...state,
    movieCallState: { errorMessage },
  }))
);
