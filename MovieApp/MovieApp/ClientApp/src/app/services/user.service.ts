import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserRegistration } from '../models/userRegistration';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseURL = '/api/user/';
  constructor(private http: HttpClient) {}

  registerUser(userdetails: UserRegistration) {
    console.log({ userdetails });
    return this.http.post(this.baseURL, userdetails);
  }

  validateUserName(userName: string) {
    return this.http.get(`${this.baseURL}/${userName}`);
  }
}
