import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonModal, ModalController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { ModalAddAppointmentComponent } from 'src/app/components/modal-add-appointment/modal-add-appointment.component';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.page.html',
  styleUrls: ['./doctor.page.scss'],
})
export class DoctorPage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  doctors: any[] = [];
  isLoading: boolean = false;
  userId: string | undefined;
  userName: string | undefined;

  constructor(private userService: UserService, private alertController: AlertController, private modalCtrl: ModalController, private sharedService: SharedService) {
    this.isLoading = true;

    this.userService.getUsers()
      .then((res: any) => {
        this.doctors = res.data.filter((user: any) => user.role === 'doctor');
      })
      .catch(() => {})
      .finally(() => this.isLoading = false);

    //Get the data of the current user
    this.sharedService.loggedUser.subscribe((userData: any) => {
      if (userData.data) {
        this.userId = userData.data._id;
        this.userName = userData.data.fullName;
      }
    })
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

  /**
   * This function opens the modal for the user to select the date and hour
   * for the appointment
   */
  async openModal(doctorInfo: any) {
    this.isLoading = true;
    const modal = await this.modalCtrl.create({
      component: ModalAddAppointmentComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      const year = data.slice(0, 4);
      const month = data.slice(5, 7);
      const day = data.slice(8, 10);
      const hour = data.slice(11, 13);
      const minute = data.slice(14, 16);
      const finalDate = `Cita el ${day}-${month}-${year} a las ${hour}:${minute}`;
      const finalMessage = `${finalDate}. Doctor: '${doctorInfo.fullName}', Paciente: '${this.userName}'`;

      this.userService.updateAppointments(this.userId!, doctorInfo._id, finalMessage)
      .then(async (res) => {
        const alert = await this.alertController.create({
          header: 'Éxito',
          message: finalMessage,
          buttons: ['OK'],
        });
        await alert.present();
      })
      .catch(async (err) => {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'La fecha seleccionada no esta disponible para agendar cita',
          buttons: ['OK'],
        });
        await alert.present();
      })
      .finally(() => this.isLoading = false);
    }
  }
}
