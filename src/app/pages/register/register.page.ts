import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { ModalRegisterUserComponent } from 'src/app/components/modal-register-user/modal-register-user.component';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';

async function sha256(input: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const emailHash = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  return emailHash;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  isNoPinDisabled = false;

  userData = new FormGroup({
    email: new FormControl(null),
    pin: new FormControl(null),
    noPin: new FormControl(null),
  });

  constructor(private router: Router,private modalCtrl: ModalController, private sharedService: SharedService, private userService: UserService, private alertController: AlertController) {
    
    
    // Validate if the PIN input is disabled or not
    this.userData.get('noPin')!.valueChanges.subscribe((value) => {
      if (value) {
        this.isNoPinDisabled = true;
        this.userData.get('pin')!.reset();
        this.userData.get('pin')!.disable();
      } else {
        this.isNoPinDisabled = false;
        this.userData.get('pin')!.enable();
      }
    });

    // If there's an user logged in and has a PIN, redirect him to login, else, redirect him to home
    const email = sessionStorage.getItem('userMiCalendario');
      console.log('Correo electrónico en sessionStorage:', email);

      if(email) {
        this.userService.getUser(email)
          .then(res => {
            this.sharedService.currentUser = res;
            this.sharedService.isLoggedIn = true;
            if(this.sharedService.currentUser.data.pin) {
              this.router.navigate(['/login']);
            } else {
              this.router.navigate(['/home']);
            }
          })
          .catch(err => console.error("No se puede obtener los datos del usuario"));
          }
      }

  ngOnInit() {
    
  }

  /**
   * This function logs in an user
   */
  login() {
    let formData = this.userData.value;
  
    if (formData.noPin) {
      formData = {
        email: formData.email,
        pin: null,
      }
    }
  
    this.userService.loginUser(formData)
      .then((res: any) => {
        this.sharedService.currentUser = res;
        this.sharedService.isLoggedIn = true;
        this.router.navigate(['/home']);
  
        if (formData.email) {
          // El correo no es nulo o indefinido, guarda el correo en sessionStorage
          sessionStorage.setItem('userMiCalendario', formData.email);
        } else {
          // El correo es nulo o indefinido, muestra un mensaje de error o maneja la situación
          console.error('El correo electrónico es nulo o indefinido');
        }
      })
      .catch(async(err) => {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Las credenciales ingresadas son incorrectas, intenta nuevamente',
          buttons: ['OK'],
        });
  
        await alert.present();
      })
  }

  /**
   * This function opens the modal when the user clicks the button, it also saves the data added by the user
   */
  async openModalRegister() {
    const modal = await this.modalCtrl.create({
      component: ModalRegisterUserComponent,
    });
    modal.present();
  
    const { data, role } = await modal.onWillDismiss();
  
    if (role === 'confirm') {
      let data = this.getFormData()?.value;
      
      this.userService.getUsers()
        .then(async(users: any) => {
          const InfoUser = users.data;        
          const emails = InfoUser.map((user: { email: string }) => user.email);

          if (emails.includes(data.email)) {
            const alert = await this.alertController.create({
              header: 'Error',
              message: 'Este email ya existe',
              buttons: ['OK'],
            });
            await alert.present();
          } else {
            console.log(data.noPin === true);
            
            if (data.noPin === true) {
              data = {
                  email: data.email,
                  fullName: data.fullName,
                  isDoctor: data.isDoctor,
                  noPin: data.noPin,
                  role: data.role,
                  sex: data.sex,
                  pin: null,
              }
              this.userService.createUser(data)
                .then(res => {
                  console.log('Usuario creado exitosamente:', res);
                  this.sharedService.currentUser = data;
                  this.sharedService.isLoggedIn = true;
                  this.router.navigate(['/home'])
                  .then(() => console.log('Redirigiendo a /home'))
                  .catch(err => console.log('Error al redirigir:', err));  
                  if (data.email) {
                    sessionStorage.setItem('userMiCalendario', data.email);
                  } else {
                    console.error('El correo electrónico es nulo o indefinido');
                  }
                })
                .catch(async (err) => {
                  console.error('Error al crear usuario:', err);  
                  const alert = await this.alertController.create({
                    header: 'Error',
                    message: 'No fue posible crear una cuenta, intenta nuevamente en unos minutos',
                    buttons: ['OK'],
                  });
                  await alert.present();
                });
            }else{
              this.userService.createUser(data)
                .then(res => {
                  console.log('Usuario creado exitosamente:', res);
                  this.sharedService.currentUser = data;
                  this.sharedService.isLoggedIn = true;
                  this.router.navigate(['/home'])
                  .then(() => console.log('Redirigiendo a /home'))
                  .catch(err => console.log('Error al redirigir:', err));  
                  if (data.email) {
                    sessionStorage.setItem('userMiCalendario', data.email);
                  } else {
                    console.error('El correo electrónico es nulo o indefinido');
                  }
                })
                .catch(async (err) => {
                  console.error('Error al crear usuario:', err);  
                  const alert = await this.alertController.create({
                    header: 'Error',
                    message: 'No fue posible crear una cuenta, intenta nuevamente en unos minutos',
                    buttons: ['OK'],
                  });
                  await alert.present();
                });
            }
          }
        })
        .catch((error) => {
          console.log(`Error getting users: ${error}`);
        });
    }
  }
  

  /**
   * This function obtains the data saved by the user in the form
   * @returns The last data saved by the user from the form in the modal
   */
  getFormData() {
    return this.sharedService.formDataRegister;
  }

  /**
   * This function validates the form to submit it
   */
  isValidForm(): boolean {
    const email = this.userData.get('email')!.value;
    const pin = this.userData.get('pin')!.value;
    const noPin = this.userData.get('noPin')!.value;

    const isEmailValid = !!email;
    let isPinValid = !!pin;

    if(noPin) {
      isPinValid = true;
    }

    return isEmailValid && isPinValid;
  }
}
