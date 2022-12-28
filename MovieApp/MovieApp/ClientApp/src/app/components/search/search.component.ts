import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import {
  combineLatestWith,
  map,
  ReplaySubject,
  startWith,
  takeUntil,
} from 'rxjs';
import { MovieService } from 'src/app/services/movie.service';
import { SubscriptionService } from 'src/app/services/subscription.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit, OnDestroy {
  searchControl = new FormControl<string>('', { nonNullable: true });
  private destroyed$ = new ReplaySubject<void>(1);
  private readonly movie$ = this.movieService.movies$.asObservable();

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

  constructor(
    private readonly router: Router,
    private readonly subscriptionService: SubscriptionService,
    private readonly movieService: MovieService
  ) {}

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
