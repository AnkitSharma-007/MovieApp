import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatestWith, map } from 'rxjs';
import { Movie } from 'src/app/models/movie';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  // Added the following two variables for better readability
  private readonly queryParams$ = this.activatedRoute.queryParams;
  private readonly movie$ = this.movieService.movies$;

  vm$ = this.queryParams$.pipe(
    combineLatestWith(this.movie$),
    map(([params, movies]) => {
      let homeVm = new Vm();

      homeVm.selectedGenre = params['genre'];
      homeVm.selectedSort = params['sortBy'];

      if (homeVm.selectedGenre) {
        const filteredMovie = movies.filter(
          (movie) => movie.genre.toLocaleLowerCase() === homeVm.selectedGenre
        );
        homeVm.movieList = filteredMovie;
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

      return homeVm;
    })
  );

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly movieService: MovieService
  ) {}
}

class Vm {
  movieList: Movie[];
  selectedGenre: string;
  selectedSort: string;

  constructor() {
    this.movieList = [];
    this.selectedGenre = '';
    this.selectedSort = '';
  }
}
