import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-modal-register-user',
  templateUrl: './modal-register-user.component.html',
  styleUrls: ['./modal-register-user.component.scss'],
})
export class ModalRegisterUserComponent  implements OnInit {
  isNoPinDisabled = false;
  registerForDoctor = false;

  data = new FormGroup({
    fullName: new FormControl(null),
    email: new FormControl(null),
    pin: new FormControl(null),
    noPin: new FormControl(null), //TODO: Validate we need this variable
    sex: new FormControl('female'),
    isDoctor: new FormControl(null),
    license: new FormControl({value: null, disabled: true}),
    profession: new FormControl({value: null, disabled: true}),
    description: new FormControl({value: null, disabled: true}),
    cost: new FormControl({value: null, disabled: true}),
    officeAddress: new FormControl({value: null, disabled: true}),
    role: new FormControl('patient')
  });

  constructor(private modalCtrl: ModalController, private sharedService: SharedService) {
    // Validate if the PIN input is disabled or not
    this.data.get('noPin')!.valueChanges.subscribe((value) => {
      if (value) {
        this.isNoPinDisabled = true;
        this.data.get('pin')!.reset();
        this.data.get('pin')!.disable();
      } else {
        this.isNoPinDisabled = false;
        this.data.get('pin')!.enable();
      }
    });

    // Disable inputs if the user isn't a doctor
    this.data.get('isDoctor')!.valueChanges.subscribe((value) => {
      if (value) {
        this.registerForDoctor = true;
        this.data.get('license')!.enable();
        this.data.get('profession')!.enable();
        this.data.get('description')!.enable();
        this.data.get('cost')!.enable();
        this.data.get('officeAddress')!.enable();
      } else {
        this.registerForDoctor = false;
        this.data.get('license')!.reset();
        this.data.get('license')!.disable();
        this.data.get('profession')!.reset();
        this.data.get('profession')!.disable();
        this.data.get('description')!.reset();
        this.data.get('description')!.disable();
        this.data.get('cost')!.reset();
        this.data.get('cost')!.disable();
        this.data.get('officeAddress')!.reset();
        this.data.get('officeAddress')!.disable();
      }
    });
  }

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

  /**
   * This function validates the form to submit it
   */
  isValidForm(): boolean {
    const fullName = this.data.get('fullName')!.value;
    const email = this.data.get('email')!.value;
    const isDoctor = this.data.get('isDoctor')!.value;

    // Verify if there're null values
    const isFullNameValid = !!fullName;
    const isEmailValid = !!email;
    const isPinValid = this.validatePin();

    if(isDoctor) {
      this.data.get('role')?.setValue('doctor');

      const license = this.data.get('license')!.value;
      const profession = this.data.get('profession')!.value;
      const description = this.data.get('description')!.value;
      const cost = this.data.get('cost')!.value;
      const officeAddress = this.data.get('officeAddress')!.value;

      // Verify if there're null values
      const isLicenseValid = !!license;
      const isProfessionValid = !!profession;
      const isDescriptionValid = !!description;
      const isCostValid = !!cost;
      const isOfficeAddressValid = !!officeAddress;

      const isDoctorValid = isLicenseValid && isProfessionValid && isDescriptionValid && isCostValid && isOfficeAddressValid;

      return isDoctorValid && isFullNameValid && isEmailValid && isPinValid;
    }

    this.data.get('role')?.setValue('patient');
    return isFullNameValid && isEmailValid && isPinValid;
  }

  /**
   * Verifies the content of the PIN input
   * @returns Boolean depending if the value in the PIN input is valid
   */
  validatePin(): boolean {
    const pin = this.data.get('pin')!.value;
    const noPin = this.data.get('noPin')!.value;

    if(noPin) return true;
    if (pin && /^[0-9]{4}$/.test(pin)) {
      return true;
    }

    return false;
  }
}
