import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public formData: FormGroup | undefined;

  constructor() { }
}
