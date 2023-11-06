import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SharedService {
  public formData: FormGroup | undefined;
  public formDataRegister: FormGroup | undefined;
  public formDataSymptoms: any;
  public modalDate: any;
  public currentUser: any = {}; //TODO: Type
  public isLoggedIn: Boolean = false;
  private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor() { }

  /**
   * This function updates the data for the current user
   * @param user Data to be saved as user
   */
  updateCurrentUser(user: any): void {
    if(user.data) {
      this.currentUserSubject.next(user);
    } else {
      let newUser = { data: user };
      this.currentUserSubject.next(newUser);
    }
  }

  /**
   * This function returns an observable for the variable currentUserSubject
   */
  get loggedUser(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }
}
