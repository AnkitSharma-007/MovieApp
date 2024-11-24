import { NgClass } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { ReplaySubject, takeUntil } from 'rxjs';
import { Movie } from 'src/app/models/movie';
import { toggleWatchlist } from 'src/app/state/actions/watchlist.actions';
import { selectAuthenticatedUser } from 'src/app/state/selectors/auth.selectors';
import { selectWatchlistItems } from 'src/app/state/selectors/watchlist.selectors';

@Component({
  selector: 'app-add-to-watchlist',
  templateUrl: './add-to-watchlist.component.html',
  styleUrls: ['./add-to-watchlist.component.scss'],
  standalone: true,
  imports: [MatButton, NgClass, MatIcon],
})
export class AddToWatchlistComponent implements OnInit, OnChanges, OnDestroy {
  private readonly store = inject(Store);
  movieId = 0;
  userId = 0;
  @Input() set id(movieId: number) {
    this.movieId = movieId;
  }

  toggle = false;
  buttonText = '';
  fontIcon = 'add_circle';
  private destroyed$ = new ReplaySubject<void>(1);

  ngOnInit() {
    this.store
      .select(selectAuthenticatedUser)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((user) => {
        if (user) {
          this.userId = user.userId;
        }
      });
  }

  ngOnChanges() {
    this.store
      .select(selectWatchlistItems)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((movieData: Movie[]) => {
        this.setFavourite(movieData);
        this.setButtonText();
      });
  }

  toggleValue() {
    this.toggle = !this.toggle;
    this.setButtonText();
    this.store.dispatch(
      toggleWatchlist({
        userId: this.userId,
        movieId: this.movieId,
        isAdd: this.toggle,
      })
    );
  }

  private setFavourite(movieData: Movie[]) {
    const favouriteMovie = movieData.find((f) => f.movieId === this.movieId);

    if (favouriteMovie) {
      this.toggle = true;
    } else {
      this.toggle = false;
    }
  }

  private setButtonText() {
    if (this.toggle) {
      this.buttonText = 'Remove from Watchlist';
      this.fontIcon = 'remove_circle';
    } else {
      this.buttonText = 'Add to Watchlist';
      this.fontIcon = 'add_circle';
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
