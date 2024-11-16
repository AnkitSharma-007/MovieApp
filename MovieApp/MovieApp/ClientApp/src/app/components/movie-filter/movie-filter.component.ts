import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { MovieService } from 'src/app/services/movie.service';
import { AsyncPipe, LowerCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatNavList, MatListItem } from '@angular/material/list';
import { Store } from '@ngrx/store';
import { getGenres } from 'src/app/state/actions/movie.actions';
import { selectGenres } from 'src/app/state/selectors/genre.selectors';

@Component({
  selector: 'app-movie-filter',
  templateUrl: './movie-filter.component.html',
  styleUrls: ['./movie-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatNavList, MatListItem, RouterLink, AsyncPipe, LowerCasePipe],
})
export class MovieFilterComponent {
  @Input()
  selectedGenre = '';

  private readonly store = inject(Store);

  constructor() {
    this.store.dispatch(getGenres());
  }

  genereList$ = this.store.select(selectGenres);
}
