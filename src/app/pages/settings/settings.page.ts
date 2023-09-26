import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;

  images: string[] = [];
  selectedImage: string = '';

  constructor() {
    for (let i = 1; i <= 10; i++) {
      this.images.push(`assets/pets/pet${i}.png`);
    }
  }

  ngOnInit() {
  }

  logout() {
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
    //TODO: Update user's pet in DB
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

  selectImage(imagePath: string) {
    this.selectedImage = imagePath;
  }
}
