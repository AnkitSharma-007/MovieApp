import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';

@Component({
    selector: 'app-movie-sort',
    templateUrl: './movie-sort.component.html',
    styleUrls: ['./movie-sort.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatCard,
        MatCardHeader,
        MatCardTitle,
        MatCardContent,
        MatFormField,
        MatLabel,
        MatSelect,
        MatOption,
    ],
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
