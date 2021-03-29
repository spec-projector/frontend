import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LpComponent } from './lp.component';

export const routes: Routes = [
  {
    path: '',
    component: LpComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LPRoutingModule {

}
