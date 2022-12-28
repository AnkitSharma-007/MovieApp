import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatestWith, map } from 'rxjs';
import { Movie } from 'src/app/models/movie';
import { MovieService } from 'src/app/services/movie.service';
import { SubscriptionService } from 'src/app/services/subscription.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  // Added the following two variables for better readability
  private readonly queryParams$ = this.activatedRoute.queryParams;
  private readonly movie$ = this.movieService.movies$.asObservable();

  vm$ = this.queryParams$.pipe(
    combineLatestWith(this.movie$),
    map(([params, movies]) => {
      let homeVm = new Vm();

      homeVm.selectedGenre = params['genre'];
      homeVm.selectedSort = params['sortBy'];
      homeVm.selectedFilter = params['item'];

      this.subscriptionService.searchItemValue$.next(homeVm.selectedFilter);

      if (homeVm.selectedGenre) {
        const filteredMovieByGenre = movies.filter(
          (movie) => movie.genre.toLocaleLowerCase() === homeVm.selectedGenre
        );
        homeVm.movieList = filteredMovieByGenre;
      } else {
        homeVm.movieList = movies;
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

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly movieService: MovieService,
    private readonly subscriptionService: SubscriptionService
  ) {}
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
