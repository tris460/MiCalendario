import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-modal-register-user',
  templateUrl: './modal-register-user.component.html',
  styleUrls: ['./modal-register-user.component.scss'],
})
export class ModalRegisterUserComponent  implements OnInit {
  data = new FormGroup({
    fullName: new FormControl(null),
    email: new FormControl(null),
    pin: new FormControl(null),
    noPin: new FormControl(null),
    sex: new FormControl(null),
    doctor: new FormControl(null),
    license: new FormControl(null),
    profession: new FormControl(null),
    description: new FormControl(null),
    cost: new FormControl(null),
    officeAddress: new FormControl(null),
  });

  constructor(private modalCtrl: ModalController, private sharedService: SharedService) { }

  ngOnInit() {}

  /**
   * This function controls the action the modal it's going to do if the user clicks out
   * of it or if the option 'cancel' is selected
   */
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  /**
   * This function controls the action the modal it's going to do if the user clicks in
   * confirm in the modal
   */
  confirm() {
    this.sharedService.formDataRegister = this.data;
    return this.modalCtrl.dismiss(this.data, 'confirm');
  }
}
