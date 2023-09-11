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

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.name, 'confirm');
  }

  toggleEmoji(emoji: string, selected: string[]) {
    const index = selected.indexOf(emoji);
    if (index === -1) {
      selected.push(emoji);
    } else {
      selected.splice(index, 1);
    }
  }

  isSelected(emoji: string, selected: string[]): boolean {
    return selected.includes(emoji);
  }
}
