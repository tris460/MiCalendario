import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.page.html',
  styleUrls: ['./doctor.page.scss'],
})
export class DoctorPage implements OnInit {
  doctors: any[] = [];
  isLoading: boolean = false;

  constructor(private userService: UserService, private alertController: AlertController) {
    this.isLoading = true;
    this.userService.getUsers()
      .then((res: any) => {
        this.doctors = res.data.filter((user: any) => user.role === 'doctor');
      })
      .catch(() => {})
      .finally(() => this.isLoading = false);
  }

  ngOnInit() {
  }

  /**
   * This function shows the data of a doctor in an alert
   * @param doctor Doctor selected to see its info
   */
  async showDoctorInfo(doctor: any) {
    const alert = await this.alertController.create({
      header: doctor.fullName,
      message: `Doctor en ${doctor.profession}, ${doctor.license}.
      Costo por consulta: $${doctor.cost}.
      Con consultorio en: ${doctor.officeAddress}.
      ${doctor.description}`,
      buttons: ['OK'],
    });
    await alert.present();
  }

}
