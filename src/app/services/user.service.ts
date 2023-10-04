import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  URL = 'http://127.0.0.1:3000';

  constructor(private http: HttpClient) { }

  /**
   * This function calls the API to create a new user and save it in the DB
   * @param data User's data to create a new user
   * @returns A promise
   */
  createUser(data: any) { //TODO: Type
    return this.http.post(`${this.URL}/users`, data).toPromise();
  }

  /**
   * This function is for log in an user already registered
   * @param data User's data to log in
   * @returns A promise
   */
  loginUser(data: any) { //TODO: Type
    return this.http.put(`${this.URL}/login`, data).toPromise();
  }
}
