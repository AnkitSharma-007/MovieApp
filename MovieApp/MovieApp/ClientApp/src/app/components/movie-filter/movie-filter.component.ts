import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-movie-filter',
  templateUrl: './movie-filter.component.html',
  styleUrls: ['./movie-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieFilterComponent {
  @Input()
  selectedGenre = '';

  genereList$ = this.movieService.genre$;

  constructor(private readonly movieService: MovieService) {}
}
