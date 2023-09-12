import { Component, OnInit, ViewChild } from '@angular/core';
import { IonModal, ModalController } from '@ionic/angular';
import { ModalAddNoteComponent } from 'src/app/components/modal-add-note/modal-add-note.component';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
})
export class NotesPage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

   /**
   * This function opens the modal when the user clicks the FAB button, it also saves the data added by the user
   */
  async openModal() {
    const modal = await this.modalCtrl.create({
      component: ModalAddNoteComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      console.log('Save the data from form'); //TODO
    }
  }
}
