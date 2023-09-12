import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent  implements OnInit {
  name: string = '';
  emojisEmotions = ['🙂','🙃','😉','🫠','😊','😇','😀','😄','😁','😆','😅','😂','🥰','😍','🤩','😘','😗','😚','🥲','😋','😛','😜','🤪','🤑','🤗','🫢','🤭','🫣','🤫','🤔','🫡','🤐','🤨','😐','😑','😶','🫥','😏','😒','🙄','😬','😮‍💨','🤥','😌','😔','😪','🤤','😴','🤯','😵‍💫','🥳','🥸','🫤','😕','😟','🙁','😮','😳','🥺','🥹','😦','😨','😰','😢','😭','😱','😖','😓','😩','🥱','😤','😡','🤬','😠'];
  emojisSymptoms = ['😷','😴','🤒','🤕','🤢','🤮','🤧','🥵','🥶','🥴','🤯','💩','👃','🧠','🫀','🫁','🦷','🦴'];

  selectedEmojisEmotions: string[] = [];
  selectedEmojisSymptoms: string[] = [];

  constructor(private modalCtrl: ModalController) {}

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
    return this.modalCtrl.dismiss(this.name, 'confirm');
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
}
