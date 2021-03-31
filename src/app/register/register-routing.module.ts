import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoneLoggedGuard } from '../../guards/aurhorisation';
import { RegisterComponent } from './register.component';

export const routes: Routes = [
  {
    path: '',
    component: RegisterComponent,
    canActivate: [NoneLoggedGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterRoutingModule {

}
