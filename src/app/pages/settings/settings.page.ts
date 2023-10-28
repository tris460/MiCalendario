import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';
import { isValidForm } from 'src/app/utils/isValidForm';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;

  images: string[] = [];
  selectedImage: string;
  data = new FormGroup({
    fullName: new FormControl(null),
    email: new FormControl(null),
    pin: new FormControl(null),
    noPin: new FormControl(null),
    sex: new FormControl('female'),
    isDoctor: new FormControl(null),
    license: new FormControl({value: null, disabled: true}),
    profession: new FormControl({value: null, disabled: true}),
    description: new FormControl({value: null, disabled: true}),
    cost: new FormControl({value: null, disabled: true}),
    officeAddress: new FormControl({value: null, disabled: true}),
    role: new FormControl('patient')
  });

  isNoPinDisabled: boolean | undefined;
  registerForDoctor: boolean | undefined;

  constructor(private sharedService: SharedService, private router: Router, private userService: UserService, private alertController: AlertController) {
    for (let i = 1; i <= 10; i++) {
      this.images.push(`assets/pets/pet${i}.png`);
    }

    this.selectedImage = this.sharedService.currentUser.data.pet;

    //Get the data of the current user
    this.sharedService.loggedUser.subscribe((userData: any) => {
      if (userData.data) {
        if (!userData.data.pin) {
          userData.data.pin = '';
          userData.data.noPin = true;
          this.isNoPinDisabled = true;
          this.data.get('pin')!.disable();
        } else {
          this.isNoPinDisabled = false;
          this.data.get('pin')!.enable();
        }

        if (userData.data.role !== 'doctor') {
          userData.data.isDoctor = false;
          this.registerForDoctor = false;
          this.data.get('license')!.disable();
          this.data.get('profession')!.disable();
          this.data.get('description')!.disable();
          this.data.get('cost')!.disable();
          this.data.get('officeAddress')!.disable();
        } else {
          userData.data.isDoctor = true;
          this.registerForDoctor = true;
          this.data.get('license')!.enable();
          this.data.get('profession')!.enable();
          this.data.get('description')!.enable();
          this.data.get('cost')!.enable();
          this.data.get('officeAddress')!.enable();
        }

        Object.keys(userData.data).forEach(key => {
          if (key !== '_id') {
            this.data.get(key)?.setValue(userData.data[key]);
          }
        });
      }
    });

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

  ngOnInit() {
  }

  /**
   * This function logs out an user by removing the data from the shared service and session storage
   * and redirects the user to register
   */
  logout() {
    this.sharedService.currentUser = null;
    this.sharedService.isLoggedIn = false;
    sessionStorage.clear();
    sessionStorage.removeItem('userMiCalendario'); //TODO: cuando el usuario cierra sesión y tiene PIN, mandar a /login
    this.router.navigate(['/register']);
    location.reload();
  }

  updateLoginData() {
    console.log(this.data);
    //TODO: Implement function
  }

  /**
   * This function controls the action the modal it's going to do if the user clicks out
   * of it or if the option 'cancel' is selected
   */
  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  /**
   * This function controls the action the modal it's going to do if the user clicks in
   * confirm in the modal
   */
  confirm() {
    this.modal.dismiss(this.selectedImage, 'confirm');
    this.userService.updatePet(this.selectedImage)
      .then((res: any) => {
        this.sharedService.currentUser.data = res.data;
      })
      .catch(async(err) => {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'No fue posible actualizar la mascota, intenta nuevamente',
          buttons: ['OK'],
        });

        await alert.present();
      })
  }

  /**
   * This function listens the user's click in the modal (cancel or confirm) and executes a
   * function for each one.
   * @param event Data from the modal to listen which option was selected by the user
   */
  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      console.log(ev.detail.data);
    }
  }

  /**
   * This function selects an image to be updated in the user profile
   * @param imagePath Url of the image selected
   */
  selectImage(imagePath: string) {
    this.selectedImage = imagePath;
  }

  /**
   * This function verifies if the given form is filled correctly
   * @returns Boolean, true if the form is correct, false if not
   */
  isValidForm(): boolean {
    return isValidForm(this.data);
  }
}
