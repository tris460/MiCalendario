import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.page.html',
  styleUrls: ['./patients.page.scss'],
})
export class PatientsPage implements OnInit {
  userId: string | undefined;
  isLoading: boolean = false;
  appointments: string[] = [];

  constructor(private sharedService: SharedService, private userService: UserService) {
    //Get the data of the current user
    this.sharedService.loggedUser.subscribe((userData: any) => {
      if (userData.data) {
        this.userId = userData.data._id;
      }
    });
  }

  ngOnInit() {
    this.isLoading = true;
    this.userService.getAppointments(this.userId!)
    .then((res: any) => this.appointments = res.data)
    .catch(err => {})
    .finally(() => this.isLoading = false);
  }

}
