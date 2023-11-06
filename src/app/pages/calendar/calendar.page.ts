import { Component, OnInit,  ViewChild } from '@angular/core';
import { AlertController, IonModal, ModalController } from '@ionic/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;

  name: string = '';
  userId: string | undefined;
  todayDate: any = new Date();
  isTodayData: boolean = false;
  todayData: any;

  // Options to configure the calendar
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: esLocale,
    dateClick: async (info) => {
      await this.openModal(info);
    }
  };

  constructor(private modalCtrl: ModalController, private sharedService: SharedService, private userService: UserService, private alertController: AlertController) {
    //Get the data of the current user
    this.sharedService.loggedUser.subscribe((userData: any) => {
      if (userData.data) {
        this.userId = userData.data._id;
      }
    })

    this.todayDate = this.parseDate(this.todayDate);
    this.getTodaySymptoms();
  }

  ngOnInit() {
    this.getUserSymptoms();
  }

  /**
   * This function opens the modal when the user clicks a day, it also saves the data added by the user
   * @param info Data coming from the calendar, it contains the information about the day clicked
   */
  async openModal(info: DateClickArg) {
    const modal = await this.modalCtrl.create({
      component: ModalComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
     const formData: any = this.getFormData()!.value
      const date = this.parseDate(info.date)
      formData.date = date;
      this.userService.addSymptoms(this.userId!, formData)
      .then((res) => this.getUserSymptoms())
      .catch(async(err)=> {
        console.error(err)
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'No fue posible actualizar tus datos, intenta nuevamente en unos minutos',
          buttons: ['OK'],
        });

        await alert.present();
      })

      if (date == this.todayDate) {
        this.getTodaySymptoms();
      }
    }
  }

  /**
   * This function obtains the data saved by the user in the form
   * @returns The last data saved by the user from the form in the modal
   */
  getFormData() {
    return this.sharedService.formData;
  }

  /**
   * This function updates a date into YYYY-MM-DD format
   * @param originalDate Date to parse
   * @returns A string with the new date
   */
  parseDate(originalDate: any) {
    // Parse the original date in a date objet
    const date = new Date(originalDate);

    // Get year, month and date
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // Format date "YYYY-MM-DD"
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    return formattedDate;
  }

  /**
   * Generates the title depending on symptoms
   */
  generateEventTitle(symptom: any): string {
    let title = '';

    if (symptom.condom || symptom.orgasm || symptom.sexualActs) {
      title += '❤️';
    }
    if (symptom.viagra || symptom.emergencyPill || symptom.contraceptives) {
      title += '💊';
    }
    if (symptom.periodStarts || symptom.periodEnds) {
      title += '🩸';
    }
    if (symptom.pregnant || symptom.pregnancyWeeks) {
      title += '🤰🏻';
      if (title.length >= 3) return title;
    }
    if (symptom.height || symptom.weight) {
      title += '📏';
      if (title.length >= 3) return title;
    }
    if (symptom.sleep) {
      title += '💤';
      if (title.length >= 3) return title;
    }
    if (symptom.temperature) {
      title += '🌡️';
      if (title.length >= 3) return title;
    }
    if (symptom.water) {
      title += '💧';
      if (title.length >= 3) return title;
    }
    if (symptom.bald) {
      title += '👨🏻‍🦲';
      if (title.length >= 3) return title;
    }
    if (symptom.testicularPain) {
      title += '⚫';
      if (title.length >= 3) return title;
    }
    if (symptom.emotions.length > 0) {
      for (let i = 0; i < symptom.emotions.length; i++) {
        title += symptom.emotions[i]
        if (title.length >= 3) return title;
      }
    }
    if (symptom.symptoms.length > 0) {
      for (let i = 0; i < symptom.symptoms.length; i++) {
        title += symptom.symptoms[i]
        if (title.length >= 3) return title;
      }
    }

    return title;
  }

  /**
   * This function gets the registered symptoms of the user
   */
  getUserSymptoms() {
    this.userService.getSymptoms(this.userId!)
    .then((res: any) => {
      const symptoms = res.data;

      const events = symptoms.map((symptom: any) => {
        const generatedTitle = this.generateEventTitle(symptom);
        return {
          title: generatedTitle,
          start: symptom.date,
          end: symptom.date,
          allDay: true,
          backgroundColor: '#fff',
          borderColor: '#fff',
        }
      });

      this.calendarOptions.events = events;
    })
    .catch(err => console.error(err))
  }

  /**
   * This function returns the symptoms registered for the current date
   */
  getTodaySymptoms() {
    this.userService.getSymptom(this.userId!, this.todayDate)
    .then((res: any) => {
      this.isTodayData = true;
      this.todayData = res!.data[0]
    })
    .catch((err) => {
      if (err.error == "No symptoms found for the specified date") {
        this.isTodayData = false
      }
    })
  }
}
