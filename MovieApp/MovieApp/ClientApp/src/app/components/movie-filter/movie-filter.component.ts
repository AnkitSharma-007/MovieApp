import { Component, Input } from '@angular/core';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-movie-filter',
  templateUrl: './movie-filter.component.html',
  styleUrls: ['./movie-filter.component.scss'],
})
export class MovieFilterComponent {
  @Input()
  genreName = '';

  genereList$ = this.movieService.genre$;

  constructor(private readonly movieService: MovieService) {}
}
