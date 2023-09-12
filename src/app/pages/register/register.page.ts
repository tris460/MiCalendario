import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  userData = new FormGroup({
    email: new FormControl(''),
    pin: new FormControl(''),
    sex: new FormControl(''),
  });

  public alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
    },
    {
      text: 'Continuar',
      role: 'confirm',
      handler: () => {
        //TODO: Create a fake profile to login
        this.router.navigate(['/home']);
      },
    },
  ];

  constructor(private router: Router) { }

  ngOnInit() {
  }

  register() {
    //TODO: Register data in the BD
    console.log(this.userData.value);
  }
}
