import { Component } from '@angular/core';
import { SharedService } from './services/shared.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Inicio', url: '/home', icon: 'home' },
    { title: 'Calendario', url: '/calendar', icon: 'calendar' },
    { title: 'Notas', url: '/notes', icon: 'create' },
    { title: 'Ciclos', url: '/cycles', icon: 'reload' },
    { title: 'Pacientes', url: '/patients', icon: 'people' },
    { title: 'Doctor', url: '/doctor', icon: 'medkit' },
    { title: 'Ajustes', url: '/settings', icon: 'settings' },
  ];
  role: string | undefined;
  sex: string | undefined;

  constructor(private sharedService: SharedService) {
    this.sharedService.loggedUser.subscribe((user: any) => {
      if (user) {
        this.role = user.data.role;
        this.sex = user.data.sex;
      }
    });
  }
}
