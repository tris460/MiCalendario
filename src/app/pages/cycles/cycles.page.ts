import { Component, OnInit } from '@angular/core';
import { addDays, format } from 'date-fns';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';
import esLocale from 'date-fns/locale/es';

@Component({
  selector: 'app-cycles',
  templateUrl: './cycles.page.html',
  styleUrls: ['./cycles.page.scss'],
})
export class CyclesPage implements OnInit {
  lastPeriodDate: Date | undefined;
  lastPeriodFormatted: any;
  userId: string | undefined;
  symptomsExist: boolean = false;
  menstrualCycle = 28;
  nextPeriod: any[] = [];

  constructor(private sharedService: SharedService, private userService: UserService) {
    //Get the data of the current user
    this.sharedService.loggedUser.subscribe((userData: any) => {
      if (userData.data) {
        this.userId = userData.data._id;
      }
    });

    this.getLastPeriod();
  }

  ngOnInit() { }

  /**
   * This function obtains the date of the last period
   */
  getLastPeriod() {
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
              this.lastPeriodFormatted = format(this.lastPeriodDate, "EEEE d 'de' MMMM 'de' yyyy", {locale: esLocale});
              this.symptomsExist = true;

              // Calculate the next periods
              for (let i = 0; i <= 11; i++) {
                const date: string | Date = addDays(this.lastPeriodDate, this.menstrualCycle * i);
                const formattedDate = format(date, "EEEE d 'de' MMMM 'de' yyyy", {locale: esLocale});
                this.nextPeriod.push(formattedDate);
              }

              break;
            } else {
              this.symptomsExist = false;
            }
          }

        } else {
          this.symptomsExist = false;
        }
      })
      .catch(err => console.error(err))
  }

}
