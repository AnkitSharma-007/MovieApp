import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Movie } from '../models/movie';

@Injectable({
  providedIn: 'root',
})
export class WatchlistService {
  private readonly http = inject(HttpClient);
  private readonly baseURL = '/api/watchlist/';

  getWatchlistItems(userId: number) {
    return this.http.get<Movie[]>(this.baseURL + userId);
  }

  toggleWatchlistItem(userId: number, movieId: number) {
    return this.http.post<Movie[]>(
      this.baseURL + `ToggleWatchlist/${userId}/${movieId}`,
      {}
    );
  }

  clearWatchlist(userId: number) {
    return this.http.delete(this.baseURL + `${userId}`);
  }
}
