import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app-delete-movie',
  templateUrl: './delete-movie.component.html',
  styleUrls: ['./delete-movie.component.scss'],
})
export class DeleteMovieComponent {
  movieData$ = this.movieService.getMovieById(this.movieid);

  constructor(
    @Inject(MAT_DIALOG_DATA) public movieid: number,
    private readonly movieService: MovieService
  ) {}

  confirmDelete(): void {
    this.movieService.deleteMovie(this.movieid).subscribe({
      error: (error) =>
        console.log('Error ocurred while deleting book data : ', error),
    });
  }
}
