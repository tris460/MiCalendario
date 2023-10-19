import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;

  images: string[] = [];
  selectedImage: string;
  user = {
    fullName: null,
    email: null,
    pin: null,
    noPin: null,
    sex: null,
    doctor: null,
    license: null,
    profession: null,
    description: null,
    cost: null,
    officeAddress: null,
  }

  constructor(private sharedService: SharedService, private router: Router, private userService: UserService, private alertController: AlertController) {
    for (let i = 1; i <= 10; i++) {
      this.images.push(`assets/pets/pet${i}.png`);
    }

    this.selectedImage = this.sharedService.currentUser.data.pet;
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
    console.log(this.user);
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
}
