import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-add-appointment',
  templateUrl: './modal-add-appointment.component.html',
  styleUrls: ['./modal-add-appointment.component.scss'],
})
export class ModalAddAppointmentComponent  implements OnInit {
  selectedDateTime: any;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit(): void { }

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
    return this.modalCtrl.dismiss(this.selectedDateTime, 'confirm');
  }
}
