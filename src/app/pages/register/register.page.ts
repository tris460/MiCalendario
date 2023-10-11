import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { IonModal, ModalController } from '@ionic/angular';
import { ModalRegisterUserComponent } from 'src/app/components/modal-register-user/modal-register-user.component';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  userData = new FormGroup({
    email: new FormControl(''),
    pin: new FormControl(''),
  });

  public alertButtons = [
    {
      text: 'Cancelar',
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

  constructor(private router: Router,private modalCtrl: ModalController, private sharedService: SharedService, private userService: UserService) { }

  ngOnInit() {
  }

  login() {
    //TODO: Register data in the BD
    console.log(this.userData.value);
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
}
