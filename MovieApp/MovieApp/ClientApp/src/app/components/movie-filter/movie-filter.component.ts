import { AsyncPipe, LowerCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { MatListItem, MatNavList } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { getGenres } from 'src/app/state/actions/movie.actions';
import { selectGenres } from 'src/app/state/selectors/genre.selectors';

@Component({
    selector: 'app-movie-filter',
    templateUrl: './movie-filter.component.html',
    styleUrls: ['./movie-filter.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatNavList, MatListItem, RouterLink, AsyncPipe, LowerCasePipe]
})
export class MovieFilterComponent {
  @Input()
  selectedGenre = '';

  private readonly store = inject(Store);
  genereList$ = this.store.select(selectGenres);

  constructor() {
    this.store.dispatch(getGenres());
  }
}
