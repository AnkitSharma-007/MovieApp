import { FormControl } from '@angular/forms';

export interface MovieForm {
  movieId: FormControl<number>;
  title: FormControl<string>;
  overview: FormControl<string>;
  genre: FormControl<string>;
  language: FormControl<string>;
  duration: FormControl<number>;
  rating: FormControl<number>;
}
