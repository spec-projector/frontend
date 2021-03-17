import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LPComponent } from './lp.component';

export const routes: Routes = [
  {
    path: '',
    component: LPComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LPRoutingModule {
}
