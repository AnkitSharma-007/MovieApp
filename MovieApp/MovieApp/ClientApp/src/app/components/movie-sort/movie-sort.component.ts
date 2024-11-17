import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatOption } from '@angular/material/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';

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

  private readonly router = inject(Router);

  SortMovieData(event: any) {
    this.router.navigate(['/filter'], {
      queryParams: { sortBy: event.value },
      queryParamsHandling: 'merge',
    });
  }
}
