import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SharedService } from 'src/app/services/shared.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent  implements OnInit {
  sex: string | undefined;

  emojisEmotions = ['🙂','🙃','😉','🫠','😊','😇','😀','😄','😁','😆','😅','😂','🥰','😍','🤩','😘','😗','😚','🥲','😋','😛','😜','🤪','🤑','🤗','🫢','🤭','🫣','🤫','🤔','🫡','🤐','🤨','😐','😑','😶','🫥','😏','😒','🙄','😬','😮‍💨','🤥','😌','😔','😪','🤤','😴','🤯','😵‍💫','🥳','🥸','🫤','😕','😟','🙁','😮','😳','🥺','🥹','😦','😨','😰','😢','😭','😱','😖','😓','😩','🥱','😤','😡','🤬','😠'];
  emojisSymptoms = ['😷','😴','🤒','🤕','🤢','🤮','🤧','🥵','🥶','🥴','🤯','💩','👃','🧠','🫀','🫁','🦷','🦴'];
  contraceptivesList = ['Píldora','Anillo hormonal','Inyección anticonceptiva','Implante','DIU','Esponja anticonceptiva','Diafragma','Parche anticonceptivo','Espermicida'];

  selectedEmojisEmotions: string[] = [];
  selectedEmojisSymptoms: string[] = [];
  selectedContraceptives: string[] = [];

  data = new FormGroup({
    periodStarts: new FormControl(null),
    periodEnds: new FormControl(null),
    emergencyPill: new FormControl(null),
    viagra: new FormControl(null),
    testicularPain: new FormControl(null),
    bald: new FormControl(null),
    pregnant: new FormControl(null),
    pregnancyWeeks: new FormControl(null),
    contraceptives: new FormControl(this.selectedContraceptives),
    condom: new FormControl(null),
    orgasm: new FormControl(null),
    sexualActs: new FormControl(null),
    temperature: new FormControl(null),
    emotions: new FormControl(this.selectedEmojisEmotions),
    symptoms: new FormControl(this.selectedEmojisSymptoms),
    weight: new FormControl(null),
    height: new FormControl(null),
    water: new FormControl(null),
    sleep: new FormControl(null),
  });

  constructor(private modalCtrl: ModalController, private sharedService: SharedService) {
    this.sharedService.loggedUser.subscribe((user: any) => {
      if (user) this.sex = user.data.sex;
    })
  }

  ngOnInit(){
  }

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
    this.sharedService.formData = this.data;
    return this.modalCtrl.dismiss(this.data, 'confirm');
  }

  /**
   * This function verifies if an emoji has already been selected by the user. If yes, it is
   * removed from the array, else, it is added
   * @param emoji Emoji selected by the user
   * @param selected Array of selected emojis
   */
  toggleEmoji(emoji: string, selected: string[]) {
    const index = selected.indexOf(emoji);
    if (index === -1) {
      selected.push(emoji);
    } else {
      selected.splice(index, 1);
    }
  }

  /**
   * This function verifies if an emoji is selected by the user and returns true/false depending
   * on it
   * @param emoji Emoji selected by the user
   * @param selected Array of selected emojis
   * @returns Boolean value, true if the array (selected) contains the emoji
   */
  isSelected(emoji: string, selected: string[]): boolean {
    return selected.includes(emoji);
  }

  /**
   * This function updates the value 'condom' in the form group 'data'
   * @param event Ion-radio data
   */
  onCondomChange(event: any) {
    this.data.patchValue({ condom: event.detail.value });
  }

  /**
   * This function updates the value 'orgasm' in the form group 'data'
   * @param event Ion-radio data
   */
  onOrgasmChange(event: any) {
    this.data.patchValue({ orgasm: event.detail.value });
  }
}
