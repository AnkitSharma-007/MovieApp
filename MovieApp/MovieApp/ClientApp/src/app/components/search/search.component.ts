import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { MatOption } from '@angular/material/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  combineLatestWith,
  map,
  ReplaySubject,
  startWith,
  takeUntil,
} from 'rxjs';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { selectMovies } from 'src/app/state/selectors/movie.selectors';

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
export class SearchComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly subscriptionService = inject(SubscriptionService);

  searchControl = new FormControl<string>('', { nonNullable: true });
  private destroyed$ = new ReplaySubject<void>(1);
  private readonly movie$ = this.store.select(selectMovies);

  filteredMovie$ = this.searchControl.valueChanges.pipe(
    startWith(''),
    combineLatestWith(this.movie$),
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

  ngOnInit(): void {
    this.setSearchControlValue();
  }

  searchStore() {
    const searchItem = this.searchControl.value;
    if (searchItem !== '') {
      this.router.navigate(['/search'], {
        queryParams: {
          item: searchItem.toLowerCase(),
        },
      });
    }
  }

  private setSearchControlValue() {
    this.subscriptionService.searchItemValue$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        if (data) {
          this.searchControl.setValue(data);
        } else {
          this.searchControl.setValue('');
        }
      });
  }

  cancelSearch() {
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
