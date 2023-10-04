import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonModal, ModalController } from '@ionic/angular';
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
  }

  ngOnInit() {
  }

  /**
   * This function logs in an user
   */
  login() {
    this.userService.loginUser(this.userData.value)
      .then(res => {
        console.log('Credenciales válidas')
        //TODO: Redirect to home
        //TODO: Save credentials somewhere
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
      let data = this.getFormData()?.value;
      this.userService.createUser(data)
      .then(res => {
        //TODO: Redirect to home/login
      })
      .catch(err => console.error(err))
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
