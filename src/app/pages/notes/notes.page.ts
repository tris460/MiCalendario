import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonModal, ModalController } from '@ionic/angular';
import { ModalAddNoteComponent } from 'src/app/components/modal-add-note/modal-add-note.component';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';
import { parseDate } from 'src/app/utils/parseDate';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
})
export class NotesPage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;

  date: string | Date = new Date();
  userId: string | undefined;
  notes: any[] = [];

  constructor(private modalCtrl: ModalController, private userService: UserService, private sharedService: SharedService, private alertController: AlertController) {
    //Get the data of the current user
    this.sharedService.loggedUser.subscribe((userData: any) => {
      if (userData.data) {
        this.userId = userData.data._id;
      }
    });

    this.date = parseDate(this.date);
  }

  ngOnInit() {
    this.getAllNotes();
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
      data.value.date = this.date;

      this.userService.addNote(this.userId!, this.date, data.value)
        .then(res => {
          this.getAllNotes();
        })
        .catch(async(err)=> {
          const alert = await this.alertController.create({
            header: 'Error',
            message: 'No fue posible guardar la nota, intenta nuevamente en unos minutos',
            buttons: ['OK'],
          });
          await alert.present();
        });
    }
  }

  /**
   * This function get all notes of the user
   */
  getAllNotes() {
    this.userService.getNotes(this.userId!)
      .then((res: any) => this.notes = res.data)
      .catch(async(err)=> {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'No fue posible obtener tus notas, intenta nuevamente en unos minutos',
          buttons: ['OK'],
        });
        await alert.present();
      })
  }
}
