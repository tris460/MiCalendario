import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  pin = '';

  constructor(private router: Router) { }

  ngOnInit() {
  }

  login() {
    if(this.pin.length < 4) return;

    //TODO: Validate PIN
    this.router.navigateByUrl('/home');
  }

  write(value: number) {
    if(this.pin.length == 4) return;

    this.pin += value;
  }

  delete() {
    this.pin = '';
  }
}
