import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  URL = 'https://comfortable-underclothes-colt.cyclic.app';

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
   * This function gets all the registered users
   * @returns A promise
   */
  getUsers() {
    return this.http.get(`${this.URL}/users`).toPromise();
  }

  /**
   * This function updates the data of a user
   * @param id Identifier of the user in the database
   * @param data Data to put instead the original one
   * @returns A promise
   */
  updateUser(id: string, data: any) {
    return this.http.put(`${this.URL}/users/${id}`, data).toPromise();
  }

  /**
   * This function updates the pet of an user
   * @param pet Url of the image the user selected
   * @returns A promise
   */
  updatePet(pet: string) {
    const data = { "pet": pet };
    return this.http.put(`${this.URL}/users/${this.sharedService.currentUser.data._id}/pet`, data).toPromise();
  }

  /**
   * This function updates the appointments of the doctor and patient
   * @param userId1 Identifier for the patient
   * @param userId2 Identifier for the doctor
   * @param appointment Information of the appointment
   * @returns A promise
   */
  updateAppointments(userId1: string, userId2: string, appointment: string) {
    const data = { "userId1": userId1, "userId2": userId2, "appointment": appointment };
    return this.http.put(`${this.URL}/users/updateAppointments`, data).toPromise();
  }

  /**
   * This function saves the symptoms of the user in the database
   * @param id Identifier of the user in the database
   * @param data Data to be saved
   * @returns A promise
   */
  addSymptoms(id: string, data: any) {
    return this.http.post(`${this.URL}/users/${id}/symptoms`, data).toPromise();
  }

  /**
   * This function returns the symptoms of the user on a specific date
   * @param id Identifier of the user in the database
   * @param date Date to filter the symptoms
   * @returns A promise
   */
  getSymptom(id: string, date: any) {
    const params = new HttpParams().set('date', date);
    return this.http.get(`${this.URL}/users/${id}/symptoms`, { params }).toPromise();
  }

  /**
   * This function obtains all the symptoms of the user
   * @param id Identifier of the user in the database
   * @returns A promise
   */
  getSymptoms(id: string){
    return this.http.get(`${this.URL}/users/${id}/symptoms/all`).toPromise();
  }

  /**
   * This function updates the data of the symptoms on a specific date
   * @param id Identifier for the current user
   * @param date Date of the symptoms to update
   * @param symptoms Data to update
   * @returns A promise
   */
  updateSymptom(id: string, date: string, symptoms: any) {
    return this.http.put(`${this.URL}/users/${id}/symptoms/${date}`, symptoms).toPromise();
  }

  /**
   * This function adds a note in case it didn't exist, else, it updates the note
   * @param id User's identification
   * @param date Note's date
   * @param data Note's data
   * @returns A promise
   */
  addNote(id: string, date: string | Date, data: any) {
    return this.http.put(`${this.URL}/users/${id}/symptoms/${date}/notes`, data).toPromise();
  }

  /**
   * This function gets a note of a specific date
   * @param id User's identification
   * @param date Note's date
   * @returns A promise
   */
  getTodaysNote(id: string, date: string | Date) {
    return this.http.get(`${this.URL}/users/${id}/symptoms/${date}/notes`).toPromise();
  }

  /**
   * This function gets all notes of an user
   * @param id User's identification
   * @returns A promise
   */
  getNotes(id: string) {
    return this.http.get(`${this.URL}/users/${id}/notes`).toPromise();
  }
}
