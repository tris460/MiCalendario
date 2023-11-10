import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';
import { parseDate } from 'src/app/utils/parseDate';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  pet: string = '';
  maleMessages = [
    '¿Te falta motivación? Usa viagra y registralo en el calendario',
    '¿Te sientes mal? Tómate algo y regístralo en el calendario',
    '¿Tas bien? Regístralo en el calendario',
    'Echale ganas bro',
    '¿Qué pasa bro? ¿Te vas a quedar derrotado?',
    'Todo es mental, no pasa nada',
    '¡Echale huevos!',
    'En la vida hay que tener metas, entre más metas, mejor',
    '¿Te está llendo mal? Sé positivo',
    '¿Tas bien? '
  ]
  femaleMessages = [
    '¿Lele pansha? Regístralo en el calendario',
    'Recuerda echarle ganas, dios te hizo hermosa, no millonaria',
    '¿Cólicos? Tomate algo y regístralo en el calendario',
    'Desahogate aquí, nadie te va a escuchar igual que yo',
    'Hola moto mami ¿Todo bien? Regístralo en el calendario'
  ]
  selectedMessages = this.femaleMessages;
  messageToPrint: string = '¿Tas bien? Regístralo en el calendario';
  userId: string | undefined;
  date: string | Date = new Date();
  formDataToLoad: any;
  sex: string | undefined;
  data = new FormGroup({
    title: new FormControl(null),
    note: new FormControl(null),
    date: new FormControl(null)
  });

  constructor(private sharedService: SharedService, private userService: UserService, private alertController: AlertController) {
    this.pet = this.sharedService.currentUser.data.pet;
    this.date = parseDate(this.date);

    if (this.sharedService.currentUser.data.sex === 'male') {
      this.selectedMessages = this.maleMessages;
    } else  {
      this.selectedMessages = this.femaleMessages;
    }

    this.sharedService.loggedUser.subscribe((user: any) => {
      if (user) {
        this.sex = user.data.sex;
      }

      if (user.data) {
        this.userId = user.data._id;
      }
    });

    this.userService.getTodaysNote(this.userId!, this.date)
    .then((res: any) => {
      this.formDataToLoad = {
        note: res.data.note,
        title: res.data.title,
        date: this.date,
      }

      this.data.patchValue(this.formDataToLoad);
    })
    .catch(err => {})
  }

  ngOnInit() {
    this.getRandomMessage();
  }

  /**
   * This function returns a random message each time
   */
  getRandomMessage() {
    const randomIndex = Math.floor(Math.random() * this.selectedMessages.length);
    this.messageToPrint = this.selectedMessages[randomIndex];
  }

  saveNote() {
    this.userService.addNote(this.userId!, this.date, this.data.value)
      .then(async(err)=> {
        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'La nota fue guardada correctamente',
          buttons: ['OK'],
        });
        await alert.present();
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
