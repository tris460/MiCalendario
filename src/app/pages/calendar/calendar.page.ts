import { Component, OnInit,  ViewChild } from '@angular/core';
import { IonModal, ModalController } from '@ionic/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { ModalComponent } from 'src/app/components/modal/modal.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;

  name: string = '';

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: [
      {
        title: '🤢🤧🥱',
        start: '2023-09-10',
        end: '2023-09-10',
        allDay: true,
        backgroundColor: '#fff',
        borderColor: '#fff',
      }
    ],
    locale: esLocale,
    dateClick: async (info) => {
      await this.openModal(info);
    }
  };

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  async openModal(info: DateClickArg) {
    const modal = await this.modalCtrl.create({
      component: ModalComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      console.log('Save the data from form'); //TODO
      console.log(info.date);
    }
  }
}
