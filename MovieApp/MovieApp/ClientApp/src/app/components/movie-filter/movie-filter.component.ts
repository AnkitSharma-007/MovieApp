import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MovieService } from 'src/app/services/movie.service';
import { NgFor, AsyncPipe, LowerCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatNavList, MatListItem } from '@angular/material/list';

@Component({
    selector: 'app-movie-filter',
    templateUrl: './movie-filter.component.html',
    styleUrls: ['./movie-filter.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatNavList,
        MatListItem,
        RouterLink,
        NgFor,
        AsyncPipe,
        LowerCasePipe,
    ],
})
export class MovieFilterComponent {
  @Input()
  selectedGenre = '';

  genereList$ = this.movieService.genre$;

  constructor(private readonly movieService: MovieService) {}
}
