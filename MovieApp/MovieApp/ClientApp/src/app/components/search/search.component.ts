import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { MatOption } from '@angular/material/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatestWith, distinctUntilChanged, map, startWith } from 'rxjs';
import {
  selectMovies,
  selectSearchItemValue,
} from 'src/app/state/selectors/movie.selectors';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
    AsyncPipe,
  ],
})
export class SearchComponent {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  searchControl = new FormControl('', { nonNullable: true });
  private readonly movie$ = this.store.select(selectMovies);

  searchItemValue$ = this.store.select(selectSearchItemValue).pipe(
    map((data) => {
      this.searchControl.setValue(data);
    })
  );

  filterSuggetions$ = this.searchControl.valueChanges.pipe(
    startWith(''),
    combineLatestWith(this.movie$, this.searchItemValue$),
    distinctUntilChanged(),
    map(([searchValue, movies]) => {
      const value = searchValue.toLowerCase();
      if (value.length > 0) {
        return movies.filter(
          (movie) =>
            movie.title.toLocaleLowerCase().includes(value) ||
            movie.genre.toLocaleLowerCase().includes(value)
        );
      } else {
        return [];
      }
    })
  );

  searchMovies() {
    const searchItem = this.searchControl.value;
    if (searchItem) {
      this.router.navigate(['/search'], {
        queryParams: {
          item: searchItem.toLowerCase(),
        },
      });
    } else {
      this.cancelSearch();
    }
  }

  cancelSearch() {
    this.router.navigate(['/']);
  }
}
