import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-add-note',
  templateUrl: './modal-add-note.component.html',
  styleUrls: ['./modal-add-note.component.scss'],
})
export class ModalAddNoteComponent  implements OnInit {
  name: string = '';

  constructor(private modalCtrl: ModalController) { }

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
    return this.modalCtrl.dismiss(this.name, 'confirm');
  }
}
