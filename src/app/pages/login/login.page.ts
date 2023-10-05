import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  pin = '';

  constructor(private router: Router, private sharedService: SharedService) {
    if(!this.sharedService.isLoggedIn) this.router.navigate(['/register']);
  }

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

  goToRegister() {
    sessionStorage.removeItem('userMiCalendario');
    this.router.navigate(['/register']);
  }
}
