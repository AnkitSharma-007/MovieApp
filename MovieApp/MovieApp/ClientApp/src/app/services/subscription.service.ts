import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Movie } from '../models/movie';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  searchItemValue$ = new BehaviorSubject<string>('');
  watchlistItemcount$ = new BehaviorSubject<number>(0);
  watchlistItem$ = new BehaviorSubject<Movie[]>([]);
}
