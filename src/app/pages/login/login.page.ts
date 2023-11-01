import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';
import { compareSync } from 'bcryptjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  pin = '';
  email = sessionStorage.getItem('userMiCalendario');

  constructor(private router: Router, private sharedService: SharedService, private userService: UserService) {
    if(!this.sharedService.isLoggedIn) this.router.navigate(['/register']);
  }

  ngOnInit() {
  }

  /**
   * This function logs in an user if the PIN is correct
   */
  login() {
    if(this.pin.length < 4) return;

    let pin;

    if(this.sharedService.currentUser.data.pin) {
      const isPinValid = compareSync(this.pin.toString(), this.sharedService.currentUser.data.pin);
      
      if(isPinValid === true) this.router.navigateByUrl('/home')
      else this.delete();
    } else {
      this.userService.getUser(this.email!)
        .then((res: any) => { //TODO: Type
          pin = res.data.pin;
          const isPinValid = compareSync(this.pin.toString(), pin);
          if(isPinValid!) this.router.navigateByUrl('/home');
          else this.delete()
        })
        .catch(err => console.error("Can't save user's data"));
    }
  }

  /**
   * This function let us write in the input
   * @param value Number to be written
   */
  write(value: number) {
    if(this.pin.length == 4) return;

    this.pin += value;
  }

  /**
   * This function deletes the content of the input
   */
  delete() {
    this.pin = '';
  }

  /**
   * This function deletes the existent content in the session storage and
   * navigates to the register page
   */
  goToRegister() {
    sessionStorage.removeItem('userMiCalendario');
    this.router.navigate(['/register']);
  }
}
