import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  pet: string = '';
  maleMessages = [
    '¿Te falta motivación? Usa viagra y registralo en el calendario',
    '¿Te sientes mal? Tómate algo y regístralo en el calendario',
    '¿Tas bien? Regístralo en el calendario',
    'Echale ganas bro',
    '¿Qué pasa bro? ¿Te vas a quedar derrotado?',
    'Todo es mental, no pasa nada',
    '¡Echale huevos!',
    'En la vida hay que tener metas, entre más metas, mejor',
    '¿Te está llendo mal? Sé positivo',
    '¿Tas bien? '
  ]
  femaleMessages = [
    '¿Lele pansha? Regístralo en el calendario',
    'Recuerda echarle ganas, dios te hizo hermosa, no millonaria',
    '¿Cólicos? Tomate algo y regístralo en el calendario',
    'Desahogate aquí, nadie te va a escuchar igual que yo',
    'Hola moto mami ¿Todo bien? Regístralo en el calendario'
  ]
  selectedMessages = this.femaleMessages;
  messageToPrint: string = '¿Tas bien? Regístralo en el calendario';

  constructor(private sharedService: SharedService) {
    this.pet = this.sharedService.currentUser.data.pet;
    if (this.sharedService.currentUser.data.sex === 'male') {
      this.selectedMessages = this.maleMessages;
    } else  {
      this.selectedMessages = this.femaleMessages;
    }
  }

  ngOnInit() {
    this.getRandomMessage();
  }

  getRandomMessage() {
    const randomIndex = Math.floor(Math.random() * this.selectedMessages.length);
    this.messageToPrint = this.selectedMessages[randomIndex];
  }
}
