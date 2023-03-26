import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Movie } from '../models/movie';
import { SubscriptionService } from './subscription.service';

@Injectable({
  providedIn: 'root',
})
export class WatchlistService {
  baseURL = '/api/watchlist/';

  constructor(
    private readonly http: HttpClient,
    private readonly subscriptionService: SubscriptionService
  ) {}

  getWatchlistItems(userId: number) {
    return this.http.get<Movie[]>(this.baseURL + userId).pipe(
      map((response) => {
        this.setWatchlist(response);
        return response;
      })
    );
  }

  toggleWatchlistItem(userId: number, movieId: number) {
    return this.http
      .post<Movie[]>(this.baseURL + `ToggleWatchlist/${userId}/${movieId}`, {})
      .pipe(
        map((response) => {
          this.setWatchlist(response);
          return response;
        })
      );
  }

  clearWatchlist(userId: number) {
    return this.http.delete(this.baseURL + `${userId}`, {}).pipe(
      map((response) => {
        this.setWatchlist([]);
        return response;
      })
    );
  }

  private setWatchlist(response: Movie[]) {
    this.subscriptionService.watchlistItemcount$.next(response.length);
    this.subscriptionService.watchlistItem$.next(response);
  }
}
