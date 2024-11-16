import { createReducer, on } from '@ngrx/store';
import { Genre } from 'src/app/models/genre';
import { CallState, LoadingState } from 'src/app/shared/call-state';
import {
  getGenreFailure,
  getGenreSuccess,
  getGenres,
} from '../actions/movie.actions';

export const GENRE_FEATURE_KEY = 'genre';

export interface GenreState {
  genres: Genre[];
  genreCallState: CallState;
}

const initialGenreState: GenreState = {
  genres: [],
  genreCallState: LoadingState.INIT,
};

export const genreReducer = createReducer(
  initialGenreState,
  on(getGenres, (state) => ({
    ...state,
    genreCallState: LoadingState.LOADING,
  })),
  on(getGenreSuccess, (state, { genres }) => ({
    ...state,
    genres,
    genreCallState: LoadingState.LOADED,
  })),
  on(getGenreFailure, (state, { errorMessage }) => ({
    ...state,
    genreCallState: { errorMessage },
  }))
);
