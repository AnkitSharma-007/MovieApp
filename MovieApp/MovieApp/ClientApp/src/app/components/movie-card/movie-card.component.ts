import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Movie } from 'src/app/models/movie';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  @Input()
  movie!: Movie;

  isActive = false;

  constructor(private readonly router: Router) {}

  ngOnInit(): void {}

  goToPage(movieId: number) {
    this.router.navigate(['/movies/details/', movieId]);
  }
}
