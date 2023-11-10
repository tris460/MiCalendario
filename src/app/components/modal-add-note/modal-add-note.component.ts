import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';
import { parseDate } from 'src/app/utils/parseDate';

@Component({
  selector: 'app-modal-add-note',
  templateUrl: './modal-add-note.component.html',
  styleUrls: ['./modal-add-note.component.scss'],
})
export class ModalAddNoteComponent  implements OnInit {
  data = new FormGroup({
    title: new FormControl(null),
    note: new FormControl(null),
  });
  userId: string | undefined;
  date: string | Date = new Date();
  formDataToLoad: any;

  constructor(private modalCtrl: ModalController, private userService: UserService, private sharedService: SharedService) {
    //Get the data of the current user
    this.sharedService.loggedUser.subscribe((userData: any) => {
      if (userData.data) {
        this.userId = userData.data._id;
      }
    });

    this.date = parseDate(this.date);

    this.userService.getTodaysNote(this.userId!, this.date)
      .then((res: any) => {
        this.formDataToLoad = {
          note: res.data.note,
          title: res.data.title,
        }

        this.data.patchValue(this.formDataToLoad);
      })
      .catch(err => console.error(err))
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
    return this.modalCtrl.dismiss(this.data, 'confirm');
  }
}
