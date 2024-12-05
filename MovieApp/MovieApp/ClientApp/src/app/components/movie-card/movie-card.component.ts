import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCard, MatCardContent, MatCardImage } from '@angular/material/card';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Movie } from 'src/app/models/movie';
import { MovieRatingComponent } from '../movie-rating/movie-rating.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatCard,
    RouterLink,
    MatTooltip,
    MatCardImage,
    MatCardContent,
    MovieRatingComponent,
  ],
})
export class MovieCardComponent {
  @Input()
  movie!: Movie;

  isActive = false;
}
