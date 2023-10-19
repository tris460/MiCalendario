import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public formData: FormGroup | undefined;
  public formDataRegister: FormGroup | undefined;
  public currentUser: any; //TODO: Type
  public isLoggedIn: Boolean = false;
  public sex: string = 'female'
  public role: string = 'patient'

  constructor() { }
}
