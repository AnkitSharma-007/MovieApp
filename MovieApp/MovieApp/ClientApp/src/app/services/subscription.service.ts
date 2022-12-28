import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Movie } from '../models/movie';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  userData$ = new BehaviorSubject<User>(new User());
  searchItemValue$ = new BehaviorSubject<string>('');
  watchlistItemcount$ = new BehaviorSubject<number>(0);
  watchlistItem$ = new BehaviorSubject<Movie[]>([]);
}
