import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  /**
   * This function calls the API to create a new user and save it in the DB
   * @param data
   * @returns
   */
  createUser(data: any) {
    return this.http.post('http://127.0.0.1:3000/users', data).toPromise();
  }
}
