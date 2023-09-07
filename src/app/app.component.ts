import { Component } from '@angular/core';
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
    { title: 'Ajustes', url: '/settings', icon: 'settings' },
  ];

  constructor() {}
}
