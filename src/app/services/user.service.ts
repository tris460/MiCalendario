import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  URL = 'http://127.0.0.1:3000';

  constructor(private http: HttpClient, private sharedService: SharedService) { }

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

  /**
   * This function gets an user's info
   * @param email User's email to search in the DB
   * @returns A promise
   */
  getUser(email: string) {
    const params = {email: email};
    return this.http.get(`${this.URL}/user`, { params: params}).toPromise();
  }

  /**
   * This function updates the pet of an user
   * @param pet Url of the image the user selected
   * @returns A promise
   */
  updatePet(pet: string) {
    const data = { "pet": pet };
    return this.http.put(`${this.URL}/users/${this.sharedService.currentUser.data._id}/pet`, data).toPromise()
  }
}
