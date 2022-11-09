import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-movie-rating',
  templateUrl: './movie-rating.component.html',
  styleUrls: ['./movie-rating.component.scss'],
})
export class MovieRatingComponent {
  rating = '';

  @Input() set movieRating(rating: number) {
    this.rating = rating.toPrecision(2);
  }
}
