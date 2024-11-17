import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserRegistration } from '../models/userRegistration';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly baseURL = '/api/user/';

  registerUser(userdetails: UserRegistration) {
    return this.http.post(this.baseURL, userdetails);
  }

  validateUserName(userName: string) {
    return this.http.get(`${this.baseURL}/${userName}`);
  }
}
