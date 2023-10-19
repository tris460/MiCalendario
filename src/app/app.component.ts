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
  role: string = 'patient';
  sex: string = 'female';

  constructor(private sharedService: SharedService) {
    setTimeout(() => { //TODO: Add spinner
      this.role = this.sharedService.role;
      this.sex = this.sharedService.sex;
    }, 1500);
  }
}
