import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.page.html',
  styleUrls: ['./doctor.page.scss'],
})
export class DoctorPage implements OnInit {
  doctors: any[] = [];

  constructor(private userService: UserService) {
    this.userService.getUsers()
      .then((res: any) => {
        this.doctors = res.data.filter((user: any) => user.role === 'doctor');
        console.log(this.doctors)
      })
      .catch((err: any) => {
        console.log(err)
      })
  }

  ngOnInit() {
  }

}
