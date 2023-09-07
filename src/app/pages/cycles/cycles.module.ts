import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CyclesPageRoutingModule } from './cycles-routing.module';

import { CyclesPage } from './cycles.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CyclesPageRoutingModule
  ],
  declarations: [CyclesPage]
})
export class CyclesPageModule {}
