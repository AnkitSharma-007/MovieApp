import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-sort',
  templateUrl: './movie-sort.component.html',
  styleUrls: ['./movie-sort.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieSortComponent {
  @Input()
  selectedSort = '';

  constructor(private router: Router) {}

  SortMovieData(event: any) {
    this.router.navigate(['/filter'], {
      queryParams: { sortBy: event.value },
      queryParamsHandling: 'merge',
    });
  }
}
