import { AsyncPipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { EMPTY, ReplaySubject, switchMap, takeUntil } from 'rxjs';
import { Movie } from 'src/app/models/movie';
import { MovieService } from 'src/app/services/movie.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { selectGenres } from 'src/app/state/selectors/genre.selectors';
import { MovieForm } from '../../models/movie-form';
import { getGenres } from 'src/app/state/actions/movie.actions';

@Component({
  selector: 'app-movie-form',
  templateUrl: './movie-form.component.html',
  styleUrls: ['./movie-form.component.scss'],
  standalone: true,
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
export class MovieFormComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly movieService = inject(MovieService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
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
  protected genereList$ = this.store.select(selectGenres);
  protected formTitle = 'Add';
  private destroyed$ = new ReplaySubject<void>(1);

  private formData = new FormData();
  posterImagePath!: string | ArrayBuffer | null;
  movieId!: number;
  files = '';

  constructor() {
    this.store.dispatch(getGenres());
  }

  ngOnInit(): void {
    this.fetchMovieDetails();
  }

  private fetchMovieDetails() {
    this.activatedRoute.paramMap
      .pipe(
        switchMap((params) => {
          this.movieId = Number(params.get('movieId'));
          if (this.movieId > 0) {
            this.formTitle = 'Edit';
            return this.movieService.getMovieById(this.movieId);
          } else {
            return EMPTY;
          }
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe({
        next: (result: Movie | undefined) => {
          if (result) {
            this.setMovieFormData(result);
          }
        },
        error: (error) => {
          this.snackBarService.showSnackBar(
            'Error ocurred while fetching movie data'
          );
          console.error('Error ocurred while fetching movie data : ', error);
        },
      });
  }

  protected get movieFormControl() {
    return this.movieForm.controls;
  }

  protected onFormSubmit(): void {
    if (!this.movieForm.valid) {
      return;
    }

    if (this.files && this.files.length > 0) {
      for (let j = 0; j < this.files.length; j++) {
        this.formData.append('file' + j, this.files[j]);
      }
    }

    this.formData.append('movieFormData', JSON.stringify(this.movieForm.value));

    if (this.movieId) {
      this.editMovieDetails();
    } else {
      this.addMovie();
    }
  }

  private addMovie() {
    this.movieService
      .addMovie(this.formData)
      .pipe(
        switchMap(() => this.movieService.fetchMovieData()),
        takeUntil(this.destroyed$)
      )
      .subscribe({
        next: () => {
          this.navigateToAdminPanel();
        },
        error: (error) => {
          this.movieForm.reset();
          this.snackBarService.showSnackBar(
            'Error ocurred while adding movie data'
          );
          console.error('Error ocurred while adding movie data : ', error);
        },
      });
  }

  private editMovieDetails() {
    this.movieService
      .updateMovieDetails(this.formData)
      .pipe(
        switchMap(() => this.movieService.fetchMovieData()),
        takeUntil(this.destroyed$)
      )
      .subscribe({
        next: () => {
          this.navigateToAdminPanel();
        },
        error: (error) => {
          this.snackBarService.showSnackBar(
            'Error ocurred while updating movie data'
          );
          console.error('Error ocurred while updating movie data : ', error);
        },
      });
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
    this.router.navigate(['/admin/movies']);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
