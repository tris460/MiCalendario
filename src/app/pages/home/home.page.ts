import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  pet: string = '';

  constructor(private sharedService: SharedService) {
    //this.pet = this.sharedService.currentUser.data.pet;
  }

  ngOnInit() {
  }

}
