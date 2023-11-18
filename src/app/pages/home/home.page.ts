import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { addDays, format } from 'date-fns';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';
import { parseDate } from 'src/app/utils/parseDate';
import esLocale from 'date-fns/locale/es';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  pet: string = '';
  lastPeriodDate: any;
  periodExists: boolean = false;
  nextPeriod: any;
  daysUntilNextPeriod: number = 0;
  nextFertileDay: any;
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
  isLoading: boolean = false;

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
    this.calculateNextPeriod();
  }

  /**
   * This function returns a random message each time
   */
  getRandomMessage() {
    const randomIndex = Math.floor(Math.random() * this.selectedMessages.length);
    this.messageToPrint = this.selectedMessages[randomIndex];
  }

  /**
   * This function saves a new note
   */
  saveNote() {
    this.isLoading = true;
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
      })
      .finally(() => this.isLoading = false);
  }

  /**
   * This function calculates the days for the next period
   */
  calculateNextPeriod() {
    this.userService.getSymptoms(this.userId!)
      .then((res: any) => {
        if (res.data) {
          res.data.forEach((item: any) => {
            item.date = item.date ? new Date(item.date) : null;
          });

          res.data.sort((a: any, b: any) => a.date.getTime() - b.date.getTime());
          for (let i = res.data.length -1; i >= 0; i--) {
            if (res.data[i].periodStarts) {
              this.lastPeriodDate = res.data[i].date;
              this.lastPeriodDate = new Date(this.lastPeriodDate!);
              this.periodExists = true;

              // Calculate the next period
              this.nextPeriod = addDays(this.lastPeriodDate, 28);
              const todayDate = new Date();
              this.daysUntilNextPeriod = Math.ceil((this.nextPeriod.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24));

              // Calculate next fertile day
              this.nextFertileDay = addDays(this.lastPeriodDate, 14);
              this.nextFertileDay = format(this.nextFertileDay, "d 'de' MMMM", {locale: esLocale});

              break;
            } else {
              this.periodExists = false;
            }
          }

        } else {
          this.periodExists = false;
        }
      })
      .catch(err => {})
  }
}
