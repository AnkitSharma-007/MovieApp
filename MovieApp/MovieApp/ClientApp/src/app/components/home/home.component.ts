import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatestWith, map } from 'rxjs';
import { Movie } from 'src/app/models/movie';
import {
  getMovies,
  setSearchItemValue,
} from 'src/app/state/actions/movie.actions';
import { selectMovies } from 'src/app/state/selectors/movie.selectors';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { MovieFilterComponent } from '../movie-filter/movie-filter.component';
import { MovieSortComponent } from '../movie-sort/movie-sort.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MovieFilterComponent,
    MovieSortComponent,
    MovieCardComponent,
    MatProgressSpinner,
    AsyncPipe,
  ],
})
export class HomeComponent {
  private readonly store = inject(Store);
  private readonly activatedRoute = inject(ActivatedRoute);

  // Added the following two variables for better readability
  private readonly queryParams$ = this.activatedRoute.queryParams;
  private readonly movie$ = this.store.select(selectMovies);

  vm$ = this.queryParams$.pipe(
    combineLatestWith(this.movie$),
    map(([params, movies]) => {
      let homeVm = new Vm();

      homeVm.selectedGenre = params['genre'];
      homeVm.selectedSort = params['sortBy'];
      homeVm.selectedFilter = params['item'];

      this.store.dispatch(
        setSearchItemValue({ searchItem: homeVm.selectedFilter })
      );

      if (homeVm.selectedGenre) {
        const filteredMovieByGenre = movies.filter(
          (movie) => movie.genre.toLocaleLowerCase() === homeVm.selectedGenre
        );
        homeVm.movieList = filteredMovieByGenre;
      } else {
        homeVm.movieList = movies.slice();
      }

      if (homeVm.selectedSort) {
        switch (homeVm.selectedSort) {
          case 'title':
          default:
            homeVm.movieList.sort((a, b) => a.title.localeCompare(b.title));
            break;
          case 'rating':
            homeVm.movieList.sort((a, b) => {
              return a.rating > b.rating ? -1 : 1;
            });
            break;
          case 'duration':
            homeVm.movieList.sort((a, b) => {
              return a.duration > b.duration ? -1 : 1;
            });
            break;
        }
      } else {
        homeVm.movieList.sort((a, b) => a.title.localeCompare(b.title));
      }

      if (homeVm.selectedFilter) {
        const filteredMovie = movies.filter(
          (movie) =>
            movie.title.toLowerCase().indexOf(homeVm.selectedFilter) !== -1 ||
            movie.genre.toLowerCase().indexOf(homeVm.selectedFilter) !== -1
        );
        homeVm.movieList = filteredMovie;
      }

      return homeVm;
    })
  );

  constructor() {
    this.store.dispatch(getMovies());
  }
}

class Vm {
  movieList: Movie[];
  selectedGenre: string;
  selectedSort: string;
  selectedFilter: string;

  constructor() {
    this.movieList = [];
    this.selectedGenre = '';
    this.selectedSort = '';
    this.selectedFilter = '';
  }
}
