import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
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
  };
  constructor() { }

  ngOnInit() {
  }

}
