import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MeUserResolver } from '../../resolvers/me';
import { LpComponent } from './lp.component';

export const routes: Routes = [
  {
    path: '',
    component: LpComponent,
    resolve: {me: MeUserResolver}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LpRoutingModule {

}
