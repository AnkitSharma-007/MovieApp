import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatMiniFabButton } from '@angular/material/button';

@Component({
    selector: 'app-movie-rating',
    templateUrl: './movie-rating.component.html',
    styleUrls: ['./movie-rating.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [MatMiniFabButton],
})
export class MovieRatingComponent {
  rating = '';

  @Input() set movieRating(rating: number) {
    this.rating = rating.toPrecision(2);
  }
}
