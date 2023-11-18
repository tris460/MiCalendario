import { Component, OnInit,  ViewChild } from '@angular/core';
import { AlertController, IonModal, ModalController } from '@ionic/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';
import { parseDate } from 'src/app/utils/parseDate';

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
  todayNote: any;
  symptoms: any = null;
  isLoading: boolean = false;

  // Options to configure the calendar
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: esLocale,
    dateClick: async (info) => {
      this.isLoading = true;
      await this.openModal(info);
      this.isLoading = false;
    }
  };

  constructor(private modalCtrl: ModalController, private sharedService: SharedService, private userService: UserService, private alertController: AlertController) {
    //Get the data of the current user
    this.sharedService.loggedUser.subscribe((userData: any) => {
      if (userData.data) {
        this.userId = userData.data._id;
      }
    })

    this.todayDate = this.parseTodayDate(this.todayDate);

    // Get today's note
    this.userService.getTodaysNote(this.userId!, this.todayDate)
      .then((res: any) => this.todayNote = res.data)
      .catch(err => {})

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

    const selectedDate = this.parseTodayDate(info.date)
    const symptomsOfTheDate = this.symptoms.find((symptom: any) => symptom.date == selectedDate);

    if (symptomsOfTheDate) {
      this.sharedService.modalDate = selectedDate;
      this.sharedService.formDataSymptoms = symptomsOfTheDate;
    } else {
      this.sharedService.modalDate = null;
      this.sharedService.formDataSymptoms = null;
    }

    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      const formData: any = this.getFormData()!.value
       formData.date = selectedDate;

      // Data is true if the symptom has to be updated, false if it's a new symptom
      if (data) {
        this.userService.updateSymptom(this.userId!, selectedDate, formData)
        .then((res) => this.getUserSymptoms())
        .catch(async(err)=> {
          const alert = await this.alertController.create({
            header: 'Error',
            message: 'No fue posible actualizar tus síntomas, intenta nuevamente en unos minutos',
            buttons: ['OK'],
          });
          await alert.present();
        });
      } else {
        this.userService.addSymptoms(this.userId!, formData)
        .then((res) => {
          this.getUserSymptoms();
          this.getTodaySymptoms();
        })
        .catch(async(err)=> {
          const alert = await this.alertController.create({
            header: 'Error',
            message: 'No fue posible actualizar tus datos, intenta nuevamente en unos minutos',
            buttons: ['OK'],
          });
          await alert.present();
        });
      }

      if (selectedDate == this.todayDate) {
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
  parseTodayDate(originalDate: any) {
    return parseDate(originalDate);
  }

  /**
   * Generates the title depending on symptoms
   */
  generateEventTitle(symptom: any): string {
    let title = '';

    if (symptom.condom || symptom.orgasm || symptom.sexualActs) {
      title += '❤️';
    }
    if (symptom.viagra || symptom.emergencyPill || symptom.contraceptives.length > 0) {
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
      this.symptoms = res.data;

      const events = this.symptoms.map((symptom: any) => {
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
    .catch(err => {})
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
