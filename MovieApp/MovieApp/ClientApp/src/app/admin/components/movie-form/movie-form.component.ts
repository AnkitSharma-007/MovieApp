import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardImage,
  MatCardTitle,
} from '@angular/material/card';
import { MatOption } from '@angular/material/core';
import {
  MatError,
  MatFormField,
  MatHint,
  MatLabel,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { catchError, combineLatest, EMPTY, map } from 'rxjs';
import { Movie } from 'src/app/models/movie';
import { SnackbarService } from 'src/app/services/snackbar.service';
import {
  addMovie,
  cancelMovieFormNavigation,
  getGenres,
  updateMovie,
} from 'src/app/state/actions/movie.actions';
import { selectGenres } from 'src/app/state/selectors/genre.selectors';
import { selectCurrentMovieDetails } from 'src/app/state/selectors/movie.selectors';
import { MovieForm } from '../../models/movie-form';

@Component({
  selector: 'app-movie-form',
  templateUrl: './movie-form.component.html',
  styleUrls: ['./movie-form.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatSelect,
    MatOption,
    MatHint,
    MatCardActions,
    MatButton,
    MatCardImage,
    MatIcon,
    AsyncPipe,
  ],
})
export class MovieFormComponent {
  private readonly store = inject(Store);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly snackBarService = inject(SnackbarService);

  protected movieForm: FormGroup<MovieForm> = this.formBuilder.group({
    movieId: 0,
    title: this.formBuilder.control('', Validators.required),
    genre: this.formBuilder.control('', Validators.required),
    language: this.formBuilder.control('', Validators.required),
    overview: this.formBuilder.control('', [
      Validators.required,
      Validators.maxLength(1000),
    ]),
    duration: this.formBuilder.control(0, [
      Validators.required,
      Validators.min(1),
    ]),
    rating: this.formBuilder.control(0, [
      Validators.required,
      Validators.min(0.0),
      Validators.max(10.0),
    ]),
  });

  private formData = new FormData();
  posterImagePath!: string | ArrayBuffer | null;
  files = '';

  movieFormData$ = combineLatest([
    this.store.select(selectCurrentMovieDetails),
    this.store.select(selectGenres),
  ]).pipe(
    map(([movie, genres]) => {
      if (movie !== undefined) {
        this.setMovieFormData(movie);
      }
      return {
        formTitle: movie?.movieId ? 'Edit' : 'Add',
        genres,
      };
    }),
    catchError((error) => {
      this.snackBarService.showSnackBar(
        'Error ocurred while fetching movie data'
      );
      console.error('Error ocurred while fetching movie data : ', error);
      return EMPTY;
    })
  );

  constructor() {
    this.store.dispatch(getGenres());
  }

  protected get movieFormControl() {
    return this.movieForm.controls;
  }

  protected onFormSubmit(): void {
    if (!this.movieForm.valid) {
      return;
    }

    if (this.files && this.files.length > 0) {
      this.formData.append('file', this.files[0]);
    }

    this.formData.append('movieFormData', JSON.stringify(this.movieForm.value));

    if (this.movieForm.controls.movieId.value > 0) {
      this.store.dispatch(updateMovie({ movie: this.formData }));
    } else {
      this.store.dispatch(addMovie({ movie: this.formData }));
    }
  }

  private setMovieFormData(movieFormData: Movie) {
    this.movieForm.setValue({
      movieId: movieFormData.movieId,
      title: movieFormData.title,
      genre: movieFormData.genre,
      language: movieFormData.language,
      duration: movieFormData.duration,
      rating: movieFormData.rating,
      overview: movieFormData.overview,
    });
    this.posterImagePath = '/Poster/' + movieFormData.posterPath;
  }

  // TODO : Remove any
  uploadImage(event: any) {
    this.files = event.target.files;
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (myevent: ProgressEvent) => {
      this.posterImagePath = (myevent.target as FileReader).result;
    };
  }

  navigateToAdminPanel() {
    this.store.dispatch(cancelMovieFormNavigation());
  }
}
