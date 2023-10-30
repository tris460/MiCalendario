import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { ModalRegisterUserComponent } from 'src/app/components/modal-register-user/modal-register-user.component';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  isNoPinDisabled = false;

  userData = new FormGroup({
    email: new FormControl(null),
    pin: new FormControl(null),
    noPin: new FormControl(null),
  });

  constructor(private router: Router,private modalCtrl: ModalController, private sharedService: SharedService, private userService: UserService, private alertController: AlertController) {
    
    
    // Validate if the PIN input is disabled or not
    this.userData.get('noPin')!.valueChanges.subscribe((value) => {
      if (value) {
        this.isNoPinDisabled = true;
        this.userData.get('pin')!.reset();
        this.userData.get('pin')!.disable();
      } else {
        this.isNoPinDisabled = false;
        this.userData.get('pin')!.enable();
      }
    });

    // If there's an user logged in and has a PIN, redirect him to login, else, redirect him to home
    const email = sessionStorage.getItem('userMiCalendario')
    if(email) {
      this.userService.getUser(email)
      .then(res => {
        this.sharedService.currentUser = res;
        this.sharedService.isLoggedIn = true;

        if(this.sharedService.currentUser.data.pin) {
          this.router.navigate(['/login']);
        } else {
          this.router.navigate(['/home']);
        }
      })
      .catch(err => console.error("Can't save user's data"));
    }
  }

  ngOnInit() {
    
  }

  /**
   * This function logs in an user
   */
  login() {
    this.userService.loginUser(this.userData.value)
      .then((res: any) => { // TODO: Type
        this.sharedService.currentUser = res;
        this.sharedService.isLoggedIn = true;
        this.router.navigate(['/home']);
        sessionStorage.setItem('userMiCalendario', this.userData.value.email!); //TODO: Encrypt
      })
      .catch(async(err) => {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Las credenciales ingresadas son incorrectas, intenta nuevamente',
          buttons: ['OK'],
        });

        await alert.present();
      })
  }

  /**
   * This function opens the modal when the user clicks the button, it also saves the data added by the user
   */
  async openModalRegister() {
    const modal = await this.modalCtrl.create({
      component: ModalRegisterUserComponent,
    });
    modal.present();
  
    const { data, role } = await modal.onWillDismiss();
  
    if (role === 'confirm') {
      let formData = this.getFormData()?.value;
      const InfoEmail = formData.email;
  
      this.userService.getUsers()
        .then(async(users: any) => {
          const InfoUser = users.data;
          // Use map to get an array of emails
          const emails = InfoUser.map((user: { email: string }) => user.email);
         
          if (emails.includes(InfoEmail)) {
            const alert = await this.alertController.create({
              header: 'Error',
              message: 'Este email ya existe',
              buttons: ['OK'],
            });
            await alert.present();
          } else {
            // The email does not exist, you can proceed to create the user
            this.userService.createUser(formData)
              .then(res => {
                this.sharedService.currentUser = formData;
                this.sharedService.isLoggedIn = true;
                this.router.navigate(['/home']);
                sessionStorage.setItem('userMiCalendario', this.userData.value.email!); // TODO: Encrypt
              })
              .catch(async (err) => {
                const alert = await this.alertController.create({
                  header: 'Error',
                  message: 'No fue posible crear una cuenta, intenta nuevamente en unos minutos',
                  buttons: ['OK'],
                });
                await alert.present();
              });
          }
        })
        .catch((error) => {
          console.log(`Error getting users: ${error}`);
        });
    }
  }
  

  /**
   * This function obtains the data saved by the user in the form
   * @returns The last data saved by the user from the form in the modal
   */
  getFormData() {
    return this.sharedService.formDataRegister;
  }

  /**
   * This function validates the form to submit it
   */
  isValidForm(): boolean {
    const email = this.userData.get('email')!.value;
    const pin = this.userData.get('pin')!.value;
    const noPin = this.userData.get('noPin')!.value;

    const isEmailValid = !!email;
    let isPinValid = !!pin;

    if(noPin) {
      isPinValid = true;
    }

    return isEmailValid && isPinValid;
  }
}
