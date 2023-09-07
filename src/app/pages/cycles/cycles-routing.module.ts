import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CyclesPage } from './cycles.page';

const routes: Routes = [
  {
    path: '',
    component: CyclesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CyclesPageRoutingModule {}
